import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const stores = db.prepare('SELECT * FROM puntivendita ORDER BY NomePuntoVendita').all();
	const operators = db.prepare(`
		SELECT o.*, pv.NomePuntoVendita 
		FROM operatori o
		LEFT JOIN puntivendita pv ON o.ID_PuntoVendita = pv.ID_PuntoVendita
		ORDER BY o.Nome
	`).all();

	return { stores, operators };
};
