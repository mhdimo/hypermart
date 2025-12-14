import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const stock = db.prepare(`
		SELECT l.*, p.NomeProdotto, p.CodiceBarre, pv.NomePuntoVendita
		FROM lottiprodotto_stock l
		JOIN prodotti p ON l.ID_Prodotto = p.ID_Prodotto
		JOIN puntivendita pv ON l.ID_PuntoVendita = pv.ID_PuntoVendita
		WHERE l.QuantitaAttuale > 0
		ORDER BY l.DataScadenza ASC
	`).all();

	const stores = db.prepare('SELECT * FROM puntivendita ORDER BY NomePuntoVendita').all();
	const products = db.prepare('SELECT * FROM prodotti ORDER BY NomeProdotto').all();

	return { stock, stores, products };
};
