<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Trash2, X as XIcon, Tag, Percent, Calendar, Clock } from 'lucide-svelte';

	let { data, form } = $props();

	let showModal = $state(false);
	let deleteConfirm = $state<number | null>(null);

	const today = new Date();

	function getPromoStatus(promo: any): 'active' | 'upcoming' | 'expired' {
		const start = promo.DataInizio ? new Date(promo.DataInizio) : null;
		const end = promo.DataFine ? new Date(promo.DataFine) : null;
		
		if (end && end < today) return 'expired';
		if (start && start > today) return 'upcoming';
		return 'active';
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('it-IT');
	}

	function formatDiscount(promo: any): string {
		if (promo.TipoSconto === 'Percentuale') {
			return `${(promo.ValoreSconto * 100).toFixed(0)}%`;
		}
		return `€${promo.ValoreSconto?.toFixed(2) || '0.00'}`;
	}
</script>

<svelte:head>
	<title>Promozioni - HyperMart Admin</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeIn">
		<div>
			<h1 class="text-3xl font-bold text-white mb-2">Promozioni</h1>
			<p class="text-[#71767b]">Gestisci sconti e offerte</p>
		</div>
		<button 
			onclick={() => showModal = true}
			class="flex items-center gap-2 px-6 py-3 bg-[#1d9bf0] text-white font-bold rounded-full hover:bg-[#1a8cd8] transition-all hover:scale-[1.02] active:scale-[0.98]"
		>
			<Plus size={20} />
			<span>Nuova Promozione</span>
		</button>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-scaleIn opacity-0" style="animation-delay: 0.1s">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-xl bg-[#00ba7c]/20">
					<Tag size={24} class="text-[#00ba7c]" />
				</div>
				<div>
					<div class="text-2xl font-bold text-[#00ba7c]">
						{data.promotions.filter((p: any) => getPromoStatus(p) === 'active').length}
					</div>
					<div class="text-sm text-[#71767b]">Attive</div>
				</div>
			</div>
		</div>
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-scaleIn opacity-0" style="animation-delay: 0.15s">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-xl bg-[#1d9bf0]/20">
					<Clock size={24} class="text-[#1d9bf0]" />
				</div>
				<div>
					<div class="text-2xl font-bold text-[#1d9bf0]">
						{data.promotions.filter((p: any) => getPromoStatus(p) === 'upcoming').length}
					</div>
					<div class="text-sm text-[#71767b]">In Arrivo</div>
				</div>
			</div>
		</div>
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 animate-scaleIn opacity-0" style="animation-delay: 0.2s">
			<div class="flex items-center gap-4">
				<div class="p-3 rounded-xl bg-[#71767b]/20">
					<Calendar size={24} class="text-[#71767b]" />
				</div>
				<div>
					<div class="text-2xl font-bold text-[#71767b]">
						{data.promotions.filter((p: any) => getPromoStatus(p) === 'expired').length}
					</div>
					<div class="text-sm text-[#71767b]">Scadute</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Promotions Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each data.promotions as promo, i (promo.ID_Promozione)}
			{@const status = getPromoStatus(promo)}
			<div 
				class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 hover:border-[#1d9bf0]/50 transition-all duration-300 animate-scaleIn opacity-0 group {status === 'expired' ? 'opacity-60' : ''}"
				style="animation-delay: {0.2 + i * 0.03}s"
			>
				<div class="flex items-start justify-between mb-4">
					<div class="w-12 h-12 rounded-xl flex items-center justify-center {
						status === 'active' ? 'bg-[#00ba7c]/20' : 
						status === 'upcoming' ? 'bg-[#1d9bf0]/20' : 
						'bg-[#71767b]/20'
					} group-hover:scale-110 transition-transform">
						<Percent size={24} class="{
							status === 'active' ? 'text-[#00ba7c]' : 
							status === 'upcoming' ? 'text-[#1d9bf0]' : 
							'text-[#71767b]'
						}" />
					</div>
					<div class="flex items-center gap-2">
						<span class="text-xs px-2 py-1 rounded-full font-medium {
							status === 'active' ? 'bg-[#00ba7c]/20 text-[#00ba7c]' : 
							status === 'upcoming' ? 'bg-[#1d9bf0]/20 text-[#1d9bf0]' : 
							'bg-[#71767b]/20 text-[#71767b]'
						}">
							{status === 'active' ? 'Attiva' : status === 'upcoming' ? 'In arrivo' : 'Scaduta'}
						</span>
						<button 
							onclick={() => deleteConfirm = promo.ID_Promozione}
							class="p-2 rounded-full hover:bg-[#f4212e]/20 text-[#71767b] hover:text-[#f4212e] transition-all"
						>
							<Trash2 size={16} />
						</button>
					</div>
				</div>
				<h3 class="text-lg font-bold text-white mb-2">{promo.NomePromozione}</h3>
				<p class="text-[#71767b] text-sm mb-4 line-clamp-2">{promo.Descrizione || 'Nessuna descrizione'}</p>
				
				<div class="flex items-center justify-between mb-3">
					<span class="text-3xl font-bold {status === 'active' ? 'text-[#00ba7c]' : 'text-[#71767b]'}">
						-{formatDiscount(promo)}
					</span>
				</div>

				<div class="pt-3 border-t border-[#2f3336] flex items-center gap-2 text-sm text-[#71767b]">
					<Calendar size={14} />
					<span>{formatDate(promo.DataInizio)} - {formatDate(promo.DataFine)}</span>
				</div>
			</div>
		{:else}
			<div class="col-span-full text-center py-12 text-[#71767b]">
				<Tag size={48} class="mx-auto mb-4 opacity-50" />
				<p>Nessuna promozione trovata</p>
			</div>
		{/each}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if deleteConfirm}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn p-4">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 w-full max-w-md animate-scaleIn">
			<h3 class="text-xl font-bold text-white mb-4">Conferma Eliminazione</h3>
			<p class="text-[#71767b] mb-6">Sei sicuro di voler eliminare questa promozione?</p>
			<div class="flex gap-3 justify-end">
				<button 
					onclick={() => deleteConfirm = null}
					class="px-5 py-2 rounded-full border border-[#2f3336] text-white hover:bg-[#1d1f23] transition-colors"
				>
					Annulla
				</button>
				<form method="POST" action="?/delete" use:enhance={() => {
					return async ({ update }) => {
						await update();
						deleteConfirm = null;
					};
				}}>
					<input type="hidden" name="id" value={deleteConfirm} />
					<button 
						type="submit"
						class="px-5 py-2 rounded-full bg-[#f4212e] text-white font-bold hover:bg-[#dc1e29] transition-colors"
					>
						Elimina
					</button>
				</form>
			</div>
		</div>
	</div>
{/if}

<!-- Create Modal -->
{#if showModal}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn p-4">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl w-full max-w-lg animate-scaleIn">
			<div class="flex items-center justify-between p-6 border-b border-[#2f3336]">
				<h2 class="text-xl font-bold text-white">Nuova Promozione</h2>
				<button 
					onclick={() => showModal = false}
					class="p-2 rounded-full hover:bg-[#1d1f23] text-[#71767b] hover:text-white transition-colors"
				>
					<XIcon size={24} />
				</button>
			</div>
			<form 
				method="POST" 
				action="?/create"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							showModal = false;
						}
						await update();
					};
				}}
				class="p-6 space-y-4"
			>
				<div>
					<label class="block text-sm text-[#71767b] mb-2">Nome Promozione *</label>
					<input 
						type="text" 
						name="nomePromozione"
						required
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="es. Sconto Natale 2024"
					/>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Descrizione</label>
					<textarea 
						name="descrizione"
						rows="2"
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors resize-none"
						placeholder="Descrizione della promozione"
					></textarea>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Data Inizio</label>
						<input 
							type="date" 
							name="dataInizio"
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						/>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Data Fine</label>
						<input 
							type="date" 
							name="dataFine"
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Tipo Sconto</label>
						<select 
							name="tipoSconto"
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						>
							<option value="Percentuale">Percentuale</option>
							<option value="Fisso">Fisso (€)</option>
						</select>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Valore (es. 0.20 = 20%)</label>
						<input 
							type="number" 
							name="valoreSconto"
							step="0.01"
							min="0"
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="0.20"
						/>
					</div>
				</div>

				{#if form?.error}
					<div class="p-4 rounded-xl bg-[#f4212e]/20 text-[#f4212e] text-sm">
						{form.error}
					</div>
				{/if}

				<div class="flex gap-3 pt-4">
					<button 
						type="button"
						onclick={() => showModal = false}
						class="flex-1 py-3 rounded-full border border-[#2f3336] text-white hover:bg-[#1d1f23] transition-colors"
					>
						Annulla
					</button>
					<button 
						type="submit"
						class="flex-1 py-3 rounded-full bg-[#1d9bf0] text-white font-bold hover:bg-[#1a8cd8] transition-colors"
					>
						Crea
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
