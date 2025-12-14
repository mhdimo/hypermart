<script lang="ts">
	import { Search, Store, Package, AlertTriangle, Clock, Filter } from 'lucide-svelte';

	let { data } = $props();

	let searchQuery = $state('');
	let storeFilter = $state('');
	let statusFilter = $state('all');

	const today = new Date();
	const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

	function getExpiryStatus(dateStr: string | null): 'expired' | 'expiring' | 'ok' {
		if (!dateStr) return 'ok';
		const date = new Date(dateStr);
		if (date < today) return 'expired';
		if (date <= weekFromNow) return 'expiring';
		return 'ok';
	}

	function getStockStatus(qty: number): 'critical' | 'low' | 'ok' {
		if (qty <= 5) return 'critical';
		if (qty <= 15) return 'low';
		return 'ok';
	}

	const filteredStock = $derived(
		data.stock.filter((item: any) => {
			const matchesSearch = item.NomeProdotto.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.CodiceBarre?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStore = !storeFilter || item.ID_PuntoVendita.toString() === storeFilter;
			
			if (statusFilter === 'expiring') {
				return matchesSearch && matchesStore && getExpiryStatus(item.DataScadenza) !== 'ok';
			}
			if (statusFilter === 'low') {
				return matchesSearch && matchesStore && getStockStatus(item.QuantitaAttuale) !== 'ok';
			}
			return matchesSearch && matchesStore;
		})
	);

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('it-IT');
	}
</script>

<svelte:head>
	<title>Magazzino - HyperMart Admin</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="mb-8 animate-fadeIn">
		<h1 class="text-3xl font-bold text-white mb-2">Magazzino</h1>
		<p class="text-[#71767b]">Gestisci lo stock e i lotti prodotto</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-scaleIn opacity-0" style="animation-delay: 0.1s">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-xl bg-[#1d9bf0]/20">
					<Package size={24} class="text-[#1d9bf0]" />
				</div>
				<div>
					<div class="text-2xl font-bold text-white">{data.stock.length}</div>
					<div class="text-sm text-[#71767b]">Lotti Attivi</div>
				</div>
			</div>
		</div>
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-scaleIn opacity-0" style="animation-delay: 0.15s">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-xl bg-[#ffad1f]/20">
					<Clock size={24} class="text-[#ffad1f]" />
				</div>
				<div>
					<div class="text-2xl font-bold text-[#ffad1f]">
						{data.stock.filter((s: any) => getExpiryStatus(s.DataScadenza) === 'expiring').length}
					</div>
					<div class="text-sm text-[#71767b]">In Scadenza</div>
				</div>
			</div>
		</div>
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-scaleIn opacity-0" style="animation-delay: 0.2s">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-xl bg-[#f4212e]/20">
					<AlertTriangle size={24} class="text-[#f4212e]" />
				</div>
				<div>
					<div class="text-2xl font-bold text-[#f4212e]">
						{data.stock.filter((s: any) => getStockStatus(s.QuantitaAttuale) !== 'ok').length}
					</div>
					<div class="text-sm text-[#71767b]">Stock Basso</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="flex flex-col sm:flex-row gap-4 mb-6 animate-fadeIn" style="animation-delay: 0.25s">
		<div class="relative flex-1">
			<Search size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
			<input 
				type="text" 
				placeholder="Cerca prodotti..." 
				bind:value={searchQuery}
				class="w-full pl-12 pr-4 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white placeholder-[#71767b] focus:border-[#1d9bf0] focus:outline-none transition-colors"
			/>
		</div>
		<div class="flex gap-4">
			<div class="relative">
				<Store size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
				<select 
					bind:value={storeFilter}
					class="pl-12 pr-8 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white focus:border-[#1d9bf0] focus:outline-none transition-colors appearance-none cursor-pointer min-w-[180px]"
				>
					<option value="">Tutti i punti vendita</option>
					{#each data.stores as store}
						<option value={store.ID_PuntoVendita}>{store.NomePuntoVendita}</option>
					{/each}
				</select>
			</div>
			<div class="relative">
				<Filter size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
				<select 
					bind:value={statusFilter}
					class="pl-12 pr-8 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white focus:border-[#1d9bf0] focus:outline-none transition-colors appearance-none cursor-pointer min-w-[150px]"
				>
					<option value="all">Tutti</option>
					<option value="expiring">In scadenza</option>
					<option value="low">Stock basso</option>
				</select>
			</div>
		</div>
	</div>

	<!-- Stock Table -->
	<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl overflow-hidden animate-fadeIn" style="animation-delay: 0.3s">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-[#2f3336]">
						<th class="text-left p-4 text-[#71767b] font-medium">Prodotto</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden md:table-cell">Punto Vendita</th>
						<th class="text-left p-4 text-[#71767b] font-medium">Quantità</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden lg:table-cell">Carico</th>
						<th class="text-left p-4 text-[#71767b] font-medium">Scadenza</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden xl:table-cell">Costo Unit.</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredStock as item, i (item.ID_Lotto)}
						{@const expiryStatus = getExpiryStatus(item.DataScadenza)}
						{@const stockStatus = getStockStatus(item.QuantitaAttuale)}
						<tr class="border-b border-[#2f3336] hover:bg-[#1d1f23] transition-colors animate-slideIn opacity-0" style="animation-delay: {0.3 + i * 0.02}s">
							<td class="p-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-xl bg-[#1d9bf0]/20 flex items-center justify-center">
										<Package size={20} class="text-[#1d9bf0]" />
									</div>
									<div>
										<div class="font-medium text-white">{item.NomeProdotto}</div>
										<div class="text-xs text-[#71767b]">{item.CodiceBarre || 'N/A'}</div>
									</div>
								</div>
							</td>
							<td class="p-4 hidden md:table-cell">
								<div class="flex items-center gap-2 text-[#71767b]">
									<Store size={16} />
									<span>{item.NomePuntoVendita}</span>
								</div>
							</td>
							<td class="p-4">
								<div class="flex items-center gap-2">
									<span class="font-bold {stockStatus === 'critical' ? 'text-[#f4212e]' : stockStatus === 'low' ? 'text-[#ffad1f]' : 'text-white'}">
										{item.QuantitaAttuale}
									</span>
									<span class="text-[#71767b] text-sm">/ {item.QuantitaIniziale}</span>
								</div>
								<div class="w-20 h-1.5 bg-[#2f3336] rounded-full mt-1 overflow-hidden">
									<div 
										class="h-full rounded-full transition-all {stockStatus === 'critical' ? 'bg-[#f4212e]' : stockStatus === 'low' ? 'bg-[#ffad1f]' : 'bg-[#00ba7c]'}"
										style="width: {(item.QuantitaAttuale / item.QuantitaIniziale) * 100}%"
									></div>
								</div>
							</td>
							<td class="p-4 text-[#71767b] hidden lg:table-cell">
								{formatDate(item.DataCarico)}
							</td>
							<td class="p-4">
								<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium {
									expiryStatus === 'expired' ? 'bg-[#f4212e]/20 text-[#f4212e]' : 
									expiryStatus === 'expiring' ? 'bg-[#ffad1f]/20 text-[#ffad1f]' : 
									'bg-[#00ba7c]/20 text-[#00ba7c]'
								}">
									{#if expiryStatus === 'expired'}
										<AlertTriangle size={12} />
									{:else if expiryStatus === 'expiring'}
										<Clock size={12} />
									{/if}
									{formatDate(item.DataScadenza)}
								</span>
							</td>
							<td class="p-4 text-[#71767b] hidden xl:table-cell">
								€{(item.CostoAcquistoUnitario || 0).toFixed(2)}
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="p-12 text-center text-[#71767b]">
								<Package size={48} class="mx-auto mb-4 opacity-50" />
								<p>Nessun lotto trovato</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
