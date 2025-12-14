import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = db.prepare(`
		SELECT p.*, c.NomeCategoria, f.RagioneSociale
		FROM prodotti p
		LEFT JOIN categorieprodotto c ON p.ID_Categoria = c.ID_Categoria
		LEFT JOIN fornitori f ON p.ID_FornitorePreferenziale = f.ID_Fornitore
		ORDER BY p.NomeProdotto
	`).all();

	const categories = db.prepare('SELECT * FROM categorieprodotto ORDER BY NomeCategoria').all();
	const suppliers = db.prepare('SELECT * FROM fornitori ORDER BY RagioneSociale').all();

	return { products, categories, suppliers };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const codiceBarre = data.get('codiceBarre') as string;
		const nomeProdotto = data.get('nomeProdotto') as string;
		const descrizione = data.get('descrizione') as string;
		const idCategoria = data.get('idCategoria') as string;
		const idFornitore = data.get('idFornitore') as string;
		const prezzo = data.get('prezzo') as string;
		const iva = data.get('iva') as string;

		if (!nomeProdotto) {
			return fail(400, { error: 'Nome prodotto obbligatorio' });
		}

		try {
			db.prepare(`
				INSERT INTO prodotti (CodiceBarre, NomeProdotto, Descrizione, ID_Categoria, ID_FornitorePreferenziale, PrezzoUnitarioVendita, AliquotaIVA)
				VALUES (?, ?, ?, ?, ?, ?, ?)
			`).run(
				codiceBarre || null,
				nomeProdotto,
				descrizione || null,
				idCategoria ? parseInt(idCategoria) : null,
				idFornitore ? parseInt(idFornitore) : null,
				prezzo ? parseFloat(prezzo) : null,
				iva ? parseFloat(iva) : 0.22
			);
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const codiceBarre = data.get('codiceBarre') as string;
		const nomeProdotto = data.get('nomeProdotto') as string;
		const descrizione = data.get('descrizione') as string;
		const idCategoria = data.get('idCategoria') as string;
		const idFornitore = data.get('idFornitore') as string;
		const prezzo = data.get('prezzo') as string;
		const iva = data.get('iva') as string;

		if (!id || !nomeProdotto) {
			return fail(400, { error: 'Dati mancanti' });
		}

		try {
			db.prepare(`
				UPDATE prodotti 
				SET CodiceBarre = ?, NomeProdotto = ?, Descrizione = ?, ID_Categoria = ?, ID_FornitorePreferenziale = ?, PrezzoUnitarioVendita = ?, AliquotaIVA = ?
				WHERE ID_Prodotto = ?
			`).run(
				codiceBarre || null,
				nomeProdotto,
				descrizione || null,
				idCategoria ? parseInt(idCategoria) : null,
				idFornitore ? parseInt(idFornitore) : null,
				prezzo ? parseFloat(prezzo) : null,
				iva ? parseFloat(iva) : 0.22,
				parseInt(id)
			);
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
			db.prepare('DELETE FROM prodotti WHERE ID_Prodotto = ?').run(parseInt(id));
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
	}
};
