import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Sales by day (last 30 days) - ordered ascending for charts
	const salesByDay = db.prepare(`
		SELECT 
			date(DataOraVendita) as day,
			COUNT(*) as count,
			COALESCE(SUM(TotaleVendita), 0) as revenue,
			COALESCE(SUM(TotaleImponibile), 0) as revenueNet,
			COALESCE(SUM(TotaleIVA), 0) as iva
		FROM vendite_testata
		WHERE DataOraVendita >= date('now', '-30 days')
		GROUP BY date(DataOraVendita)
		ORDER BY day ASC
	`).all();

	// Sales by hour (distribution)
	const salesByHour = db.prepare(`
		SELECT 
			CAST(strftime('%H', DataOraVendita) AS INTEGER) as hour,
			COUNT(*) as count,
			COALESCE(SUM(TotaleVendita), 0) as revenue
		FROM vendite_testata
		WHERE DataOraVendita >= date('now', '-30 days')
		GROUP BY hour
		ORDER BY hour
	`).all();

	// Top selling products
	const topProducts = db.prepare(`
		SELECT 
			p.NomeProdotto,
			c.NomeCategoria,
			COALESCE(SUM(vd.QuantitaVenduta), 0) as totalQty,
			COALESCE(SUM(vd.SubtotaleRiga), 0) as totalRevenue
		FROM prodotti p
		LEFT JOIN categorieprodotto c ON p.ID_Categoria = c.ID_Categoria
		LEFT JOIN vendite_dettaglio vd ON p.ID_Prodotto = vd.ID_Prodotto
		GROUP BY p.ID_Prodotto
		HAVING totalQty > 0
		ORDER BY totalRevenue DESC
		LIMIT 10
	`).all();

	// Sales by store
	const salesByStore = db.prepare(`
		SELECT 
			pv.NomePuntoVendita,
			pv.Citta,
			COUNT(v.ID_Vendita) as salesCount,
			COALESCE(SUM(v.TotaleVendita), 0) as revenue,
			COALESCE(AVG(v.TotaleVendita), 0) as avgTicket
		FROM puntivendita pv
		LEFT JOIN vendite_testata v ON pv.ID_PuntoVendita = v.ID_PuntoVendita
		GROUP BY pv.ID_PuntoVendita
		ORDER BY revenue DESC
	`).all();

	// Category performance
	const categoryPerformance = db.prepare(`
		SELECT 
			c.NomeCategoria,
			COUNT(DISTINCT p.ID_Prodotto) as productCount,
			COALESCE(SUM(vd.QuantitaVenduta), 0) as totalQty,
			COALESCE(SUM(vd.SubtotaleRiga), 0) as revenue
		FROM categorieprodotto c
		LEFT JOIN prodotti p ON c.ID_Categoria = p.ID_Categoria
		LEFT JOIN vendite_dettaglio vd ON p.ID_Prodotto = vd.ID_Prodotto
		GROUP BY c.ID_Categoria
		ORDER BY revenue DESC
	`).all();

	// Payment methods breakdown
	const paymentMethods = db.prepare(`
		SELECT 
			MetodoPagamento,
			COUNT(*) as count,
			COALESCE(SUM(TotaleVendita), 0) as revenue
		FROM vendite_testata
		WHERE MetodoPagamento IS NOT NULL
		GROUP BY MetodoPagamento
		ORDER BY revenue DESC
	`).all();

	// Weekly comparison (this week vs last week)
	const weeklyComparison = db.prepare(`
		SELECT 
			CASE 
				WHEN date(DataOraVendita) >= date('now', '-7 days') THEN 'this_week'
				ELSE 'last_week'
			END as period,
			COUNT(*) as count,
			COALESCE(SUM(TotaleVendita), 0) as revenue
		FROM vendite_testata
		WHERE DataOraVendita >= date('now', '-14 days')
		GROUP BY period
	`).all();

	// Summary stats
	const summaryStats = db.prepare(`
		SELECT 
			COUNT(*) as totalSales,
			COALESCE(SUM(TotaleVendita), 0) as totalRevenue,
			COALESCE(AVG(TotaleVendita), 0) as avgTicket,
			COUNT(DISTINCT ID_Cliente) as uniqueCustomers
		FROM vendite_testata
		WHERE DataOraVendita >= date('now', '-30 days')
	`).get();

	// Top customers
	const topCustomers = db.prepare(`
		SELECT 
			c.Nome || ' ' || c.Cognome as NomeCompleto,
			c.Email_Cli,
			COUNT(v.ID_Vendita) as purchases,
			COALESCE(SUM(v.TotaleVendita), 0) as totalSpent
		FROM clienti c
		JOIN vendite_testata v ON c.ID_Cliente = v.ID_Cliente
		GROUP BY c.ID_Cliente
		ORDER BY totalSpent DESC
		LIMIT 5
	`).all();

	// Inventory alerts
	const inventoryAlerts = db.prepare(`
		SELECT 
			p.NomeProdotto,
			l.QuantitaAttuale,
			l.DataScadenza,
			CAST(julianday(l.DataScadenza) - julianday('now') AS INTEGER) as daysToExpiry
		FROM lottiprodotto_stock l
		JOIN prodotti p ON l.ID_Prodotto = p.ID_Prodotto
		WHERE l.QuantitaAttuale > 0 
		AND (l.QuantitaAttuale < 20 OR julianday(l.DataScadenza) - julianday('now') < 7)
		ORDER BY daysToExpiry ASC
		LIMIT 10
	`).all();

	return { 
		salesByDay, 
		salesByHour,
		topProducts, 
		salesByStore, 
		categoryPerformance,
		paymentMethods,
		weeklyComparison,
		summaryStats,
		topCustomers,
		inventoryAlerts
	};
};
