<script lang="ts">
	import { enhance } from '$app/forms';
	import { 
		Plus, 
		Pencil, 
		Trash2, 
		X as XIcon, 
		Search,
		User,
		Mail,
		Phone,
		MapPin
	} from 'lucide-svelte';
	import type { Cliente } from '$lib/types';

	let { data, form } = $props();

	let showModal = $state(false);
	let editingCustomer = $state<Cliente | null>(null);
	let searchQuery = $state('');
	let deleteConfirm = $state<number | null>(null);

	const filteredCustomers = $derived(
		data.customers.filter((c: Cliente) => {
			const fullName = `${c.Nome || ''} ${c.Cognome || ''}`.toLowerCase();
			return fullName.includes(searchQuery.toLowerCase()) ||
				c.Email_Cli?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				c.Telefono_Cli?.includes(searchQuery);
		})
	);

	function openCreate() {
		editingCustomer = null;
		showModal = true;
	}

	function openEdit(customer: Cliente) {
		editingCustomer = customer;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingCustomer = null;
	}

	function getInitials(nome?: string, cognome?: string): string {
		return `${nome?.charAt(0) || ''}${cognome?.charAt(0) || ''}`.toUpperCase() || '?';
	}
</script>

<svelte:head>
	<title>Clienti - HyperMart Admin</title>
</svelte:head>

<div class="p-6 lg:p-8">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeIn">
		<div>
			<h1 class="text-3xl font-bold text-white mb-2">Clienti</h1>
			<p class="text-[#71767b]">Gestisci l'anagrafica clienti</p>
		</div>
		<button 
			onclick={openCreate}
			class="flex items-center gap-2 px-6 py-3 bg-[#1d9bf0] text-white font-bold rounded-full hover:bg-[#1a8cd8] transition-all hover:scale-[1.02] active:scale-[0.98]"
		>
			<Plus size={20} />
			<span>Nuovo Cliente</span>
		</button>
	</div>

	<!-- Search -->
	<div class="relative mb-6 animate-fadeIn" style="animation-delay: 0.1s">
		<Search size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
		<input 
			type="text" 
			placeholder="Cerca clienti..." 
			bind:value={searchQuery}
			class="w-full max-w-md pl-12 pr-4 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white placeholder-[#71767b] focus:border-[#1d9bf0] focus:outline-none transition-colors"
		/>
	</div>

	<!-- Customers List -->
	<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl overflow-hidden animate-fadeIn" style="animation-delay: 0.2s">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead>
					<tr class="border-b border-[#2f3336]">
						<th class="text-left p-4 text-[#71767b] font-medium">Cliente</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden md:table-cell">Email</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden lg:table-cell">Telefono</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden xl:table-cell">Città</th>
						<th class="text-left p-4 text-[#71767b] font-medium hidden xl:table-cell">Registrazione</th>
						<th class="text-right p-4 text-[#71767b] font-medium">Azioni</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredCustomers as customer, i (customer.ID_Cliente)}
						<tr class="border-b border-[#2f3336] hover:bg-[#1d1f23] transition-colors animate-slideIn opacity-0" style="animation-delay: {0.2 + i * 0.03}s">
							<td class="p-4">
								<div class="flex items-center gap-3">
									<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#1d9bf0] to-[#794bc4] flex items-center justify-center text-white font-bold">
										{getInitials(customer.Nome, customer.Cognome)}
									</div>
									<div>
										<div class="font-medium text-white">{customer.Nome || ''} {customer.Cognome || ''}</div>
										<div class="text-sm text-[#71767b] md:hidden">{customer.Email_Cli || '-'}</div>
									</div>
								</div>
							</td>
							<td class="p-4 hidden md:table-cell">
								<div class="flex items-center gap-2 text-[#71767b]">
									<Mail size={16} />
									<span>{customer.Email_Cli || '-'}</span>
								</div>
							</td>
							<td class="p-4 hidden lg:table-cell">
								<div class="flex items-center gap-2 text-[#71767b]">
									<Phone size={16} />
									<span>{customer.Telefono_Cli || '-'}</span>
								</div>
							</td>
							<td class="p-4 hidden xl:table-cell">
								<div class="flex items-center gap-2 text-[#71767b]">
									<MapPin size={16} />
									<span>{customer.Citta_Cli || '-'}</span>
								</div>
							</td>
							<td class="p-4 text-[#71767b] hidden xl:table-cell">
								{customer.DataRegistrazione ? new Date(customer.DataRegistrazione).toLocaleDateString('it-IT') : '-'}
							</td>
							<td class="p-4">
								<div class="flex items-center justify-end gap-2">
									<button 
										onclick={() => openEdit(customer)}
										class="p-2 rounded-full hover:bg-[#1d9bf0]/20 text-[#71767b] hover:text-[#1d9bf0] transition-all"
									>
										<Pencil size={18} />
									</button>
									<button 
										onclick={() => deleteConfirm = customer.ID_Cliente}
										class="p-2 rounded-full hover:bg-[#f4212e]/20 text-[#71767b] hover:text-[#f4212e] transition-all"
									>
										<Trash2 size={18} />
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="p-12 text-center text-[#71767b]">
								<User size={48} class="mx-auto mb-4 opacity-50" />
								<p>Nessun cliente trovato</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>

<!-- Delete Confirmation Modal -->
{#if deleteConfirm}
	<div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn p-4">
		<div class="bg-[#16181c] border border-[#2f3336] rounded-2xl p-6 w-full max-w-md animate-scaleIn">
			<h3 class="text-xl font-bold text-white mb-4">Conferma Eliminazione</h3>
			<p class="text-[#71767b] mb-6">Sei sicuro di voler eliminare questo cliente? L'azione non può essere annullata.</p>
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
					{editingCustomer ? 'Modifica Cliente' : 'Nuovo Cliente'}
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
				action={editingCustomer ? '?/update' : '?/create'}
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
				{#if editingCustomer}
					<input type="hidden" name="id" value={editingCustomer.ID_Cliente} />
				{/if}

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Nome</label>
						<input 
							type="text" 
							name="nome"
							value={editingCustomer?.Nome || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="Nome"
						/>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Cognome</label>
						<input 
							type="text" 
							name="cognome"
							value={editingCustomer?.Cognome || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="Cognome"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Email</label>
					<input 
						type="email" 
						name="email"
						value={editingCustomer?.Email_Cli || ''}
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="email@esempio.com"
					/>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Telefono</label>
					<input 
						type="tel" 
						name="telefono"
						value={editingCustomer?.Telefono_Cli || ''}
						class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
						placeholder="+39 123 456 7890"
					/>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Codice Fiscale</label>
						<input 
							type="text" 
							name="codiceFiscale"
							value={editingCustomer?.CodiceFiscale_Cli || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors uppercase"
							placeholder="RSSMRA80A01H501Z"
						/>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Partita IVA</label>
						<input 
							type="text" 
							name="partitaIva"
							value={editingCustomer?.PartitaIVA_Cli || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="01234567890"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm text-[#71767b] mb-2">Indirizzo</label>
					<input 
						type="text" 
						name="indirizzo"
						value={editingCustomer?.Indirizzo_Cli || ''}
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
							value={editingCustomer?.Citta_Cli || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="Milano"
						/>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">CAP</label>
						<input 
							type="text" 
							name="cap"
							value={editingCustomer?.CAP_Cli || ''}
							class="w-full px-4 py-3 bg-[#000000] border border-[#2f3336] rounded-xl text-white focus:border-[#1d9bf0] focus:outline-none transition-colors"
							placeholder="20100"
						/>
					</div>
					<div>
						<label class="block text-sm text-[#71767b] mb-2">Provincia</label>
						<input 
							type="text" 
							name="provincia"
							value={editingCustomer?.Provincia_Cli || ''}
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
						{editingCustomer ? 'Salva' : 'Crea'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
