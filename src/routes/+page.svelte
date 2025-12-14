<script lang="ts">
	import { ShoppingCart, Search, MapPin, Percent, Grid3x3, ChevronRight, Star, Package, Phone, Mail, Clock, Heart, Plus, Minus, Store, Sparkles, TrendingUp, Tag, ArrowRight, X } from 'lucide-svelte';

	let { data } = $props();

	let searchQuery = $state('');
	let selectedCategory = $state<number | null>(null);
	let cart = $state<{productId: number, name: string, price: number, quantity: number}[]>([]);
	let showCart = $state(false);
	let selectedStore = $derived(data.stores[0]?.ID_PuntoVendita || 1);

	const filteredProducts = $derived(() => {
		let products = data.products;
		if (selectedCategory) {
			products = products.filter((p: any) => p.ID_Categoria === selectedCategory);
		}
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			products = products.filter((p: any) => 
				p.NomeProdotto.toLowerCase().includes(query) ||
				p.NomeCategoria?.toLowerCase().includes(query)
			);
		}
		return products;
	});

	const cartTotal = $derived(
		cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
	);

	const cartCount = $derived(
		cart.reduce((sum, item) => sum + item.quantity, 0)
	);

	function addToCart(product: any) {
		const existing = cart.find(item => item.productId === product.ID_Prodotto);
		if (existing) {
			existing.quantity++;
			cart = [...cart];
		} else {
			cart = [...cart, {
				productId: product.ID_Prodotto,
				name: product.NomeProdotto,
				price: product.PrezzoUnitarioVendita,
				quantity: 1
			}];
		}
	}

	function removeFromCart(productId: number) {
		const existing = cart.find(item => item.productId === productId);
		if (existing) {
			if (existing.quantity > 1) {
				existing.quantity--;
				cart = [...cart];
			} else {
				cart = cart.filter(item => item.productId !== productId);
			}
		}
	}

	function getPromoPrice(product: any) {
		const promo = data.promotions.find((p: any) => p.ID_Prodotto === product.ID_Prodotto);
		if (promo) {
			return product.PrezzoUnitarioVendita * (1 - promo.ValoreSconto);
		}
		return null;
	}

	function hasPromo(product: any) {
		return data.promotions.some((p: any) => p.ID_Prodotto === product.ID_Prodotto);
	}

	function getPromoDiscount(product: any) {
		const promo = data.promotions.find((p: any) => p.ID_Prodotto === product.ID_Prodotto);
		return promo ? Math.round(promo.ValoreSconto * 100) : 0;
	}
</script>

<svelte:head>
	<title>HyperMart - Il tuo supermercato di fiducia</title>
</svelte:head>

<div class="min-h-screen bg-[#000000]">
	<!-- Header -->
	<header class="sticky top-0 z-50 bg-[#000000]/95 backdrop-blur-xl border-b border-[#2f3336]">
		<div class="max-w-7xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between gap-4">
				<!-- Logo -->
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d9bf0] to-[#794bc4] flex items-center justify-center">
						<Store size={24} class="text-white" />
					</div>
					<span class="text-xl font-bold text-white hidden sm:block">HyperMart</span>
				</div>

				<!-- Search -->
				<div class="flex-1 max-w-xl">
					<div class="relative">
						<Search size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-[#71767b]" />
						<input
							type="text"
							placeholder="Cerca prodotti..."
							bind:value={searchQuery}
							class="w-full pl-11 pr-4 py-3 bg-[#16181c] border border-[#2f3336] rounded-full text-white placeholder:text-[#71767b] focus:outline-none focus:border-[#1d9bf0] transition-all"
						/>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex items-center gap-3">
					<!-- Store Selector -->
					<select
						bind:value={selectedStore}
						class="hidden md:block px-4 py-2 bg-[#16181c] border border-[#2f3336] rounded-full text-sm text-white focus:outline-none focus:border-[#1d9bf0]"
					>
						{#each data.stores as store}
							<option value={store.PuntoVenditaID}>{store.NomePuntoVendita}</option>
						{/each}
					</select>

					<!-- Cart Button -->
					<button
						onclick={() => showCart = !showCart}
						class="relative p-3 rounded-full bg-[#1d9bf0] text-white hover:bg-[#1a8cd8] transition-all"
					>
						<ShoppingCart size={20} />
						{#if cartCount > 0}
							<span class="absolute -top-1 -right-1 w-5 h-5 bg-[#f4212e] rounded-full text-xs font-bold flex items-center justify-center animate-scaleIn">
								{cartCount}
							</span>
						{/if}
					</button>

					<!-- Admin Link -->
					<a
						href="/admin"
						class="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#16181c] border border-[#2f3336] rounded-full text-sm text-[#71767b] hover:text-white hover:border-[#1d9bf0] transition-all"
					>
						<span>Admin</span>
					</a>
				</div>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="relative overflow-hidden">
		<div class="absolute inset-0 bg-gradient-to-br from-[#1d9bf0]/20 via-transparent to-[#794bc4]/20"></div>
		<div class="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
			<div class="text-center animate-fadeIn">
				<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1d9bf0]/20 text-[#1d9bf0] text-sm font-medium mb-6">
					<Sparkles size={16} />
					<span>Benvenuto nel tuo supermercato</span>
				</div>
				<h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
					Qualità e <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#1d9bf0] to-[#794bc4]">Convenienza</span>
				</h1>
				<p class="text-xl text-[#71767b] max-w-2xl mx-auto mb-8">
					Scopri i migliori prodotti freschi, le offerte imperdibili e un'esperienza di shopping unica
				</p>
				<div class="flex flex-wrap justify-center gap-4">
					<a href="#products" class="inline-flex items-center gap-2 px-6 py-3 bg-[#1d9bf0] text-white font-semibold rounded-full hover:bg-[#1a8cd8] transition-all hover:scale-105">
						<Package size={20} />
						<span>Esplora Prodotti</span>
					</a>
					<a href="#promos" class="inline-flex items-center gap-2 px-6 py-3 bg-[#16181c] text-white font-semibold rounded-full border border-[#2f3336] hover:border-[#1d9bf0] transition-all">
						<Percent size={20} />
						<span>Vedi Offerte</span>
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Active Promotions -->
	{#if data.promotions.length > 0}
		<section id="promos" class="max-w-7xl mx-auto px-4 py-12">
			<div class="flex items-center justify-between mb-8 animate-fadeIn">
				<div>
					<h2 class="text-2xl font-bold text-white flex items-center gap-3">
						<div class="p-2 rounded-lg bg-[#f4212e]/20">
							<Tag size={24} class="text-[#f4212e]" />
						</div>
						Offerte Attive
					</h2>
					<p class="text-[#71767b] mt-1">Non perdere queste occasioni!</p>
				</div>
			</div>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{#each data.promotions.slice(0, 4) as promo, i}
					<div class="p-4 rounded-2xl bg-gradient-to-br from-[#f4212e]/20 to-[#794bc4]/20 border border-[#f4212e]/30 hover:border-[#f4212e]/60 transition-all animate-scaleIn opacity-0" style="animation-delay: {i * 0.1}s">
						<div class="flex items-start justify-between mb-3">
							<span class="px-3 py-1 rounded-full bg-[#f4212e] text-white text-sm font-bold">
								-{promo.PercentualeSconto}%
							</span>
							<Percent size={20} class="text-[#f4212e]" />
						</div>
						<h3 class="font-bold text-white mb-1">{promo.NomeProdotto}</h3>
						<p class="text-sm text-[#71767b]">{promo.Descrizione}</p>
					</div>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Categories -->
	<section class="max-w-7xl mx-auto px-4 py-12">
		<div class="flex items-center justify-between mb-8 animate-fadeIn">
			<div>
				<h2 class="text-2xl font-bold text-white flex items-center gap-3">
					<div class="p-2 rounded-lg bg-[#794bc4]/20">
						<Grid3x3 size={24} class="text-[#794bc4]" />
					</div>
					Categorie
				</h2>
				<p class="text-[#71767b] mt-1">Sfoglia per categoria</p>
			</div>
		</div>
		<div class="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
			<button
				onclick={() => selectedCategory = null}
				class="flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all {
					!selectedCategory
						? 'bg-[#1d9bf0] text-white'
						: 'bg-[#16181c] text-[#71767b] hover:bg-[#1d1f23] hover:text-white border border-[#2f3336]'
				}"
			>
				<Grid3x3 size={18} />
				<span>Tutte</span>
			</button>
			{#each data.categories as category, i}
				<button
					onclick={() => selectedCategory = category.ID_Categoria}
					class="flex items-center gap-2 px-5 py-3 rounded-full whitespace-nowrap transition-all animate-fadeIn opacity-0 {
						selectedCategory === category.ID_Categoria
							? 'bg-[#1d9bf0] text-white'
							: 'bg-[#16181c] text-[#71767b] hover:bg-[#1d1f23] hover:text-white border border-[#2f3336]'
					}"
					style="animation-delay: {i * 0.05}s"
				>
					
					<span>{category.NomeCategoria}</span>
					<span class="text-xs opacity-60">({category.productCount})</span>
				</button>
			{/each}
		</div>
	</section>

	<!-- Products Grid -->
	<section id="products" class="max-w-7xl mx-auto px-4 py-12">
		<div class="flex items-center justify-between mb-8 animate-fadeIn">
			<div>
				<h2 class="text-2xl font-bold text-white flex items-center gap-3">
					<div class="p-2 rounded-lg bg-[#00ba7c]/20">
						<Package size={24} class="text-[#00ba7c]" />
					</div>
					{selectedCategory ? data.categories.find((c: any) => c.ID_Categoria === selectedCategory)?.NomeCategoria : 'Tutti i Prodotti'}
				</h2>
				<p class="text-[#71767b] mt-1">{filteredProducts().length} prodotti disponibili</p>
			</div>
		</div>

		{#if filteredProducts().length === 0}
			<div class="text-center py-16 animate-fadeIn">
				<Package size={48} class="text-[#71767b] mx-auto mb-4" />
				<h3 class="text-xl font-bold text-white mb-2">Nessun prodotto trovato</h3>
				<p class="text-[#71767b]">Prova a modificare i filtri di ricerca</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{#each filteredProducts() as product, i}
					{@const promoPrice = getPromoPrice(product)}
					<div class="group bg-[#16181c] border border-[#2f3336] rounded-2xl overflow-hidden hover:border-[#1d9bf0]/50 transition-all hover:-translate-y-1 animate-scaleIn opacity-0" style="animation-delay: {Math.min(i * 0.05, 0.5)}s">
						<!-- Product Image Placeholder -->
						<div class="relative h-48 bg-gradient-to-br from-[#1d1f23] to-[#16181c] flex items-center justify-center">
							<Package size={64} class="text-[#2f3336]" />
							{#if hasPromo(product)}
								<div class="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#f4212e] text-white text-sm font-bold animate-pulse">
									-{getPromoDiscount(product)}%
								</div>
							{/if}
							<button class="absolute top-3 right-3 p-2 rounded-full bg-[#000000]/50 text-[#71767b] hover:text-[#f4212e] opacity-0 group-hover:opacity-100 transition-all">
								<Heart size={18} />
							</button>
						</div>

						<!-- Product Info -->
						<div class="p-4">
							{#if product.NomeCategoria}
								<div class="flex items-center gap-2 mb-2">
									{#if product.Colore}
										<div class="w-2 h-2 rounded-full" style="background-color: {product.Colore}"></div>
									{/if}
									<span class="text-xs text-[#71767b]">{product.NomeCategoria}</span>
								</div>
							{/if}
							<h3 class="font-bold text-white mb-2 line-clamp-2">{product.NomeProdotto}</h3>
							
							<div class="flex items-center gap-2 mb-4">
								{#if promoPrice}
									<span class="text-xl font-bold text-[#f4212e]">€{promoPrice.toFixed(2)}</span>
									<span class="text-sm text-[#71767b] line-through">€{(product.PrezzoUnitarioVendita || 0).toFixed(2)}</span>
								{:else}
									<span class="text-xl font-bold text-white">€{(product.PrezzoUnitarioVendita || 0).toFixed(2)}</span>
								{/if}
								<span class="text-xs text-[#71767b]">/kg</span>
							</div>

							<div class="flex items-center justify-between">
								<span class="text-xs text-[#71767b]">
									{product.stock > 10 ? 'Disponibile' : product.stock > 0 ? `Solo ${product.stock} rimasti` : 'Esaurito'}
								</span>
								<button
									onclick={() => addToCart(product)}
									disabled={product.stock <= 0}
									class="flex items-center gap-2 px-4 py-2 bg-[#1d9bf0] text-white text-sm font-medium rounded-full hover:bg-[#1a8cd8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									<Plus size={16} />
									<span>Aggiungi</span>
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Footer -->
	<footer class="border-t border-[#2f3336] mt-16">
		<div class="max-w-7xl mx-auto px-4 py-12">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
				<div>
					<div class="flex items-center gap-3 mb-4">
						<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1d9bf0] to-[#794bc4] flex items-center justify-center">
							<Store size={24} class="text-white" />
						</div>
						<span class="text-xl font-bold text-white">HyperMart</span>
					</div>
					<p class="text-[#71767b] text-sm">
						Il tuo supermercato di fiducia per prodotti freschi e di qualità.
					</p>
				</div>

				<div>
					<h4 class="font-bold text-white mb-4">Punti Vendita</h4>
					<ul class="space-y-2">
						{#each data.stores.slice(0, 4) as store}
							<li class="text-sm text-[#71767b] hover:text-[#1d9bf0] cursor-pointer transition-colors">
								{store.NomePuntoVendita}
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<h4 class="font-bold text-white mb-4">Categorie</h4>
					<ul class="space-y-2">
						{#each data.categories.slice(0, 4) as cat}
							<li class="text-sm text-[#71767b] hover:text-[#1d9bf0] cursor-pointer transition-colors">
								{cat.NomeCategoria}
							</li>
						{/each}
					</ul>
				</div>

				<div>
					<h4 class="font-bold text-white mb-4">Contatti</h4>
					<ul class="space-y-3">
						<li class="flex items-center gap-2 text-sm text-[#71767b]">
							<Phone size={16} />
							<span>+39 02 1234567</span>
						</li>
						<li class="flex items-center gap-2 text-sm text-[#71767b]">
							<Mail size={16} />
							<span>info@hypermart.it</span>
						</li>
						<li class="flex items-center gap-2 text-sm text-[#71767b]">
							<Clock size={16} />
							<span>Lun-Sab: 8:00-21:00</span>
						</li>
					</ul>
				</div>
			</div>

			<div class="mt-12 pt-8 border-t border-[#2f3336] text-center">
				<p class="text-sm text-[#71767b]">
					© 2024 HyperMart. Tutti i diritti riservati.
				</p>
			</div>
		</div>
	</footer>
</div>

<!-- Cart Sidebar -->
{#if showCart}
	<div class="fixed inset-0 z-50 flex justify-end">
		<button
			onclick={() => showCart = false}
			class="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
			aria-label="Chiudi carrello"
		></button>
		
		<div class="relative w-full max-w-md bg-[#000000] border-l border-[#2f3336] h-full overflow-y-auto animate-slideIn">
			<div class="sticky top-0 bg-[#000000] border-b border-[#2f3336] p-4 flex items-center justify-between">
				<h2 class="text-xl font-bold text-white flex items-center gap-2">
					<ShoppingCart size={24} />
					Carrello
					{#if cartCount > 0}
						<span class="text-sm text-[#71767b]">({cartCount})</span>
					{/if}
				</h2>
				<button
					onclick={() => showCart = false}
					class="p-2 rounded-full hover:bg-[#16181c] text-[#71767b] hover:text-white transition-all"
				>
					<X size={24} />
				</button>
			</div>

			{#if cart.length === 0}
				<div class="p-8 text-center">
					<ShoppingCart size={48} class="text-[#71767b] mx-auto mb-4" />
					<h3 class="text-lg font-bold text-white mb-2">Carrello vuoto</h3>
					<p class="text-[#71767b] text-sm">Aggiungi prodotti per iniziare</p>
				</div>
			{:else}
				<div class="p-4 space-y-4">
					{#each cart as item}
						<div class="flex items-center gap-4 p-3 bg-[#16181c] rounded-xl">
							<div class="w-16 h-16 bg-[#1d1f23] rounded-lg flex items-center justify-center">
								<Package size={24} class="text-[#71767b]" />
							</div>
							<div class="flex-1">
								<h4 class="font-medium text-white text-sm">{item.name}</h4>
								<p class="text-[#1d9bf0] font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
							</div>
							<div class="flex items-center gap-2">
								<button
									onclick={() => removeFromCart(item.productId)}
									class="p-1 rounded-full hover:bg-[#1d1f23] text-[#71767b] hover:text-white transition-all"
								>
									<Minus size={16} />
								</button>
								<span class="w-8 text-center text-white font-medium">{item.quantity}</span>
								<button
									onclick={() => addToCart({ ID_Prodotto: item.productId, NomeProdotto: item.name, PrezzoUnitarioVendita: item.price })}
									class="p-1 rounded-full hover:bg-[#1d1f23] text-[#71767b] hover:text-white transition-all"
								>
									<Plus size={16} />
								</button>
							</div>
						</div>
					{/each}
				</div>

				<div class="sticky bottom-0 bg-[#000000] border-t border-[#2f3336] p-4 space-y-4">
					<div class="flex items-center justify-between">
						<span class="text-[#71767b]">Totale</span>
						<span class="text-2xl font-bold text-white">€{cartTotal.toFixed(2)}</span>
					</div>
					<button class="w-full py-4 bg-[#1d9bf0] text-white font-bold rounded-full hover:bg-[#1a8cd8] transition-all flex items-center justify-center gap-2">
						<span>Procedi al Checkout</span>
						<ArrowRight size={20} />
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
