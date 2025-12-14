<script lang="ts">
	import { 
		Package, 
		Users, 
		ShoppingCart, 
		Euro,
		AlertTriangle,
		Clock,
		TrendingUp,
		ArrowUpRight,
		ArrowDownRight,
		Store,
		Percent,
		UserCheck,
		Truck,
		Calendar
	} from 'lucide-svelte';

	let { data } = $props();

	// Dynamic stat cards using actual trends from server
	const statCards = $derived([
		{ 
			label: 'Prodotti Totali', 
			value: data.stats.totalProducts.toLocaleString('it-IT'), 
			icon: Package, 
			color: 'bg-[#1d9bf0]',
			trend: data.trends.products.value,
			trendUp: data.trends.products.up
		},
		{ 
			label: 'Clienti', 
			value: data.stats.totalCustomers.toLocaleString('it-IT'), 
			icon: Users, 
			color: 'bg-[#00ba7c]',
			trend: data.trends.customers.value,
			trendUp: data.trends.customers.up
		},
		{ 
			label: 'Vendite', 
			value: data.stats.totalSales.toLocaleString('it-IT'), 
			icon: ShoppingCart, 
			color: 'bg-[#ffad1f]',
			trend: data.trends.sales.value,
			trendUp: data.trends.sales.up
		},
		{ 
			label: 'Ricavi Totali', 
			value: `€${data.stats.totalRevenue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
			icon: Euro, 
			color: 'bg-[#794bc4]',
			trend: data.trends.revenue.value,
			trendUp: data.trends.revenue.up
		},
	]);

	// Secondary stats
	const secondaryStats = $derived([
		{ label: 'Categorie', value: data.stats.totalCategories, icon: Package, color: 'text-[#1d9bf0]' },
		{ label: 'Fornitori', value: data.stats.totalSuppliers, icon: Truck, color: 'text-[#00ba7c]' },
		{ label: 'Dipendenti', value: data.stats.totalEmployees, icon: UserCheck, color: 'text-[#ffad1f]' },
		{ label: 'Promozioni Attive', value: data.stats.activePromotions, icon: Percent, color: 'text-[#794bc4]' },
	]);

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('it-IT', {
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Admin Dashboard - HyperMart</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="mb-8 animate-fadeIn">
		<h1 class="text-3xl font-bold text-white mb-2">Dashboard</h1>
		<p class="text-[#71767b]">Panoramica del tuo negozio • Oggi: <span class="text-[#1d9bf0]">{data.stats.todaySales}</span> vendite per <span class="text-[#00ba7c]">€{data.stats.todayRevenue.toFixed(2)}</span></p>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		{#each statCards as card, i}
			<div 
				class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 hover:border-[#1d9bf0]/50 transition-all duration-300 animate-scaleIn opacity-0 hover:transform hover:scale-[1.02]"
				style="animation-delay: {i * 0.1}s"
			>
				<div class="flex items-start justify-between mb-4">
					<div class="{card.color} p-3 rounded-xl">
						<svelte:component this={card.icon} size={24} class="text-white" />
					</div>
					<div class="flex items-center gap-1 text-sm {card.trendUp ? 'text-[#00ba7c]' : 'text-[#f4212e]'}">
						{#if card.trendUp}
							<ArrowUpRight size={16} />
						{:else}
							<ArrowDownRight size={16} />
						{/if}
						<span>{card.trend}</span>
					</div>
				</div>
				<div class="text-2xl font-bold text-white mb-1">{card.value}</div>
				<div class="text-[#71767b] text-sm">{card.label}</div>
			</div>
		{/each}
	</div>

	<!-- Secondary Stats Row -->
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
		{#each secondaryStats as stat, i}
			<div 
				class="bg-[#16181c] border border-[#2f3336] rounded-xl p-4 animate-fadeIn opacity-0"
				style="animation-delay: {0.4 + i * 0.05}s"
			>
				<div class="flex items-center gap-3">
					<svelte:component this={stat.icon} size={20} class={stat.color} />
					<div>
						<div class="text-lg font-bold text-white">{stat.value}</div>
						<div class="text-xs text-[#71767b]">{stat.label}</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	<!-- Alerts Row -->
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
		<!-- Low Stock Alert -->
		<div 
			class="bg-[#f4212e]/10 border border-[#2f3336] rounded-2xl p-6 animate-slideIn opacity-0"
			style="animation-delay: 0.4s"
		>
			<div class="flex items-center gap-4 mb-4">
				<div class="p-3 rounded-xl bg-[#000000]/30">
					<AlertTriangle size={24} class="text-[#f4212e]" />
				</div>
				<div>
					<div class="text-3xl font-bold text-[#f4212e]">{data.stats.lowStock}</div>
					<div class="text-[#71767b]">Stock Basso</div>
				</div>
			</div>
			{#if data.lowStockProducts && data.lowStockProducts.length > 0}
				<div class="space-y-2 mt-4 pt-4 border-t border-[#2f3336]">
					{#each data.lowStockProducts as item}
						<div class="flex justify-between items-center text-sm">
							<span class="text-white truncate max-w-[60%]">{item.NomeProdotto}</span>
							<span class="text-[#f4212e] font-bold">{item.QuantitaAttuale} pz</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		
		<!-- Expiring Soon Alert -->
		<div 
			class="bg-[#ffad1f]/10 border border-[#2f3336] rounded-2xl p-6 animate-slideIn opacity-0"
			style="animation-delay: 0.5s"
		>
			<div class="flex items-center gap-4 mb-4">
				<div class="p-3 rounded-xl bg-[#000000]/30">
					<Clock size={24} class="text-[#ffad1f]" />
				</div>
				<div>
					<div class="text-3xl font-bold text-[#ffad1f]">{data.stats.expiringProducts}</div>
					<div class="text-[#71767b]">In Scadenza</div>
				</div>
			</div>
			{#if data.expiringProductsList && data.expiringProductsList.length > 0}
				<div class="space-y-2 mt-4 pt-4 border-t border-[#2f3336]">
					{#each data.expiringProductsList as item}
						<div class="flex justify-between items-center text-sm">
							<span class="text-white truncate max-w-[60%]">{item.NomeProdotto}</span>
							<span class="text-[#ffad1f] font-bold">{new Date(item.DataScadenza).toLocaleDateString('it-IT')}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Charts Row -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
		<!-- Recent Sales -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn opacity-0" style="animation-delay: 0.6s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold text-white">Vendite Recenti</h2>
				<a href="/admin/sales" class="text-[#1d9bf0] hover:underline text-sm">Vedi tutte</a>
			</div>
			<div class="space-y-4">
				{#each data.recentSales as sale, i}
					<div class="flex items-center justify-between p-4 rounded-xl bg-[#000000] hover:bg-[#1d1f23] transition-colors group">
						<div class="flex items-center gap-3">
							<div class="w-10 h-10 rounded-full bg-[#1d9bf0]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
								<ShoppingCart size={18} class="text-[#1d9bf0]" />
							</div>
							<div>
								<div class="font-medium text-white">{sale.NomeCliente || 'Cliente Generico'}</div>
								<div class="text-sm text-[#71767b]">{sale.NomePuntoVendita}</div>
							</div>
						</div>
						<div class="text-right">
							<div class="font-bold text-[#00ba7c]">€{(sale.TotaleVendita || 0).toFixed(2)}</div>
							<div class="text-xs text-[#71767b]">{formatDate(sale.DataOraVendita)}</div>
						</div>
					</div>
				{:else}
					<div class="text-center py-8 text-[#71767b]">
						Nessuna vendita recente
					</div>
				{/each}
			</div>
		</div>

		<!-- Top Products -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn opacity-0" style="animation-delay: 0.7s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-xl font-bold text-white">Prodotti Più Venduti</h2>
				<TrendingUp size={20} class="text-[#00ba7c]" />
			</div>
			<div class="space-y-4">
				{#each data.topProducts as product, i}
					<div class="flex items-center gap-4 p-4 rounded-xl bg-[#000000] hover:bg-[#1d1f23] transition-colors group">
						<div class="w-8 h-8 rounded-full bg-[#1d9bf0] flex items-center justify-center font-bold text-white text-sm group-hover:scale-110 transition-transform">
							{i + 1}
						</div>
						<div class="flex-1">
							<div class="font-medium text-white">{product.NomeProdotto}</div>
							<div class="text-sm text-[#71767b]">{product.totalSold} venduti</div>
						</div>
						<div class="w-24 h-2 bg-[#2f3336] rounded-full overflow-hidden">
							<div 
								class="h-full bg-gradient-to-r from-[#1d9bf0] to-[#00ba7c] rounded-full transition-all duration-500"
								style="width: {Math.min((product.totalSold / (data.topProducts[0]?.totalSold || 1)) * 100, 100)}%"
							></div>
						</div>
					</div>
				{:else}
					<div class="text-center py-8 text-[#71767b]">
						Nessun dato disponibile
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Bottom Row -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Category Distribution -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn opacity-0" style="animation-delay: 0.8s">
			<h2 class="text-xl font-bold text-white mb-6">Distribuzione Categorie</h2>
			<div class="space-y-3">
				{#each data.categoryDistribution as cat, i}
					{@const colors = ['#1d9bf0', '#00ba7c', '#ffad1f', '#f4212e', '#794bc4']}
					<div class="flex items-center gap-4">
						<div class="w-32 text-[#71767b] text-sm truncate">{cat.NomeCategoria}</div>
						<div class="flex-1 h-3 bg-[#2f3336] rounded-full overflow-hidden">
							<div 
								class="h-full rounded-full transition-all duration-700"
								style="width: {(cat.count / (data.stats.totalProducts || 1)) * 100}%; background-color: {colors[i % colors.length]}"
							></div>
						</div>
						<div class="w-10 text-right text-white font-medium">{cat.count}</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Stock by Store -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn opacity-0" style="animation-delay: 0.9s">
			<h2 class="text-xl font-bold text-white mb-6">Stock per Punto Vendita</h2>
			<div class="space-y-4">
				{#each data.stockByStore as store, i}
					{@const colors = ['#1d9bf0', '#00ba7c', '#ffad1f', '#794bc4']}
					<div class="p-4 rounded-xl bg-[#000000] hover:bg-[#1d1f23] transition-colors">
						<div class="flex items-center justify-between mb-2">
							<span class="font-medium text-white">{store.NomePuntoVendita}</span>
							<span class="text-lg font-bold" style="color: {colors[i % colors.length]}">{store.totalStock}</span>
						</div>
						<div class="text-sm text-[#71767b]">unità in stock</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
