<script lang="ts">
	import { BarChart3, TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, Clock, CreditCard, AlertTriangle, Store, PieChart, Layers } from 'lucide-svelte';

	let { data } = $props();

	// Calculate totals
	const totalRevenue = data.summaryStats?.totalRevenue || 0;
	const totalSales = data.summaryStats?.totalSales || 0;
	const avgTicket = data.summaryStats?.avgTicket || 0;
	const uniqueCustomers = data.summaryStats?.uniqueCustomers || 0;

	// Weekly comparison
	const thisWeek = data.weeklyComparison?.find((w: any) => w.period === 'this_week');
	const lastWeek = data.weeklyComparison?.find((w: any) => w.period === 'last_week');
	const weeklyGrowth = lastWeek?.revenue ? ((thisWeek?.revenue - lastWeek?.revenue) / lastWeek?.revenue * 100) : 0;

	// Chart helpers
	function getMaxRevenue() {
		return Math.max(...data.salesByDay.map((d: any) => d.revenue), 1);
	}

	function getCategoryTotal() {
		return data.categoryPerformance.reduce((sum: number, c: any) => sum + c.revenue, 0) || 1;
	}

	const categoryColors = ['#1d9bf0', '#00ba7c', '#794bc4', '#f4212e', '#ffad1f', '#17bf63', '#e0245e', '#1da1f2'];

	function formatCurrency(value: number) {
		return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
	}

	function formatNumber(value: number) {
		return new Intl.NumberFormat('it-IT').format(Math.round(value));
	}

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' });
	}
</script>

<svelte:head>
	<title>Report & Analytics - HyperMart Admin</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="mb-8 animate-fadeIn">
		<h1 class="text-3xl font-bold text-white mb-2">Report & Analytics</h1>
		<p class="text-[#71767b]">Analisi dettagliata delle performance degli ultimi 30 giorni</p>
	</div>

	<!-- Summary Stats -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-5 animate-scaleIn opacity-0" style="animation-delay: 0.1s">
			<div class="flex items-center justify-between mb-3">
				<div class="p-2 rounded-lg bg-[#00ba7c]/20">
					<DollarSign size={20} class="text-[#00ba7c]" />
				</div>
				<span class="flex items-center gap-1 text-sm {weeklyGrowth >= 0 ? 'text-[#00ba7c]' : 'text-[#f4212e]'}">
					{#if weeklyGrowth >= 0}
						<TrendingUp size={14} />
					{:else}
						<TrendingDown size={14} />
					{/if}
					{weeklyGrowth.toFixed(1)}%
				</span>
			</div>
			<p class="text-2xl font-bold text-white">{formatCurrency(totalRevenue)}</p>
			<p class="text-sm text-[#71767b]">Fatturato Totale</p>
		</div>

		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-5 animate-scaleIn opacity-0" style="animation-delay: 0.15s">
			<div class="flex items-center justify-between mb-3">
				<div class="p-2 rounded-lg bg-[#1d9bf0]/20">
					<ShoppingCart size={20} class="text-[#1d9bf0]" />
				</div>
			</div>
			<p class="text-2xl font-bold text-white">{formatNumber(totalSales)}</p>
			<p class="text-sm text-[#71767b]">Vendite Totali</p>
		</div>

		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-5 animate-scaleIn opacity-0" style="animation-delay: 0.2s">
			<div class="flex items-center justify-between mb-3">
				<div class="p-2 rounded-lg bg-[#794bc4]/20">
					<BarChart3 size={20} class="text-[#794bc4]" />
				</div>
			</div>
			<p class="text-2xl font-bold text-white">{formatCurrency(avgTicket)}</p>
			<p class="text-sm text-[#71767b]">Scontrino Medio</p>
		</div>

		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-5 animate-scaleIn opacity-0" style="animation-delay: 0.25s">
			<div class="flex items-center justify-between mb-3">
				<div class="p-2 rounded-lg bg-[#ffad1f]/20">
					<Users size={20} class="text-[#ffad1f]" />
				</div>
			</div>
			<p class="text-2xl font-bold text-white">{formatNumber(uniqueCustomers)}</p>
			<p class="text-sm text-[#71767b]">Clienti Unici</p>
		</div>
	</div>

	<!-- Charts Row 1 -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
		<!-- Revenue Chart (Line/Bar) -->
		<div class="lg:col-span-2 bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn" style="animation-delay: 0.3s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-white">Andamento Fatturato</h2>
				<span class="text-sm text-[#71767b]">Ultimi 30 giorni</span>
			</div>
			
			{#if data.salesByDay && data.salesByDay.length > 0}
				{@const maxRev = Math.max(...data.salesByDay.map((d: any) => d.revenue || 0), 1)}
				<div class="relative h-64">
					<!-- Y-axis labels -->
					<div class="absolute left-0 top-0 bottom-6 w-16 flex flex-col justify-between text-xs text-[#71767b]">
						<span>{formatCurrency(maxRev)}</span>
						<span>{formatCurrency(maxRev / 2)}</span>
						<span>€0</span>
					</div>
					
					<!-- Chart area -->
					<div class="ml-16 h-[calc(100%-1.5rem)] flex items-end gap-px">
						{#each data.salesByDay as day, i}
							{@const height = Math.max(((day.revenue || 0) / maxRev) * 100, 3)}
							<div 
								class="flex-1 min-w-[4px] bg-gradient-to-t from-[#1d9bf0] to-[#1d9bf0]/60 rounded-t transition-all hover:from-[#1d9bf0] hover:to-[#1d9bf0] cursor-pointer group relative"
								style="height: {height}%"
							>
								<!-- Tooltip -->
								<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#000] border border-[#2f3336] rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
									{formatDate(day.day)}: {formatCurrency(day.revenue || 0)}
								</div>
							</div>
						{/each}
					</div>
					
					<!-- X-axis labels -->
					<div class="ml-16 flex justify-between text-xs text-[#71767b] mt-1">
						<span>{formatDate(data.salesByDay[0]?.day || '')}</span>
						<span>{formatDate(data.salesByDay[Math.floor(data.salesByDay.length / 2)]?.day || '')}</span>
						<span>{formatDate(data.salesByDay[data.salesByDay.length - 1]?.day || '')}</span>
					</div>
				</div>
			{:else}
				<div class="h-64 flex items-center justify-center text-[#71767b]">
					Nessun dato disponibile
				</div>
			{/if}
		</div>

		<!-- Category Pie Chart -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn" style="animation-delay: 0.35s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-white">Per Categoria</h2>
				<PieChart size={20} class="text-[#71767b]" />
			</div>
			
			{#if data.categoryPerformance.length > 0}
				{@const total = getCategoryTotal()}
				{@const circumference = 2 * Math.PI * 35}
				<!-- Donut Chart -->
				<div class="relative w-48 h-48 mx-auto mb-4">
					<svg viewBox="0 0 100 100" class="transform -rotate-90">
						{#each data.categoryPerformance as cat, i}
							{@const percentage = (cat.revenue / total) * 100}
							{@const previousPercentages = data.categoryPerformance.slice(0, i).reduce((sum: number, c: any) => sum + (c.revenue / total) * 100, 0)}
							{@const offset = (previousPercentages / 100) * circumference}
							{@const length = (percentage / 100) * circumference}
							<circle
								cx="50"
								cy="50"
								r="35"
								fill="none"
								stroke={categoryColors[i % categoryColors.length]}
								stroke-width="12"
								stroke-dasharray="{length} {circumference - length}"
								stroke-dashoffset="-{offset}"
								class="transition-all duration-500"
							/>
						{/each}
					</svg>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="text-center">
							<p class="text-lg font-bold text-white">{data.categoryPerformance.length}</p>
							<p class="text-xs text-[#71767b]">Categorie</p>
						</div>
					</div>
				</div>
				
				<!-- Legend -->
				<div class="space-y-2">
					{#each data.categoryPerformance.slice(0, 5) as cat, i}
						{@const percentage = (cat.revenue / getCategoryTotal()) * 100}
						<div class="flex items-center justify-between text-sm">
							<div class="flex items-center gap-2">
								<div class="w-3 h-3 rounded-full" style="background-color: {categoryColors[i % categoryColors.length]}"></div>
								<span class="text-[#e7e9ea] truncate max-w-24">{cat.NomeCategoria}</span>
							</div>
							<span class="text-[#71767b]">{percentage.toFixed(1)}%</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Charts Row 2 -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
		<!-- Store Performance -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn" style="animation-delay: 0.4s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-white">Performance Punti Vendita</h2>
				<Store size={20} class="text-[#71767b]" />
			</div>
			
			<div class="space-y-4">
				{#each data.salesByStore as store, i}
					{@const maxStoreRevenue = Math.max(...data.salesByStore.map((s: any) => s.revenue), 1)}
					{@const percentage = (store.revenue / maxStoreRevenue) * 100}
					<div class="animate-slideIn opacity-0" style="animation-delay: {0.4 + i * 0.05}s">
						<div class="flex items-center justify-between mb-2">
							<div>
								<span class="font-medium text-white">{store.NomePuntoVendita}</span>
								<span class="text-sm text-[#71767b] ml-2">{store.Citta}</span>
							</div>
							<span class="font-bold text-white">{formatCurrency(store.revenue)}</span>
						</div>
						<div class="h-2 bg-[#2f3336] rounded-full overflow-hidden">
							<div 
								class="h-full bg-gradient-to-r from-[#1d9bf0] to-[#00ba7c] rounded-full transition-all duration-1000"
								style="width: {percentage}%"
							></div>
						</div>
						<div class="flex justify-between text-xs text-[#71767b] mt-1">
							<span>{formatNumber(store.salesCount)} vendite</span>
							<span>Media: {formatCurrency(store.avgTicket)}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Hourly Distribution -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn" style="animation-delay: 0.45s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-white">Distribuzione Oraria</h2>
				<Clock size={20} class="text-[#71767b]" />
			</div>
			
			{#if data.salesByHour.length > 0}
				{@const maxHourly = Math.max(...data.salesByHour.map((h: any) => h.count), 1)}
				<div class="h-40">
					<div class="flex items-end gap-1 h-full">
						{#each data.salesByHour as hour}
							{@const height = Math.max((hour.count / maxHourly) * 100, 5)}
							<div 
								class="flex-1 min-w-[8px] bg-gradient-to-t from-[#794bc4] to-[#794bc4]/60 rounded-t transition-all hover:from-[#9b6ddb] hover:to-[#9b6ddb] cursor-pointer group relative"
								style="height: {height}%"
							>
								<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#000] border border-[#2f3336] rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
									{hour.hour}:00 - {hour.count} vendite
								</div>
							</div>
						{/each}
					</div>
				</div>
				<div class="flex justify-between text-xs text-[#71767b] mt-2 px-1">
					{#each data.salesByHour as hour, i}
						{#if i === 0 || i === data.salesByHour.length - 1 || i === Math.floor(data.salesByHour.length / 2)}
							<span>{hour.hour}:00</span>
						{/if}
					{/each}
				</div>
			{:else}
				<div class="h-40 flex items-center justify-center text-[#71767b]">
					Nessun dato disponibile
				</div>
			{/if}
		</div>
	</div>

	<!-- Charts Row 3 -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
		<!-- Top Products -->
		<div class="lg:col-span-2 bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn" style="animation-delay: 0.5s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-white">Top 10 Prodotti</h2>
				<Package size={20} class="text-[#71767b]" />
			</div>
			
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-[#2f3336]">
							<th class="text-left p-3 text-[#71767b] font-medium text-sm">#</th>
							<th class="text-left p-3 text-[#71767b] font-medium text-sm">Prodotto</th>
							<th class="text-left p-3 text-[#71767b] font-medium text-sm hidden md:table-cell">Categoria</th>
							<th class="text-right p-3 text-[#71767b] font-medium text-sm">Qtà</th>
							<th class="text-right p-3 text-[#71767b] font-medium text-sm">Fatturato</th>
						</tr>
					</thead>
					<tbody>
						{#each data.topProducts as product, i}
							<tr class="border-b border-[#2f3336]/50 hover:bg-[#1d1f23] transition-colors animate-slideIn opacity-0" style="animation-delay: {0.5 + i * 0.03}s">
								<td class="p-3">
									<span class="w-6 h-6 rounded-full bg-[#1d9bf0]/20 text-[#1d9bf0] text-xs font-bold flex items-center justify-center">
										{i + 1}
									</span>
								</td>
								<td class="p-3 font-medium text-white">{product.NomeProdotto}</td>
								<td class="p-3 text-[#71767b] text-sm hidden md:table-cell">{product.NomeCategoria}</td>
								<td class="p-3 text-right text-white">{formatNumber(product.totalQty)}</td>
								<td class="p-3 text-right font-bold text-[#00ba7c]">{formatCurrency(product.totalRevenue)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Payment Methods -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn" style="animation-delay: 0.55s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-white">Metodi di Pagamento</h2>
				<CreditCard size={20} class="text-[#71767b]" />
			</div>
			
			{#if data.paymentMethods.length > 0}
				{@const totalPayments = data.paymentMethods.reduce((sum: number, p: any) => sum + p.revenue, 0) || 1}
				<div class="space-y-4">
					{#each data.paymentMethods as method, i}
						{@const percentage = (method.revenue / totalPayments) * 100}
						<div class="animate-scaleIn opacity-0" style="animation-delay: {0.55 + i * 0.05}s">
							<div class="flex items-center justify-between mb-2">
								<span class="text-white">{method.MetodoPagamento}</span>
								<span class="text-sm text-[#71767b]">{percentage.toFixed(1)}%</span>
							</div>
							<div class="h-2 bg-[#2f3336] rounded-full overflow-hidden">
								<div 
									class="h-full rounded-full transition-all duration-700"
									style="width: {percentage}%; background-color: {categoryColors[i % categoryColors.length]}"
								></div>
							</div>
							<p class="text-xs text-[#71767b] mt-1">{formatCurrency(method.revenue)} - {formatNumber(method.count)} transazioni</p>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Bottom Row -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Top Customers -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn" style="animation-delay: 0.6s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-white">Top Clienti</h2>
				<Users size={20} class="text-[#71767b]" />
			</div>
			
			<div class="space-y-3">
				{#each data.topCustomers as customer, i}
					<div class="flex items-center gap-4 p-3 rounded-xl bg-[#000] animate-slideIn opacity-0" style="animation-delay: {0.6 + i * 0.05}s">
						<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d9bf0] to-[#794bc4] flex items-center justify-center text-white font-bold">
							{customer.NomeCompleto?.split(' ').map((n: string) => n[0]).join('') || '?'}
						</div>
						<div class="flex-1">
							<p class="font-medium text-white">{customer.NomeCompleto}</p>
							<p class="text-sm text-[#71767b]">{customer.purchases} acquisti</p>
						</div>
						<div class="text-right">
							<p class="font-bold text-[#00ba7c]">{formatCurrency(customer.totalSpent)}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Inventory Alerts -->
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-fadeIn" style="animation-delay: 0.65s">
			<div class="flex items-center justify-between mb-6">
				<h2 class="text-lg font-bold text-white">Alert Inventario</h2>
				<AlertTriangle size={20} class="text-[#ffad1f]" />
			</div>
			
			{#if data.inventoryAlerts.length > 0}
				<div class="space-y-3">
					{#each data.inventoryAlerts as alert, i}
						<div class="flex items-center gap-4 p-3 rounded-xl bg-[#000] border-l-4 {
							alert.daysToExpiry < 3 ? 'border-[#f4212e]' : 
							alert.daysToExpiry < 7 ? 'border-[#ffad1f]' : 
							alert.QuantitaAttuale < 10 ? 'border-[#f4212e]' : 'border-[#ffad1f]'
						} animate-slideIn opacity-0" style="animation-delay: {0.65 + i * 0.05}s">
							<div class="flex-1">
								<p class="font-medium text-white">{alert.NomeProdotto}</p>
								<div class="flex gap-4 text-sm">
									<span class="text-[#71767b]">Stock: <span class="{alert.QuantitaAttuale < 10 ? 'text-[#f4212e]' : 'text-white'}">{alert.QuantitaAttuale}</span></span>
									{#if alert.daysToExpiry !== null}
										<span class="text-[#71767b]">Scade tra: <span class="{alert.daysToExpiry < 3 ? 'text-[#f4212e]' : alert.daysToExpiry < 7 ? 'text-[#ffad1f]' : 'text-white'}">{alert.daysToExpiry}g</span></span>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="text-center py-8 text-[#71767b]">
					<AlertTriangle size={32} class="mx-auto mb-2 opacity-50" />
					<p>Nessun alert attivo</p>
				</div>
			{/if}
		</div>
	</div>
</div>
