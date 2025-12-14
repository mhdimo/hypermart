import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const customers = db.prepare('SELECT * FROM clienti ORDER BY Cognome, Nome').all();
	return { customers };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const nome = data.get('nome') as string;
		const cognome = data.get('cognome') as string;
		const email = data.get('email') as string;
		const telefono = data.get('telefono') as string;
		const codiceFiscale = data.get('codiceFiscale') as string;
		const partitaIva = data.get('partitaIva') as string;
		const indirizzo = data.get('indirizzo') as string;
		const citta = data.get('citta') as string;
		const cap = data.get('cap') as string;
		const provincia = data.get('provincia') as string;

		try {
			db.prepare(`
				INSERT INTO clienti (Nome, Cognome, Email_Cli, Telefono_Cli, CodiceFiscale_Cli, PartitaIVA_Cli, Indirizzo_Cli, Citta_Cli, CAP_Cli, Provincia_Cli)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			`).run(
				nome || null,
				cognome || null,
				email || null,
				telefono || null,
				codiceFiscale || null,
				partitaIva || null,
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
		const nome = data.get('nome') as string;
		const cognome = data.get('cognome') as string;
		const email = data.get('email') as string;
		const telefono = data.get('telefono') as string;
		const codiceFiscale = data.get('codiceFiscale') as string;
		const partitaIva = data.get('partitaIva') as string;
		const indirizzo = data.get('indirizzo') as string;
		const citta = data.get('citta') as string;
		const cap = data.get('cap') as string;
		const provincia = data.get('provincia') as string;

		if (!id) {
			return fail(400, { error: 'ID mancante' });
		}

		try {
			db.prepare(`
				UPDATE clienti 
				SET Nome = ?, Cognome = ?, Email_Cli = ?, Telefono_Cli = ?, CodiceFiscale_Cli = ?, PartitaIVA_Cli = ?, Indirizzo_Cli = ?, Citta_Cli = ?, CAP_Cli = ?, Provincia_Cli = ?
				WHERE ID_Cliente = ?
			`).run(
				nome || null,
				cognome || null,
				email || null,
				telefono || null,
				codiceFiscale || null,
				partitaIva || null,
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
			db.prepare('DELETE FROM clienti WHERE ID_Cliente = ?').run(parseInt(id));
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
	}
};
