<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Pencil, Trash2, X as XIcon, Search, Truck, Mail, Phone, User } from 'lucide-svelte';
	import type { Fornitore } from '$lib/types';

	let { data, form } = $props();

	let showModal = $state(false);
	let editingSupplier = $state<Fornitore | null>(null);
	let searchQuery = $state('');
	let deleteConfirm = $state<number | null>(null);

	const filteredSuppliers = $derived(
		data.suppliers.filter((s: Fornitore) => 
			s.RagioneSociale.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.Email_F?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.Referente_F?.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	function openCreate() {
		editingSupplier = null;
		showModal = true;
	}

	function openEdit(supplier: Fornitore) {
		editingSupplier = supplier;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingSupplier = null;
	}
</script>

<svelte:head>
	<title>Fornitori - HyperMart Admin</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeIn">
		<div>
			<h1 class="text-3xl font-bold text-white mb-2">Fornitori</h1>
			<p class="text-[#71767b]">Gestisci l'anagrafica fornitori</p>
		</div>
		<button 
			onclick={openCreate}
			class="flex items-center gap-2 px-6 py-3 bg-[#1d9bf0] text-white font-bold rounded-full hover:bg-[#1a8cd8] transition-all hover:scale-[1.02] active:scale-[0.98]"
		>
			<Plus size={20} />
			<span>Nuovo Fornitore</span>
		</button>
	</div>

	<!-- Search -->
	<div class="relative mb-6 animate-fadeIn" style="animation-delay: 0.1s">
		<Search size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
		<input 
			type="text" 
			placeholder="Cerca fornitori..." 
			bind:value={searchQuery}
			class="w-full max-w-md pl-12 pr-4 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white placeholder-[#71767b] focus:border-[#1d9bf0] focus:outline-none transition-colors"
		/>
	</div>

	<!-- Suppliers Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each filteredSuppliers as supplier, i (supplier.ID_Fornitore)}
			<div 
				class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 hover:border-[#1d9bf0]/50 transition-all duration-300 animate-scaleIn opacity-0 group"
				style="animation-delay: {0.1 + i * 0.03}s"
			>
				<div class="flex items-start justify-between mb-4">
					<div class="w-12 h-12 rounded-xl bg-[#00ba7c]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
						<Truck size={24} class="text-[#00ba7c]" />
					</div>
					<div class="flex gap-2">
						<button 
							onclick={() => openEdit(supplier)}
							class="p-2 rounded-full hover:bg-[#1d9bf0]/20 text-[#71767b] hover:text-[#1d9bf0] transition-all"
						>
							<Pencil size={18} />
						</button>
						<button 
							onclick={() => deleteConfirm = supplier.ID_Fornitore}
							class="p-2 rounded-full hover:bg-[#f4212e]/20 text-[#71767b] hover:text-[#f4212e] transition-all"
						>
							<Trash2 size={18} />
						</button>
					</div>
				</div>
				<h3 class="text-lg font-bold text-white mb-3">{supplier.RagioneSociale}</h3>
				<div class="space-y-2 text-sm">
					{#if supplier.Referente_F}
						<div class="flex items-center gap-2 text-[#71767b]">
							<User size={16} />
							<span>{supplier.Referente_F}</span>
						</div>
					{/if}
					{#if supplier.Email_F}
						<div class="flex items-center gap-2 text-[#71767b]">
							<Mail size={16} />
							<span class="truncate">{supplier.Email_F}</span>
						</div>
					{/if}
					{#if supplier.Telefono_F}
						<div class="flex items-center gap-2 text-[#71767b]">
							<Phone size={16} />
							<span>{supplier.Telefono_F}</span>
						</div>
					{/if}
				</div>
				{#if supplier.Citta_F}
					<div class="mt-4 pt-4 border-t border-[#2f3336]">
						<span class="text-xs text-[#71767b]">{supplier.Citta_F}{supplier.Provincia_F ? ` (${supplier.Provincia_F})` : ''}</span>
					</div>
				{/if}
			</div>
		{:else}
			<div class="col-span-full text-center py-12 text-[#71767b]">
				<Truck size={48} class="mx-auto mb-4 opacity-50" />
				<p>Nessun fornitore trovato</p>
			</div>
		{/each}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if deleteConfirm}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn p-4">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 w-full max-w-md animate-scaleIn">
			<h3 class="text-xl font-bold text-white mb-4">Conferma Eliminazione</h3>
			<p class="text-[#71767b] mb-6">Sei sicuro di voler eliminare questo fornitore?</p>
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

<!-- Create/Edit Modal -->
{#if showModal}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn p-4">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scaleIn">
			<div class="flex items-center justify-between p-6 border-b border-[#2f3336]">
				<h2 class="text-xl font-bold text-white">
					{editingSupplier ? 'Modifica Fornitore' : 'Nuovo Fornitore'}
				</h2>
				<button 
					onclick={closeModal}
					class="p-2 rounded-full hover:bg-[#1d1f23] text-[#71767b] hover:text-white transition-colors"
				>
					<XIcon size={24} />
				</button>
			</div>
			<form 
				method="POST" 
				action={editingSupplier ? '?/update' : '?/create'}
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							closeModal();
						}
						await update();
					};
				}}
				class="p-6 space-y-4"
			>
				{#if editingSupplier}
					<input type="hidden" name="id" value={editingSupplier.ID_Fornitore} />
				{/if}

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Ragione Sociale *</label>
					<input 
						type="text" 
						name="ragioneSociale"
						value={editingSupplier?.RagioneSociale || ''}
						required
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="Nome azienda"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Partita IVA</label>
						<input 
							type="text" 
							name="partitaIva"
							value={editingSupplier?.PartitaIVA_F || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="01234567890"
						/>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Referente</label>
						<input 
							type="text" 
							name="referente"
							value={editingSupplier?.Referente_F || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="Nome referente"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Email</label>
					<input 
						type="email" 
						name="email"
						value={editingSupplier?.Email_F || ''}
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="email@fornitore.it"
					/>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Telefono</label>
					<input 
						type="tel" 
						name="telefono"
						value={editingSupplier?.Telefono_F || ''}
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="+39 02 1234567"
					/>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Indirizzo</label>
					<input 
						type="text" 
						name="indirizzo"
						value={editingSupplier?.Indirizzo_F || ''}
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="Via Roma, 1"
					/>
				</div>

				<div class="grid grid-cols-3 gap-4">
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Città</label>
						<input 
							type="text" 
							name="citta"
							value={editingSupplier?.Citta_F || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="Milano"
						/>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">CAP</label>
						<input 
							type="text" 
							name="cap"
							value={editingSupplier?.CAP_F || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="20100"
						/>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Provincia</label>
						<input 
							type="text" 
							name="provincia"
							value={editingSupplier?.Provincia_F || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors uppercase"
							placeholder="MI"
							maxlength="2"
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
						onclick={closeModal}
						class="flex-1 py-3 rounded-full border border-[#2f3336] text-white hover:bg-[#1d1f23] transition-colors"
					>
						Annulla
					</button>
					<button 
						type="submit"
						class="flex-1 py-3 rounded-full bg-[#1d9bf0] text-white font-bold hover:bg-[#1a8cd8] transition-colors"
					>
						{editingSupplier ? 'Salva' : 'Crea'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
