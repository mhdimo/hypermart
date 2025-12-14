/**
 * HyperMart Database Connection
 * 
 * This module connects to the pre-populated hypermart.db SQLite database.
 * The database is included in the repository for demo purposes.
 * 
 * Database contains:
 * - 8 product categories
 * - 6 suppliers  
 * - 4 stores (Milan, Rome, Turin, Naples)
 * - 10 customers
 * - 20 products
 * - 8 operators
 * - 5 promotions
 * - 30+ days of sales history
 * 
 * Triggers included:
 * - trg_log_prezzo_prodotto: Logs price changes
 * - trg_calc_subtotale_riga: Auto-calculates line subtotals
 * - trg_aggiorna_stock_dopo_vendita: Updates stock after sales
 * - trg_aggiorna_totali_testata: Updates sale totals
 * - trg_aggiorna_totali_testata_delete: Recalculates on delete
 * - trg_ripristina_stock_dopo_cancellazione: Restores stock on delete
 */

import Database from 'better-sqlite3';
import { building } from '$app/environment';

let db: Database.Database;

if (!building) {
	db = new Database('hypermart.db');
	db.pragma('journal_mode = WAL');
}

// =====================================================
// STORED PROCEDURE EQUIVALENTS (Functions)
// These replicate MySQL stored procedures in JavaScript
// =====================================================

/**
 * sp_RegistraNuovaVendita - Creates a new sale record
 * Returns the ID of the newly created sale
 */
export function spRegistraNuovaVendita(
	idPuntoVendita: number,
	idCliente: number | null,
	idOperatore: number | null,
	metodoPagamento?: string
): number {
	const result = db.prepare(`
		INSERT INTO vendite_testata (ID_PuntoVendita, ID_Cliente, ID_Operatore, MetodoPagamento, TotaleImponibile, TotaleIVA, TotaleVendita)
		VALUES (?, ?, ?, ?, 0, 0, 0)
	`).run(idPuntoVendita, idCliente, idOperatore, metodoPagamento || null);
	
	return Number(result.lastInsertRowid);
}

/**
 * sp_AggiungiProdottoAScontrino - Adds a product to a sale
 * Automatically fetches price and IVA from the product
 */
export function spAggiungiProdottoAScontrino(
	idVendita: number,
	idLotto: number | null,
	idProdotto: number,
	quantitaVenduta: number
): void {
	// Get product info
	const product = db.prepare(`
		SELECT PrezzoUnitarioVendita, AliquotaIVA 
		FROM prodotti 
		WHERE ID_Prodotto = ?
	`).get(idProdotto) as { PrezzoUnitarioVendita: number; AliquotaIVA: number } | undefined;
	
	if (!product) {
		throw new Error(`Prodotto con ID ${idProdotto} non trovato`);
	}

	// Check stock availability if using a lot
	if (idLotto) {
		const lotto = db.prepare(`
			SELECT QuantitaAttuale 
			FROM lottiprodotto_stock 
			WHERE ID_Lotto = ?
		`).get(idLotto) as { QuantitaAttuale: number } | undefined;
		
		if (!lotto || lotto.QuantitaAttuale < quantitaVenduta) {
			throw new Error('Quantità non disponibile in magazzino per questo lotto');
		}
	}
	
	const subtotale = quantitaVenduta * product.PrezzoUnitarioVendita;
	
	// Insert - triggers will handle stock update and totals
	db.prepare(`
		INSERT INTO vendite_dettaglio (ID_Vendita, ID_Lotto, ID_Prodotto, QuantitaVenduta, PrezzoUnitarioApplicato, AliquotaIVA, SubtotaleRiga)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`).run(idVendita, idLotto, idProdotto, quantitaVenduta, product.PrezzoUnitarioVendita, product.AliquotaIVA, subtotale);
}

/**
 * sp_CreaOrdineFornitore - Creates a new supplier order
 * Returns the ID of the newly created order
 */
export function spCreaOrdineFornitore(
	idFornitore: number,
	idPuntoVendita: number,
	idProdotto: number,
	quantitaOrdinata: number
): number {
	// Get estimated cost from recent lots
	const ultimoLotto = db.prepare(`
		SELECT CostoAcquistoUnitario
		FROM lottiprodotto_stock
		WHERE ID_Prodotto = ?
		ORDER BY DataCarico DESC
		LIMIT 1
	`).get(idProdotto) as { CostoAcquistoUnitario: number } | undefined;
	
	const costoPrevisto = ultimoLotto?.CostoAcquistoUnitario || 0;
	
	const oggi = new Date().toISOString().split('T')[0];
	const consegnaPrevista = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
	
	// Create order header
	const resultTestata = db.prepare(`
		INSERT INTO ordinifornitore_testata (ID_Fornitore, ID_PuntoVenditaDestinazione, DataOrdine, DataConsegnaPrevista, StatoOrdine)
		VALUES (?, ?, ?, ?, 'Bozza')
	`).run(idFornitore, idPuntoVendita, oggi, consegnaPrevista);
	
	const idOrdine = Number(resultTestata.lastInsertRowid);
	
	// Add order detail
	db.prepare(`
		INSERT INTO ordinifornitore_dettaglio (ID_OrdineFornitore, ID_Prodotto, QuantitaOrdinata, CostoUnitarioPrevisto)
		VALUES (?, ?, ?, ?)
	`).run(idOrdine, idProdotto, quantitaOrdinata, costoPrevisto);
	
	return idOrdine;
}

/**
 * sp_AggiornaStatoOrdine - Updates supplier order status
 */
export function spAggiornaStatoOrdine(
	idOrdineFornitore: number,
	nuovoStato: string
): void {
	db.prepare(`
		UPDATE ordinifornitore_testata
		SET StatoOrdine = ?
		WHERE ID_OrdineFornitore = ?
	`).run(nuovoStato, idOrdineFornitore);
}

/**
 * Verifica disponibilità stock - Check stock availability before sale
 */
export function verificaDisponibilitaStock(
	idLotto: number,
	quantitaRichiesta: number
): { disponibile: boolean; quantitaAttuale: number } {
	const lotto = db.prepare(`
		SELECT QuantitaAttuale 
		FROM lottiprodotto_stock 
		WHERE ID_Lotto = ?
	`).get(idLotto) as { QuantitaAttuale: number } | undefined;
	
	if (!lotto) {
		return { disponibile: false, quantitaAttuale: 0 };
	}
	
	return {
		disponibile: lotto.QuantitaAttuale >= quantitaRichiesta,
		quantitaAttuale: lotto.QuantitaAttuale
	};
}

export { db };
