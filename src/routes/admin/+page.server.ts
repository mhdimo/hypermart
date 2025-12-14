import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Get stats
	const totalProducts = db.prepare('SELECT COUNT(*) as count FROM prodotti').get() as { count: number };
	const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM clienti').get() as { count: number };
	const totalSales = db.prepare('SELECT COUNT(*) as count FROM vendite_testata').get() as { count: number };
	const totalRevenue = db.prepare('SELECT COALESCE(SUM(TotaleVendita), 0) as total FROM vendite_testata').get() as { total: number };
	
	// Calculate trends (comparing last 15 days vs previous 15 days)
	const currentPeriodSales = db.prepare(`
		SELECT COUNT(*) as count, COALESCE(SUM(TotaleVendita), 0) as revenue 
		FROM vendite_testata 
		WHERE date(DataOraVendita) >= date('now', '-15 days')
	`).get() as { count: number; revenue: number };
	
	const previousPeriodSales = db.prepare(`
		SELECT COUNT(*) as count, COALESCE(SUM(TotaleVendita), 0) as revenue 
		FROM vendite_testata 
		WHERE date(DataOraVendita) >= date('now', '-30 days') 
		AND date(DataOraVendita) < date('now', '-15 days')
	`).get() as { count: number; revenue: number };
	
	// Calculate percentage changes
	const calcTrend = (current: number, previous: number): { value: string; up: boolean } => {
		if (previous === 0) return { value: current > 0 ? '+100%' : '0%', up: current > 0 };
		const change = ((current - previous) / previous) * 100;
		return { 
			value: `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`, 
			up: change >= 0 
		};
	};
	
	const salesTrend = calcTrend(currentPeriodSales.count, previousPeriodSales.count);
	const revenueTrend = calcTrend(currentPeriodSales.revenue, previousPeriodSales.revenue);
	
	// New customers in last 30 days
	const recentCustomers = db.prepare(`
		SELECT COUNT(*) as count FROM clienti 
		WHERE date(DataRegistrazione) >= date('now', '-30 days')
	`).get() as { count: number };
	
	const previousCustomers = db.prepare(`
		SELECT COUNT(*) as count FROM clienti 
		WHERE date(DataRegistrazione) >= date('now', '-60 days')
		AND date(DataRegistrazione) < date('now', '-30 days')
	`).get() as { count: number };
	
	const customersTrend = calcTrend(recentCustomers.count, previousCustomers.count);
	
	// New products in last 30 days (based on stock load dates)
	const recentProducts = db.prepare(`
		SELECT COUNT(DISTINCT ID_Prodotto) as count FROM lottiprodotto_stock 
		WHERE date(DataCarico) >= date('now', '-30 days')
	`).get() as { count: number };
	
	const previousProducts = db.prepare(`
		SELECT COUNT(DISTINCT ID_Prodotto) as count FROM lottiprodotto_stock 
		WHERE date(DataCarico) >= date('now', '-60 days')
		AND date(DataCarico) < date('now', '-30 days')
	`).get() as { count: number };
	
	const productsTrend = calcTrend(recentProducts.count, previousProducts.count);
	
	// Low stock products (15 units or less) - get actual items
	const lowStockProducts = db.prepare(`
		SELECT p.NomeProdotto, l.QuantitaAttuale, pv.NomePuntoVendita
		FROM lottiprodotto_stock l
		JOIN prodotti p ON l.ID_Prodotto = p.ID_Prodotto
		JOIN puntivendita pv ON l.ID_PuntoVendita = pv.ID_PuntoVendita
		WHERE l.QuantitaAttuale <= 15 AND l.QuantitaAttuale > 0
		ORDER BY l.QuantitaAttuale ASC
		LIMIT 5
	`).all();
	
	const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM lottiprodotto_stock WHERE QuantitaAttuale <= 15 AND QuantitaAttuale > 0').get() as { count: number };
	
	// Expiring soon products (within 7 days) - get actual items
	const expiringProducts = db.prepare(`
		SELECT p.NomeProdotto, l.DataScadenza, l.QuantitaAttuale, pv.NomePuntoVendita
		FROM lottiprodotto_stock l
		JOIN prodotti p ON l.ID_Prodotto = p.ID_Prodotto
		JOIN puntivendita pv ON l.ID_PuntoVendita = pv.ID_PuntoVendita
		WHERE l.DataScadenza IS NOT NULL 
		AND date(l.DataScadenza) BETWEEN date('now') AND date('now', '+7 days')
		AND l.QuantitaAttuale > 0
		ORDER BY l.DataScadenza ASC
		LIMIT 5
	`).all();
	
	const expiringCount = db.prepare(`
		SELECT COUNT(*) as count FROM lottiprodotto_stock 
		WHERE DataScadenza IS NOT NULL 
		AND date(DataScadenza) BETWEEN date('now') AND date('now', '+7 days')
		AND QuantitaAttuale > 0
	`).get() as { count: number };

	// Recent sales
	const recentSales = db.prepare(`
		SELECT v.*, p.NomePuntoVendita, c.Nome || ' ' || c.Cognome as NomeCliente
		FROM vendite_testata v
		LEFT JOIN puntivendita p ON v.ID_PuntoVendita = p.ID_PuntoVendita
		LEFT JOIN clienti c ON v.ID_Cliente = c.ID_Cliente
		ORDER BY v.DataOraVendita DESC
		LIMIT 5
	`).all();

	// Top products
	const topProducts = db.prepare(`
		SELECT p.NomeProdotto, COALESCE(SUM(vd.QuantitaVenduta), 0) as totalSold
		FROM prodotti p
		LEFT JOIN vendite_dettaglio vd ON p.ID_Prodotto = vd.ID_Prodotto
		GROUP BY p.ID_Prodotto
		ORDER BY totalSold DESC
		LIMIT 5
	`).all();

	// Category distribution
	const categoryDistribution = db.prepare(`
		SELECT c.NomeCategoria, COUNT(p.ID_Prodotto) as count
		FROM categorieprodotto c
		LEFT JOIN prodotti p ON c.ID_Categoria = p.ID_Categoria
		GROUP BY c.ID_Categoria
		ORDER BY count DESC
	`).all();

	// Stock by store
	const stockByStore = db.prepare(`
		SELECT pv.NomePuntoVendita, COALESCE(SUM(l.QuantitaAttuale), 0) as totalStock
		FROM puntivendita pv
		LEFT JOIN lottiprodotto_stock l ON pv.ID_PuntoVendita = l.ID_PuntoVendita
		GROUP BY pv.ID_PuntoVendita
	`).all();
	
	// Additional stats
	const totalCategories = db.prepare('SELECT COUNT(*) as count FROM categorieprodotto').get() as { count: number };
	const totalSuppliers = db.prepare('SELECT COUNT(*) as count FROM fornitori').get() as { count: number };
	const totalEmployees = db.prepare('SELECT COUNT(*) as count FROM operatori').get() as { count: number };
	const activePromotions = db.prepare(`
		SELECT COUNT(*) as count FROM promozioni 
		WHERE date(DataFine) >= date('now') AND date(DataInizio) <= date('now')
	`).get() as { count: number };
	
	// Today's stats
	const todaySales = db.prepare(`
		SELECT COUNT(*) as count, COALESCE(SUM(TotaleVendita), 0) as revenue 
		FROM vendite_testata 
		WHERE date(DataOraVendita) = date('now')
	`).get() as { count: number; revenue: number };
	
	// Average sale value
	const avgSaleValue = totalSales.count > 0 ? totalRevenue.total / totalSales.count : 0;

	return {
		stats: {
			totalProducts: totalProducts.count,
			totalCustomers: totalCustomers.count,
			totalSales: totalSales.count,
			totalRevenue: totalRevenue.total,
			lowStock: lowStockCount.count,
			expiringProducts: expiringCount.count,
			totalCategories: totalCategories.count,
			totalSuppliers: totalSuppliers.count,
			totalEmployees: totalEmployees.count,
			activePromotions: activePromotions.count,
			todaySales: todaySales.count,
			todayRevenue: todaySales.revenue,
			avgSaleValue
		},
		trends: {
			products: productsTrend,
			customers: customersTrend,
			sales: salesTrend,
			revenue: revenueTrend
		},
		lowStockProducts,
		expiringProductsList: expiringProducts,
		recentSales,
		topProducts,
		categoryDistribution,
		stockByStore
	};
};
