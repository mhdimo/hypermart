import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = db
		.prepare(`
			SELECT p.*, c.NomeCategoria,
				COALESCE(SUM(l.QuantitaAttuale), 0) as stock
			FROM prodotti p
			LEFT JOIN categorieprodotto c ON p.ID_Categoria = c.ID_Categoria
			LEFT JOIN lottiprodotto_stock l ON p.ID_Prodotto = l.ID_Prodotto
			GROUP BY p.ID_Prodotto
			HAVING stock > 0
			ORDER BY p.NomeProdotto
		`)
		.all();

	const categories = db
		.prepare(`
			SELECT c.*, COUNT(p.ID_Prodotto) as productCount
			FROM categorieprodotto c
			LEFT JOIN prodotti p ON c.ID_Categoria = p.ID_Categoria
			GROUP BY c.ID_Categoria
			ORDER BY c.NomeCategoria
		`)
		.all();

	const promotions = db
		.prepare(`
			SELECT prom.*, pp.ID_Prodotto, p.NomeProdotto
			FROM promozioni prom
			JOIN prodotti_promozioni pp ON prom.ID_Promozione = pp.ID_Promozione
			JOIN prodotti p ON pp.ID_Prodotto = p.ID_Prodotto
			WHERE prom.DataInizio <= date('now')
			AND prom.DataFine >= date('now')
			ORDER BY prom.ValoreSconto DESC
		`)
		.all();

	const stores = db
		.prepare('SELECT * FROM puntivendita ORDER BY NomePuntoVendita')
		.all();

	const featuredProducts = db
		.prepare(`
			SELECT p.*, c.NomeCategoria,
				COALESCE(SUM(l.QuantitaAttuale), 0) as stock
			FROM prodotti p
			LEFT JOIN categorieprodotto c ON p.ID_Categoria = c.ID_Categoria
			LEFT JOIN lottiprodotto_stock l ON p.ID_Prodotto = l.ID_Prodotto
			GROUP BY p.ID_Prodotto
			HAVING stock > 0
			ORDER BY RANDOM()
			LIMIT 8
		`)
		.all();

	return {
		products,
		categories,
		promotions,
		stores,
		featuredProducts
	};
};
