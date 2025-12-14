<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Pencil, Trash2, X as XIcon, Layers, Package } from 'lucide-svelte';

	let { data, form } = $props();

	let showModal = $state(false);
	let editingCategory = $state<any>(null);
	let deleteConfirm = $state<number | null>(null);

	const colors = ['#1d9bf0', '#00ba7c', '#ffad1f', '#f4212e', '#794bc4', '#ff7a00'];

	function openCreate() {
		editingCategory = null;
		showModal = true;
	}

	function openEdit(category: any) {
		editingCategory = category;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingCategory = null;
	}
</script>

<svelte:head>
	<title>Categorie - HyperMart Admin</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeIn">
		<div>
			<h1 class="text-3xl font-bold text-white mb-2">Categorie</h1>
			<p class="text-[#71767b]">Gestisci le categorie prodotto</p>
		</div>
		<button 
			onclick={openCreate}
			class="flex items-center gap-2 px-6 py-3 bg-[#1d9bf0] text-white font-bold rounded-full hover:bg-[#1a8cd8] transition-all hover:scale-[1.02] active:scale-[0.98]"
		>
			<Plus size={20} />
			<span>Nuova Categoria</span>
		</button>
	</div>

	<!-- Categories Grid -->
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
		{#each data.categories as category, i (category.ID_Categoria)}
			{@const color = colors[i % colors.length]}
			<div 
				class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 hover:border-[#1d9bf0]/50 transition-all duration-300 animate-scaleIn opacity-0 group"
				style="animation-delay: {i * 0.05}s"
			>
				<div class="flex items-start justify-between mb-4">
					<div 
						class="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
						style="background-color: {color}20"
					>
						<Layers size={24} style="color: {color}" />
					</div>
					<div class="flex gap-1">
						<button 
							onclick={() => openEdit(category)}
							class="p-2 rounded-full hover:bg-[#1d9bf0]/20 text-[#71767b] hover:text-[#1d9bf0] transition-all"
						>
							<Pencil size={16} />
						</button>
						<button 
							onclick={() => deleteConfirm = category.ID_Categoria}
							class="p-2 rounded-full hover:bg-[#f4212e]/20 text-[#71767b] hover:text-[#f4212e] transition-all"
						>
							<Trash2 size={16} />
						</button>
					</div>
				</div>
				<h3 class="text-lg font-bold text-white mb-2">{category.NomeCategoria}</h3>
				<p class="text-[#71767b] text-sm mb-4 line-clamp-2">{category.Descrizione || 'Nessuna descrizione'}</p>
				<div class="flex items-center gap-2 text-sm" style="color: {color}">
					<Package size={16} />
					<span>{category.productCount} prodotti</span>
				</div>
			</div>
		{:else}
			<div class="col-span-full text-center py-12 text-[#71767b]">
				<Layers size={48} class="mx-auto mb-4 opacity-50" />
				<p>Nessuna categoria trovata</p>
			</div>
		{/each}
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if deleteConfirm}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn p-4">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 w-full max-w-md animate-scaleIn">
			<h3 class="text-xl font-bold text-white mb-4">Conferma Eliminazione</h3>
			<p class="text-[#71767b] mb-6">Sei sicuro di voler eliminare questa categoria? I prodotti associati perderanno la categoria.</p>
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
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl w-full max-w-md animate-scaleIn">
			<div class="flex items-center justify-between p-6 border-b border-[#2f3336]">
				<h2 class="text-xl font-bold text-white">
					{editingCategory ? 'Modifica Categoria' : 'Nuova Categoria'}
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
				action={editingCategory ? '?/update' : '?/create'}
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
				{#if editingCategory}
					<input type="hidden" name="id" value={editingCategory.ID_Categoria} />
				{/if}

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Nome Categoria *</label>
					<input 
						type="text" 
						name="nomeCategoria"
						value={editingCategory?.NomeCategoria || ''}
						required
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="Nome della categoria"
					/>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Descrizione</label>
					<textarea 
						name="descrizione"
						rows="3"
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors resize-none"
						placeholder="Descrizione della categoria"
					>{editingCategory?.Descrizione || ''}</textarea>
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
						{editingCategory ? 'Salva' : 'Crea'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
