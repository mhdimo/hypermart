import { db } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const promotions = db.prepare('SELECT * FROM promozioni ORDER BY DataFine DESC').all();
	return { promotions };
};

export const actions: Actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const nomePromozione = data.get('nomePromozione') as string;
		const descrizione = data.get('descrizione') as string;
		const dataInizio = data.get('dataInizio') as string;
		const dataFine = data.get('dataFine') as string;
		const tipoSconto = data.get('tipoSconto') as string;
		const valoreSconto = data.get('valoreSconto') as string;

		if (!nomePromozione) {
			return fail(400, { error: 'Nome promozione obbligatorio' });
		}

		try {
			db.prepare(`
				INSERT INTO promozioni (NomePromozione, Descrizione, DataInizio, DataFine, TipoSconto, ValoreSconto)
				VALUES (?, ?, ?, ?, ?, ?)
			`).run(
				nomePromozione,
				descrizione || null,
				dataInizio || null,
				dataFine || null,
				tipoSconto || 'Percentuale',
				valoreSconto ? parseFloat(valoreSconto) : null
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
			db.prepare('DELETE FROM promozioni WHERE ID_Promozione = ?').run(parseInt(id));
			return { success: true };
		} catch (e: any) {
			return fail(400, { error: e.message });
		}
	}
};
