<script lang="ts">
	import '../../app.css';
	import { page } from '$app/state';
	import { 
		Home, 
		Package, 
		Users, 
		ShoppingCart, 
		Truck, 
		BarChart3, 
		Settings, 
		Store,
		Tag,
		Layers,
		Menu,
		X as XIcon
	} from 'lucide-svelte';

	let sidebarOpen = $state(true);
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: Home },
		{ href: '/admin/products', label: 'Prodotti', icon: Package },
		{ href: '/admin/categories', label: 'Categorie', icon: Layers },
		{ href: '/admin/customers', label: 'Clienti', icon: Users },
		{ href: '/admin/suppliers', label: 'Fornitori', icon: Truck },
		{ href: '/admin/sales', label: 'Vendite', icon: ShoppingCart },
		{ href: '/admin/stock', label: 'Magazzino', icon: Store },
		{ href: '/admin/promotions', label: 'Promozioni', icon: Tag },
		{ href: '/admin/reports', label: 'Report', icon: BarChart3 },
		{ href: '/admin/settings', label: 'Impostazioni', icon: Settings },
	];

	function isActive(href: string): boolean {
		if (href === '/admin') {
			return page.url.pathname === '/admin';
		}
		return page.url.pathname.startsWith(href);
	}
</script>

<div class="flex min-h-screen bg-[#000000]">
	<!-- Mobile Menu Button -->
	<button 
		class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-[#16181c] border border-[#2f3336] text-white hover:bg-[#1d1f23] transition-all"
		onclick={() => mobileMenuOpen = !mobileMenuOpen}
	>
		{#if mobileMenuOpen}
			<XIcon size={24} />
		{:else}
			<Menu size={24} />
		{/if}
	</button>

	<!-- Sidebar -->
	<aside 
		class="fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#000000] border-r border-[#2f3336] z-40 transform transition-transform duration-300 ease-in-out {mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
	>
		<div class="flex flex-col h-full">
			<!-- Logo -->
			<div class="p-6 border-b border-[#2f3336]">
				<a href="/" class="flex items-center gap-3 group">
					<div class="w-10 h-10 rounded-full bg-[#1d9bf0] flex items-center justify-center transition-transform group-hover:scale-110">
						<span class="text-white font-bold text-xl">H</span>
					</div>
					<span class="text-xl font-bold text-white group-hover:text-[#1d9bf0] transition-colors">HyperMart</span>
				</a>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 p-4 overflow-y-auto">
				<ul class="space-y-1">
					{#each navItems as item, i}
						<li class="animate-slideIn opacity-0" style="animation-delay: {i * 0.05}s">
							<a 
								href={item.href}
								onclick={() => mobileMenuOpen = false}
								class="flex items-center gap-4 px-4 py-3 rounded-full transition-all duration-200 group {isActive(item.href) ? 'bg-[#16181c] text-white font-bold' : 'text-[#71767b] hover:bg-[#16181c] hover:text-white'}"
							>
								<item.icon 
									size={24} 
									class="transition-transform duration-200 group-hover:scale-110 {isActive(item.href) ? 'text-[#1d9bf0]' : ''}" 
								/>
								<span>{item.label}</span>
							</a>
						</li>
					{/each}
				</ul>
			</nav>

			<!-- Customer View Link -->
			<div class="p-4 border-t border-[#2f3336]">
				<a 
					href="/"
					class="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#1d9bf0] text-white font-bold rounded-full hover:bg-[#1a8cd8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
				>
					<Store size={20} />
					<span>Vista Cliente</span>
				</a>
			</div>
		</div>
	</aside>

	<!-- Mobile Overlay -->
	{#if mobileMenuOpen}
		<div 
			class="fixed inset-0 bg-black/50 z-30 lg:hidden"
			onclick={() => mobileMenuOpen = false}
		></div>
	{/if}

	<!-- Main Content -->
	<main class="flex-1 min-h-screen">
		<slot />
	</main>
</div>
