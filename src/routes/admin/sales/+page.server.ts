import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 100;
	const storeId = url.searchParams.get('store') || '';
	const offset = (page - 1) * perPage;

	// Build WHERE clause for store filter
	const whereClause = storeId ? `WHERE v.ID_PuntoVendita = ?` : '';
	const params = storeId ? [storeId, perPage, offset] : [perPage, offset];

	const sales = db.prepare(`
		SELECT v.*, pv.NomePuntoVendita, c.Nome || ' ' || c.Cognome as NomeCliente
		FROM vendite_testata v
		LEFT JOIN puntivendita pv ON v.ID_PuntoVendita = pv.ID_PuntoVendita
		LEFT JOIN clienti c ON v.ID_Cliente = c.ID_Cliente
		${whereClause}
		ORDER BY v.ID_Vendita DESC
		LIMIT ? OFFSET ?
	`).all(...params);

	const stores = db.prepare('SELECT * FROM puntivendita ORDER BY NomePuntoVendita').all();

	// Get totals per store for stats
	const storeStats = db.prepare(`
		SELECT ID_PuntoVendita, COUNT(*) as count, SUM(TotaleVendita) as total
		FROM vendite_testata
		GROUP BY ID_PuntoVendita
	`).all() as { ID_PuntoVendita: number; count: number; total: number }[];

	const totalStats = db.prepare(`
		SELECT COUNT(*) as count, SUM(TotaleVendita) as total
		FROM vendite_testata
	`).get() as { count: number; total: number };

	// Get count for current filter
	const filteredCount = storeId 
		? db.prepare(`SELECT COUNT(*) as count FROM vendite_testata WHERE ID_PuntoVendita = ?`).get(storeId) as { count: number }
		: totalStats;

	const totalPages = Math.ceil(filteredCount.count / perPage);

	return { 
		sales, 
		stores, 
		storeStats, 
		totalStats,
		pagination: {
			page,
			perPage,
			totalPages,
			totalCount: filteredCount.count
		},
		currentStoreFilter: storeId
	};
};
