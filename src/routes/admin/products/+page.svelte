<script lang="ts">
	import { enhance } from '$app/forms';
	import { 
		Plus, 
		Pencil, 
		Trash2, 
		X as XIcon, 
		Search,
		Package,
		Filter
	} from 'lucide-svelte';
	import type { Prodotto, Categoria, Fornitore } from '$lib/types';

	let { data, form } = $props();

	let showModal = $state(false);
	let editingProduct = $state<Prodotto | null>(null);
	let searchQuery = $state('');
	let categoryFilter = $state('');
	let deleteConfirm = $state<number | null>(null);

	const filteredProducts = $derived(
		data.products.filter((p: Prodotto) => {
			const matchesSearch = p.NomeProdotto.toLowerCase().includes(searchQuery.toLowerCase()) ||
				p.CodiceBarre?.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = !categoryFilter || p.ID_Categoria?.toString() === categoryFilter;
			return matchesSearch && matchesCategory;
		})
	);

	function openCreate() {
		editingProduct = null;
		showModal = true;
	}

	function openEdit(product: Prodotto) {
		editingProduct = product;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingProduct = null;
	}
</script>

<svelte:head>
	<title>Prodotti - HyperMart Admin</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeIn">
		<div>
			<h1 class="text-3xl font-bold text-white mb-2">Prodotti</h1>
			<p class="text-[#71767b]">Gestisci il catalogo prodotti</p>
		</div>
		<button 
			onclick={openCreate}
			class="flex items-center gap-2 px-6 py-3 bg-[#1d9bf0] text-white font-bold rounded-full hover:bg-[#1a8cd8] transition-all hover:scale-[1.02] active:scale-[0.98]"
		>
			<Plus size={20} />
			<span>Nuovo Prodotto</span>
		</button>
	</div>

	<!-- Filters -->
	<div class="flex flex-col sm:flex-row gap-4 mb-6 animate-fadeIn" style="animation-delay: 0.1s">
		<div class="relative flex-1">
			<Search size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
			<input 
				type="text" 
				placeholder="Cerca prodotti..." 
				bind:value={searchQuery}
				class="w-full pl-12 pr-4 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white placeholder-[#71767b] focus:border-[#1d9bf0] focus:outline-none transition-colors"
			/>
		</div>
		<div class="relative">
			<Filter size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
			<select 
				bind:value={categoryFilter}
				class="pl-12 pr-8 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white focus:border-[#1d9bf0] focus:outline-none transition-colors appearance-none cursor-pointer min-w-[200px]"
				style="background-color: #16181c;"
			>
				<option value="" class="bg-[#16181c] text-white">Tutte le categorie</option>
				{#each data.categories as cat}
					<option value={String(cat.ID_Categoria)} class="bg-[#16181c] text-white">{cat.NomeCategoria}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Products Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
		{#each filteredProducts as product, i (product.ID_Prodotto)}
			<div 
				class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 hover:border-[#1d9bf0]/50 transition-all duration-300 animate-scaleIn opacity-0 group"
				style="animation-delay: {0.1 + i * 0.03}s"
			>
				<div class="flex items-start justify-between mb-4">
					<div class="w-12 h-12 rounded-xl bg-[#1d9bf0]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
						<Package size={24} class="text-[#1d9bf0]" />
					</div>
					<div class="flex gap-2">
						<button 
							onclick={() => openEdit(product)}
							class="p-2 rounded-full hover:bg-[#1d9bf0]/20 text-[#71767b] hover:text-[#1d9bf0] transition-all"
						>
							<Pencil size={18} />
						</button>
						<button 
							onclick={() => deleteConfirm = product.ID_Prodotto}
							class="p-2 rounded-full hover:bg-[#f4212e]/20 text-[#71767b] hover:text-[#f4212e] transition-all"
						>
							<Trash2 size={18} />
						</button>
					</div>
				</div>
				<h3 class="text-lg font-bold text-white mb-2 line-clamp-1">{product.NomeProdotto}</h3>
				<p class="text-[#71767b] text-sm mb-4 line-clamp-2">{product.Descrizione || 'Nessuna descrizione'}</p>
				<div class="flex items-center justify-between">
					<span class="text-xs px-3 py-1 rounded-full bg-[#1d9bf0]/20 text-[#1d9bf0]">
						{product.NomeCategoria || 'Senza categoria'}
					</span>
					<span class="text-xl font-bold text-[#00ba7c]">
						€{(product.PrezzoUnitarioVendita || 0).toFixed(2)}
					</span>
				</div>
				{#if product.CodiceBarre}
					<div class="mt-3 pt-3 border-t border-[#2f3336]">
						<span class="text-xs text-[#71767b]">Codice: {product.CodiceBarre}</span>
					</div>
				{/if}
			</div>
		{:else}
			<div class="col-span-full text-center py-12 text-[#71767b]">
				<Package size={48} class="mx-auto mb-4 opacity-50" />
				<p>Nessun prodotto trovato</p>
			</div>
		{/each}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if deleteConfirm}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn p-4">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 w-full max-w-md animate-scaleIn">
			<h3 class="text-xl font-bold text-white mb-4">Conferma Eliminazione</h3>
			<p class="text-[#71767b] mb-6">Sei sicuro di voler eliminare questo prodotto? L'azione non può essere annullata.</p>
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
					{editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
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
				action={editingProduct ? '?/update' : '?/create'}
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
				{#if editingProduct}
					<input type="hidden" name="id" value={editingProduct.ID_Prodotto} />
				{/if}

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Codice a Barre</label>
					<input 
						type="text" 
						name="codiceBarre"
						value={editingProduct?.CodiceBarre || ''}
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="es. 8001234567890"
					/>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Nome Prodotto *</label>
					<input 
						type="text" 
						name="nomeProdotto"
						value={editingProduct?.NomeProdotto || ''}
						required
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="Nome del prodotto"
					/>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Descrizione</label>
					<textarea 
						name="descrizione"
						rows="3"
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors resize-none"
						placeholder="Descrizione del prodotto"
					>{editingProduct?.Descrizione || ''}</textarea>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Categoria</label>
						<select 
							name="idCategoria"
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						>
							<option value="">Seleziona...</option>
							{#each data.categories as cat}
								<option value={cat.ID_Categoria} selected={editingProduct?.ID_Categoria === cat.ID_Categoria}>
									{cat.NomeCategoria}
								</option>
							{/each}
						</select>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Fornitore</label>
						<select 
							name="idFornitore"
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						>
							<option value="">Seleziona...</option>
							{#each data.suppliers as sup}
								<option value={sup.ID_Fornitore} selected={editingProduct?.ID_FornitorePreferenziale === sup.ID_Fornitore}>
									{sup.RagioneSociale}
								</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Prezzo (€)</label>
						<input 
							type="number" 
							name="prezzo"
							step="0.01"
							min="0"
							value={editingProduct?.PrezzoUnitarioVendita || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="0.00"
						/>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Aliquota IVA</label>
						<select 
							name="iva"
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						>
							<option value="0.22" selected={!editingProduct || editingProduct.AliquotaIVA === 0.22}>22%</option>
							<option value="0.10" selected={editingProduct?.AliquotaIVA === 0.10}>10%</option>
							<option value="0.04" selected={editingProduct?.AliquotaIVA === 0.04}>4%</option>
							<option value="0" selected={editingProduct?.AliquotaIVA === 0}>Esente</option>
						</select>
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
						{editingProduct ? 'Salva' : 'Crea'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
