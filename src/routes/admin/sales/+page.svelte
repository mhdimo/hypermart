<script lang="ts">
	import { Search, ShoppingCart, Store, User, Euro, Calendar, Receipt, Filter, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let searchQuery = $state('');

	// Store filter is derived from URL/server data
	const storeFilter = $derived(data.currentStoreFilter || '');

	// Calculate stats based on current filter
	const currentStats = $derived(() => {
		if (!storeFilter) {
			return { count: data.totalStats.count, total: data.totalStats.total || 0 };
		}
		const storeStat = data.storeStats.find((s: any) => s.ID_PuntoVendita.toString() === storeFilter);
		return { count: storeStat?.count || 0, total: storeStat?.total || 0 };
	});

	const totalRevenue = $derived(currentStats().total);
	const salesCount = $derived(currentStats().count);
	const avgSale = $derived(salesCount > 0 ? totalRevenue / salesCount : 0);

	// Filter sales by search query (client-side)
	const filteredSales = $derived(
		data.sales.filter((sale: any) => {
			if (!searchQuery) return true;
			const query = searchQuery.toLowerCase();
			return (
				sale.NomeCliente?.toLowerCase().includes(query) ||
				sale.NumeroScontrino?.toLowerCase().includes(query) ||
				sale.ID_Vendita.toString().includes(query)
			);
		})
	);

	// Handle store filter change - navigate to new URL
	function handleStoreChange(event: Event) {
		const value = (event.target as HTMLSelectElement).value;
		const params = new URLSearchParams();
		if (value) params.set('store', value);
		params.set('page', '1');
		goto(`?${params.toString()}`, { invalidateAll: true });
	}

	// Navigate to a specific page
	function goToPage(pageNum: number) {
		const params = new URLSearchParams();
		if (storeFilter) params.set('store', storeFilter);
		params.set('page', pageNum.toString());
		goto(`?${params.toString()}`, { invalidateAll: true });
	}

	function formatDateTime(dateStr: string): string {
		return new Date(dateStr).toLocaleString('it-IT', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getPaymentBadge(method: string | null): { color: string; label: string } {
		switch (method?.toLowerCase()) {
			case 'contanti':
				return { color: 'bg-[#00ba7c]/20 text-[#00ba7c]', label: 'Contanti' };
			case 'carta':
				return { color: 'bg-[#1d9bf0]/20 text-[#1d9bf0]', label: 'Carta' };
			case 'bancomat':
				return { color: 'bg-[#794bc4]/20 text-[#794bc4]', label: 'Bancomat' };
			case 'satispay':
				return { color: 'bg-[#f4212e]/20 text-[#f4212e]', label: 'Satispay' };
			case 'apple pay':
				return { color: 'bg-[#71767b]/20 text-white', label: 'Apple Pay' };
			case 'google pay':
				return { color: 'bg-[#ffad1f]/20 text-[#ffad1f]', label: 'Google Pay' };
			default:
				return { color: 'bg-[#2f3336] text-[#71767b]', label: method || 'N/D' };
		}
	}
</script>

<svelte:head>
	<title>Vendite - HyperMart Admin</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="mb-8 animate-fadeIn">
		<h1 class="text-3xl font-bold text-white mb-2">Vendite</h1>
		<p class="text-[#71767b]">Storico e gestione vendite</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-scaleIn opacity-0" style="animation-delay: 0.1s">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-xl bg-[#1d9bf0]/20">
					<Receipt size={24} class="text-[#1d9bf0]" />
				</div>
				<div>
					<div class="text-2xl font-bold text-white">{salesCount.toLocaleString('it-IT')}</div>
					<div class="text-sm text-[#71767b]">{storeFilter ? 'Vendite Filtrate' : 'Vendite Totali'}</div>
				</div>
			</div>
		</div>
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-scaleIn opacity-0" style="animation-delay: 0.15s">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-xl bg-[#00ba7c]/20">
					<Euro size={24} class="text-[#00ba7c]" />
				</div>
				<div>
					<div class="text-2xl font-bold text-[#00ba7c]">€{totalRevenue.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
					<div class="text-sm text-[#71767b]">{storeFilter ? 'Ricavi Filtrati' : 'Ricavi Totali'}</div>
				</div>
			</div>
		</div>
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-scaleIn opacity-0" style="animation-delay: 0.2s">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-xl bg-[#794bc4]/20">
					<ShoppingCart size={24} class="text-[#794bc4]" />
				</div>
				<div>
					<div class="text-2xl font-bold text-[#794bc4]">€{avgSale.toFixed(2)}</div>
					<div class="text-sm text-[#71767b]">Scontrino Medio</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="flex flex-col sm:flex-row gap-4 mb-6">
		<div class="relative flex-1">
			<Search size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
			<input 
				type="text" 
				placeholder="Cerca per cliente o numero scontrino..." 
				bind:value={searchQuery}
				class="w-full pl-12 pr-4 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white placeholder-[#71767b] focus:border-[#1d9bf0] focus:outline-none transition-colors"
			/>
		</div>
		<div class="relative">
			<Filter size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
			<select 
				value={storeFilter}
				onchange={handleStoreChange}
				class="pl-12 pr-8 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white focus:border-[#1d9bf0] focus:outline-none transition-colors appearance-none cursor-pointer min-w-[200px]"
				style="background-color: #16181c;"
			>
				<option value="" class="bg-[#16181c] text-white">Tutti i punti vendita</option>
				{#each data.stores as store}
					<option value={String(store.ID_PuntoVendita)} class="bg-[#16181c] text-white">{store.NomePuntoVendita}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Sales Table -->
	<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl overflow-hidden animate-fadeIn" style="animation-delay: 0.3s">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-[#2f3336]">
						<th class="text-left p-4 text-[#71767b] font-medium">ID</th>
						<th class="text-left p-4 text-[#71767b] font-medium">Data/Ora</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden md:table-cell">Punto Vendita</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden lg:table-cell">Cliente</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden xl:table-cell">Pagamento</th>
						<th class="text-right p-4 text-[#71767b] font-medium">Imponibile</th>
						<th class="text-right p-4 text-[#71767b] font-medium hidden lg:table-cell">IVA</th>
						<th class="text-right p-4 text-[#71767b] font-medium">Totale</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredSales as sale, i (sale.ID_Vendita)}
						{@const paymentBadge = getPaymentBadge(sale.MetodoPagamento)}
						<tr class="border-b border-[#2f3336] hover:bg-[#1d1f23] transition-colors animate-slideIn opacity-0" style="animation-delay: {0.3 + i * 0.02}s">
							<td class="p-4">
								<span class="font-mono text-[#1d9bf0]">#{sale.ID_Vendita}</span>
							</td>
							<td class="p-4">
								<div class="flex items-center gap-2 text-white">
									<Calendar size={16} class="text-[#71767b]" />
									<span class="text-sm">{formatDateTime(sale.DataOraVendita)}</span>
								</div>
							</td>
							<td class="p-4 hidden md:table-cell">
								<div class="flex items-center gap-2 text-[#71767b]">
									<Store size={16} />
									<span>{sale.NomePuntoVendita}</span>
								</div>
							</td>
							<td class="p-4 hidden lg:table-cell">
								<div class="flex items-center gap-2 text-[#71767b]">
									<User size={16} />
									<span>{sale.NomeCliente || 'Anonimo'}</span>
								</div>
							</td>
							<td class="p-4 hidden xl:table-cell">
								<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {paymentBadge.color}">
									{paymentBadge.label}
								</span>
							</td>
							<td class="p-4 text-right text-[#71767b]">
								€{(sale.TotaleImponibile || 0).toFixed(2)}
							</td>
							<td class="p-4 text-right text-[#71767b] hidden lg:table-cell">
								€{(sale.TotaleIVA || 0).toFixed(2)}
							</td>
							<td class="p-4 text-right">
								<span class="font-bold text-[#00ba7c]">€{(sale.TotaleVendita || 0).toFixed(2)}</span>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="8" class="p-12 text-center text-[#71767b]">
								<ShoppingCart size={48} class="mx-auto mb-4 opacity-50" />
								<p>Nessuna vendita trovata</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if data.pagination.totalPages > 1}
			<div class="flex items-center justify-between p-4 border-t border-[#2f3336]">
				<div class="text-sm text-[#71767b]">
					Pagina {data.pagination.page} di {data.pagination.totalPages} 
					<span class="hidden sm:inline">({data.pagination.totalCount.toLocaleString('it-IT')} vendite totali)</span>
				</div>
				<div class="flex items-center gap-2">
					<button
						onclick={() => goToPage(data.pagination.page - 1)}
						disabled={data.pagination.page <= 1}
						class="p-2 rounded-lg border border-[#2f3336] text-[#71767b] hover:bg-[#1d1f23] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						<ChevronLeft size={20} />
					</button>
					
					{#each Array.from({ length: Math.min(5, data.pagination.totalPages) }, (_, i) => {
						const start = Math.max(1, Math.min(data.pagination.page - 2, data.pagination.totalPages - 4));
						return start + i;
					}).filter(p => p <= data.pagination.totalPages) as pageNum}
						<button
							onclick={() => goToPage(pageNum)}
							class="px-3 py-2 rounded-lg border transition-colors {
								pageNum === data.pagination.page 
									? 'border-[#1d9bf0] bg-[#1d9bf0]/20 text-[#1d9bf0]' 
									: 'border-[#2f3336] text-[#71767b] hover:bg-[#1d1f23] hover:text-white'
							}"
						>
							{pageNum}
						</button>
					{/each}
					
					<button
						onclick={() => goToPage(data.pagination.page + 1)}
						disabled={data.pagination.page >= data.pagination.totalPages}
						class="p-2 rounded-lg border border-[#2f3336] text-[#71767b] hover:bg-[#1d1f23] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
					>
						<ChevronRight size={20} />
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>
