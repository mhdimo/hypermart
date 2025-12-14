import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const suppliers = db.prepare('SELECT * FROM fornitori ORDER BY RagioneSociale').all();
	return { suppliers };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const ragioneSociale = data.get('ragioneSociale') as string;
		const partitaIva = data.get('partitaIva') as string;
		const email = data.get('email') as string;
		const telefono = data.get('telefono') as string;
		const referente = data.get('referente') as string;
		const indirizzo = data.get('indirizzo') as string;
		const citta = data.get('citta') as string;
		const cap = data.get('cap') as string;
		const provincia = data.get('provincia') as string;

		if (!ragioneSociale) {
			return fail(400, { error: 'Ragione sociale obbligatoria' });
		}

		try {
			db.prepare(`
				INSERT INTO fornitori (RagioneSociale, PartitaIVA_F, Email_F, Telefono_F, Referente_F, Indirizzo_F, Citta_F, CAP_F, Provincia_F)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`).run(
				ragioneSociale,
				partitaIva || null,
				email || null,
				telefono || null,
				referente || null,
				indirizzo || null,
				citta || null,
				cap || null,
				provincia || null
			);
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
	},

	update: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id') as string;
		const ragioneSociale = data.get('ragioneSociale') as string;
		const partitaIva = data.get('partitaIva') as string;
		const email = data.get('email') as string;
		const telefono = data.get('telefono') as string;
		const referente = data.get('referente') as string;
		const indirizzo = data.get('indirizzo') as string;
		const citta = data.get('citta') as string;
		const cap = data.get('cap') as string;
		const provincia = data.get('provincia') as string;

		if (!id || !ragioneSociale) {
			return fail(400, { error: 'Dati mancanti' });
		}

		try {
			db.prepare(`
				UPDATE fornitori 
				SET RagioneSociale = ?, PartitaIVA_F = ?, Email_F = ?, Telefono_F = ?, Referente_F = ?, Indirizzo_F = ?, Citta_F = ?, CAP_F = ?, Provincia_F = ?
				WHERE ID_Fornitore = ?
			`).run(
				ragioneSociale,
				partitaIva || null,
				email || null,
				telefono || null,
				referente || null,
				indirizzo || null,
				citta || null,
				cap || null,
				provincia || null,
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
			db.prepare('DELETE FROM fornitori WHERE ID_Fornitore = ?').run(parseInt(id));
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
	}
};
