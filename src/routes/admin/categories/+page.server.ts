import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const categories = db.prepare('SELECT * FROM categorieprodotto ORDER BY NomeCategoria').all();
	
	// Get product count for each category
	const categoriesWithCount = categories.map((cat: any) => {
		const count = db.prepare('SELECT COUNT(*) as count FROM prodotti WHERE ID_Categoria = ?').get(cat.ID_Categoria) as { count: number };
		return { ...cat, productCount: count.count };
	});

	return { categories: categoriesWithCount };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const nomeCategoria = data.get('nomeCategoria') as string;
		const descrizione = data.get('descrizione') as string;

		if (!nomeCategoria) {
			return fail(400, { error: 'Nome categoria obbligatorio' });
		}

		try {
			db.prepare('INSERT INTO categorieprodotto (NomeCategoria, Descrizione) VALUES (?, ?)').run(nomeCategoria, descrizione || null);
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const nomeCategoria = data.get('nomeCategoria') as string;
		const descrizione = data.get('descrizione') as string;

		if (!id || !nomeCategoria) {
			return fail(400, { error: 'Dati mancanti' });
		}

		try {
			db.prepare('UPDATE categorieprodotto SET NomeCategoria = ?, Descrizione = ? WHERE ID_Categoria = ?').run(nomeCategoria, descrizione || null, parseInt(id));
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) {
			return fail(400, { error: 'ID mancante' });
		}

		try {
			db.prepare('DELETE FROM categorieprodotto WHERE ID_Categoria = ?').run(parseInt(id));
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
	}
};
