<script lang="ts">
	import { Settings, Store, Users, Database, Shield, Bell, Palette } from 'lucide-svelte';

	let { data } = $props();

	let activeTab = $state('stores');

	const tabs = [
		{ id: 'stores', label: 'Punti Vendita', icon: Store },
		{ id: 'operators', label: 'Operatori', icon: Users },
		{ id: 'system', label: 'Sistema', icon: Database },
	];
</script>

<svelte:head>
	<title>Impostazioni - HyperMart Admin</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="mb-8 animate-fadeIn">
		<h1 class="text-3xl font-bold text-white mb-2">Impostazioni</h1>
		<p class="text-[#71767b]">Configura il sistema e gestisci gli accessi</p>
	</div>

	<!-- Tabs -->
	<div class="flex gap-2 mb-8 overflow-x-auto pb-2 animate-fadeIn" style="animation-delay: 0.1s">
		{#each tabs as tab}
			<button
				onclick={() => activeTab = tab.id}
				class="flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all whitespace-nowrap {
					activeTab === tab.id 
						? 'bg-[#1d9bf0] text-white' 
						: 'bg-[#16181c] text-[#71767b] hover:bg-[#1d1f23] hover:text-white border border-[#2f3336]'
				}"
			>
				<tab.icon size={18} />
				<span>{tab.label}</span>
			</button>
		{/each}
	</div>

	<!-- Tab Content -->
	<div class="animate-fadeIn" style="animation-delay: 0.2s">
		{#if activeTab === 'stores'}
			<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6">
				<h2 class="text-xl font-bold text-white mb-6">Punti Vendita</h2>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#each data.stores as store, i}
						<div class="p-4 rounded-xl bg-[#000000] border border-[#2f3336] hover:border-[#1d9bf0]/50 transition-all animate-scaleIn opacity-0" style="animation-delay: {0.2 + i * 0.05}s">
							<div class="flex items-start gap-4">
								<div class="w-12 h-12 rounded-xl bg-[#1d9bf0]/20 flex items-center justify-center">
									<Store size={24} class="text-[#1d9bf0]" />
								</div>
								<div class="flex-1">
									<h3 class="font-bold text-white mb-1">{store.NomePuntoVendita}</h3>
									<p class="text-sm text-[#71767b]">{store.Indirizzo || 'Indirizzo non specificato'}</p>
									<p class="text-sm text-[#71767b]">{store.Citta || ''} {store.CAP || ''} {store.Provincia || ''}</p>
									{#if store.Telefono}
										<p class="text-sm text-[#1d9bf0] mt-1">{store.Telefono}</p>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{:else if activeTab === 'operators'}
			<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl overflow-hidden">
				<div class="p-6 border-b border-[#2f3336]">
					<h2 class="text-xl font-bold text-white">Operatori</h2>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-[#2f3336]">
								<th class="text-left p-4 text-[#71767b] font-medium">Operatore</th>
								<th class="text-left p-4 text-[#71767b] font-medium">Username</th>
								<th class="text-left p-4 text-[#71767b] font-medium hidden md:table-cell">Ruolo</th>
								<th class="text-left p-4 text-[#71767b] font-medium hidden lg:table-cell">Punto Vendita</th>
								<th class="text-left p-4 text-[#71767b] font-medium">Stato</th>
							</tr>
						</thead>
						<tbody>
							{#each data.operators as op, i}
								<tr class="border-b border-[#2f3336] hover:bg-[#1d1f23] transition-colors animate-slideIn opacity-0" style="animation-delay: {0.2 + i * 0.05}s">
									<td class="p-4">
										<div class="flex items-center gap-3">
											<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d9bf0] to-[#794bc4] flex items-center justify-center text-white font-bold">
												{op.Nome?.charAt(0) || ''}{op.Cognome?.charAt(0) || ''}
											</div>
											<div>
												<div class="font-medium text-white">{op.Nome} {op.Cognome}</div>
											</div>
										</div>
									</td>
									<td class="p-4 text-[#71767b] font-mono">@{op.Username}</td>
									<td class="p-4 hidden md:table-cell">
										<span class="px-2 py-1 rounded-full text-xs font-medium {
											op.Ruolo === 'Admin' ? 'bg-[#f4212e]/20 text-[#f4212e]' : 'bg-[#1d9bf0]/20 text-[#1d9bf0]'
										}">
											{op.Ruolo}
										</span>
									</td>
									<td class="p-4 text-[#71767b] hidden lg:table-cell">{op.NomePuntoVendita || '-'}</td>
									<td class="p-4">
										<span class="px-2 py-1 rounded-full text-xs font-medium {
											op.Attivo ? 'bg-[#00ba7c]/20 text-[#00ba7c]' : 'bg-[#71767b]/20 text-[#71767b]'
										}">
											{op.Attivo ? 'Attivo' : 'Inattivo'}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else if activeTab === 'system'}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6">
					<div class="flex items-center gap-4 mb-6">
						<div class="p-3 rounded-xl bg-[#794bc4]/20">
							<Database size={24} class="text-[#794bc4]" />
						</div>
						<div>
							<h3 class="font-bold text-white">Database</h3>
							<p class="text-sm text-[#71767b]">SQLite 3</p>
						</div>
					</div>
					<div class="space-y-3">
						<div class="flex items-center justify-between p-3 rounded-xl bg-[#000000]">
							<span class="text-[#71767b]">Stato</span>
							<span class="text-[#00ba7c] font-medium">Connesso</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-xl bg-[#000000]">
							<span class="text-[#71767b]">Modalità</span>
							<span class="text-white">WAL</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-xl bg-[#000000]">
							<span class="text-[#71767b]">File</span>
							<span class="text-white font-mono text-sm">hypermart.db</span>
						</div>
					</div>
				</div>

				<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6">
					<div class="flex items-center gap-4 mb-6">
						<div class="p-3 rounded-xl bg-[#1d9bf0]/20">
							<Shield size={24} class="text-[#1d9bf0]" />
						</div>
						<div>
							<h3 class="font-bold text-white">Sicurezza</h3>
							<p class="text-sm text-[#71767b]">Impostazioni di sicurezza</p>
						</div>
					</div>
					<div class="space-y-3">
						<div class="flex items-center justify-between p-3 rounded-xl bg-[#000000]">
							<span class="text-[#71767b]">HTTPS</span>
							<span class="text-[#00ba7c] font-medium">Attivo</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-xl bg-[#000000]">
							<span class="text-[#71767b]">Backup Automatico</span>
							<span class="text-[#ffad1f] font-medium">Non configurato</span>
						</div>
					</div>
				</div>

				<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6">
					<div class="flex items-center gap-4 mb-6">
						<div class="p-3 rounded-xl bg-[#00ba7c]/20">
							<Bell size={24} class="text-[#00ba7c]" />
						</div>
						<div>
							<h3 class="font-bold text-white">Notifiche</h3>
							<p class="text-sm text-[#71767b]">Gestione avvisi</p>
						</div>
					</div>
					<div class="space-y-3">
						<label class="flex items-center justify-between p-3 rounded-xl bg-[#000000] cursor-pointer">
							<span class="text-[#71767b]">Stock basso</span>
							<input type="checkbox" checked class="w-5 h-5 rounded accent-[#1d9bf0]" />
						</label>
						<label class="flex items-center justify-between p-3 rounded-xl bg-[#000000] cursor-pointer">
							<span class="text-[#71767b]">Prodotti in scadenza</span>
							<input type="checkbox" checked class="w-5 h-5 rounded accent-[#1d9bf0]" />
						</label>
					</div>
				</div>

				<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6">
					<div class="flex items-center gap-4 mb-6">
						<div class="p-3 rounded-xl bg-[#ffad1f]/20">
							<Palette size={24} class="text-[#ffad1f]" />
						</div>
						<div>
							<h3 class="font-bold text-white">Tema</h3>
							<p class="text-sm text-[#71767b]">Personalizzazione UI</p>
						</div>
					</div>
					<div class="space-y-3">
						<div class="flex items-center justify-between p-3 rounded-xl bg-[#000000]">
							<span class="text-[#71767b]">Tema Attuale</span>
							<span class="text-white font-medium">AMOLED Dark</span>
						</div>
						<div class="flex items-center justify-between p-3 rounded-xl bg-[#000000]">
							<span class="text-[#71767b]">Accent Color</span>
							<div class="w-6 h-6 rounded-full bg-[#1d9bf0]"></div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
