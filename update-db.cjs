// Comprehensive HyperMart Database Update
// Adds more products, employees, clients, and realistic sales data
const Database = require('better-sqlite3');
const db = new Database('hypermart.db');

console.log('🛒 HyperMart Database Comprehensive Update\n');
console.log('='.repeat(50));

// ==========================================
// 1. ADD MORE FAMOUS BRAND PRODUCTS
// ==========================================
console.log('\n📦 Adding famous brand products...');

const brandProducts = [
	// Bevande (ID 5)
	['8000070018624', 'Coca-Cola Original 1.5L', 'Bevanda gassata Coca-Cola', 5, null, 2.29, 0.22],
	['8002270014505', 'Acqua Ferrarelle 1.5L', 'Acqua minerale effervescente naturale', 5, null, 0.79, 0.10],
	['8001120001000', 'San Pellegrino 1L', 'Acqua minerale frizzante', 5, null, 0.99, 0.10],
	['8000500310427', 'Fanta Aranciata 1.5L', 'Bevanda gassata all\'arancia', 5, null, 2.19, 0.22],
	['8002270012839', 'Levissima 2L', 'Acqua minerale naturale', 5, null, 0.69, 0.10],
	['8000500037324', 'Sprite 1.5L', 'Bevanda gassata al limone', 5, null, 2.19, 0.22],
	['8033389090012', 'Red Bull 250ml', 'Energy drink', 5, null, 1.99, 0.22],
	['5000112628555', 'Schweppes Tonica 1L', 'Acqua tonica', 5, null, 1.89, 0.22],

	// Pasta (ID 6)
	['8076800105735', 'Barilla Spaghetti n.5 500g', 'Pasta di semola di grano duro', 6, null, 1.39, 0.04],
	['8076809513388', 'Barilla Penne Rigate 500g', 'Pasta corta di semola', 6, null, 1.39, 0.04],
	['8000270003345', 'De Cecco Rigatoni 500g', 'Pasta trafilata al bronzo', 6, null, 1.89, 0.04],
	['8024586030019', 'Rummo Linguine 500g', 'Pasta lenta lavorazione', 6, null, 2.29, 0.04],
	['8000270003314', 'De Cecco Fusilli 500g', 'Pasta trafilata al bronzo', 6, null, 1.89, 0.04],
	['8076809545341', 'Barilla Farfalle 500g', 'Pasta a forma di farfalle', 6, null, 1.49, 0.04],
	['8076808310124', 'Mulino Bianco Tagliatelle 500g', 'Pasta all\'uovo', 6, null, 2.49, 0.04],

	// Latticini (ID 7)
	['8003040007258', 'Granarolo Latte Intero 1L', 'Latte fresco intero', 7, null, 1.79, 0.04],
	['8002330043025', 'Parmalat Latte Parzialmente Scremato 1L', 'Latte UHT', 7, null, 1.49, 0.04],
	['8000430001679', 'Philadelphia Original 175g', 'Formaggio spalmabile', 7, null, 2.99, 0.10],
	['3073781069327', 'Activia Naturale 4x125g', 'Yogurt probiotico', 7, null, 2.89, 0.04],
	['8013355999532', 'Müller Yogurt Cremoso Fragola 125g', 'Yogurt alla frutta', 7, null, 0.79, 0.04],
	['8000430001587', 'Santa Lucia Burrata 125g', 'Burrata fresca', 7, null, 3.99, 0.04],
	['8000430200011', 'Galbani Galbanino 270g', 'Formaggio dolce', 7, null, 3.49, 0.10],

	// Surgelati (ID 8)
	['8000090029050', 'Findus 4 Salti in Padella Classico 550g', 'Piatto pronto surgelato', 8, null, 4.99, 0.10],
	['8000090026233', 'Findus Capitan Findus Bastoncini 450g', 'Bastoncini di pesce', 8, null, 5.29, 0.10],
	['8002910043407', 'Buitoni Bella Napoli Margherita', 'Pizza surgelata', 8, null, 4.49, 0.10],
	['8000090023164', 'Findus Piselli Primavera 750g', 'Piselli surgelati', 8, null, 2.79, 0.04],
	['8000090031016', 'Findus Spinaci 450g', 'Spinaci surgelati', 8, null, 2.49, 0.04],
	['8000430100259', 'Algida Cornetto Classico 4pz', 'Gelato in cono', 8, null, 3.99, 0.10],
	['8000430100495', 'Magnum Classic 4pz', 'Gelato stecco', 8, null, 4.99, 0.10],

	// Cura Persona (ID 11)
	['8004395140862', 'Dove Deodorante Spray 150ml', 'Deodorante antitraspirante', 11, null, 3.49, 0.22],
	['8002340008019', 'Pantene Shampoo Lisci Effetto Seta 225ml', 'Shampoo per capelli', 11, null, 4.29, 0.22],
	['3014260212032', 'Gillette Fusion5 Lamette 4pz', 'Ricambi rasoio', 11, null, 18.99, 0.22],
	['8001090024428', 'Oral-B Dentifricio Pro-Expert 75ml', 'Dentifricio', 11, null, 3.29, 0.22],
	['8712561526203', 'Axe Deodorante Africa 150ml', 'Deodorante uomo', 11, null, 3.99, 0.22],
	['3600523458295', "L'Oreal Men Expert Crema 50ml", 'Crema viso uomo', 11, null, 7.99, 0.22],
	['8000840053887', 'Infasil Bagnoschiuma 500ml', 'Detergente corpo', 11, null, 2.99, 0.22],

	// Casa e Pulizia (ID 12)
	['8001120000102', 'Dash Pods 3in1 15pz', 'Detersivo lavatrice', 12, null, 6.99, 0.22],
	['8001480703285', 'Swiffer Wet Panni Umidi 20pz', 'Panni per pavimenti', 12, null, 5.49, 0.22],
	['5000204851755', 'Fairy Original 900ml', 'Detersivo piatti', 12, null, 2.99, 0.22],
	['8004395210459', 'Coccolino Ammorbidente 1.5L', 'Ammorbidente bucato', 12, null, 3.99, 0.22],
	['8001480702585', 'Mastro Lindo Multiuso 500ml', 'Sgrassatore spray', 12, null, 2.79, 0.22],
	['8002340012085', 'Scottex Carta Igienica 12 rotoli', 'Carta igienica', 12, null, 6.49, 0.22],
	['5000408970012', 'Cillit Bang Anticalcare 750ml', 'Detergente bagno', 12, null, 3.99, 0.22],

	// Snack e Dolci (ID 13)
	['8076809512879', 'Mulino Bianco Pan di Stelle 350g', 'Biscotti al cioccolato', 13, null, 2.99, 0.10],
	['8076809570459', 'Mulino Bianco Tarallucci 400g', 'Biscotti classici', 13, null, 2.49, 0.10],
	['8000500032053', 'Nutella 450g', 'Crema spalmabile nocciole', 13, null, 4.49, 0.10],
	['4008400401829', 'Kinder Bueno 3x43g', 'Snack cioccolato', 13, null, 2.99, 0.10],
	['8000500234327', 'Ferrero Rocher 16pz', 'Cioccolatini', 13, null, 6.99, 0.10],
	['7622210100139', 'Oro Saiwa 250g', 'Biscotti da thè', 13, null, 1.79, 0.10],
	['8076809574587', 'Ringo Vaniglia 330g', 'Biscotti farciti', 13, null, 2.29, 0.10],
	['5000159448796', 'Pringles Original 165g', 'Patatine', 13, null, 2.99, 0.22],
	['8013355011821', 'Fonzies 100g', 'Snack al formaggio', 13, null, 1.99, 0.22],

	// Conserve (ID 15)
	['8001060006082', 'Mutti Polpa Pomodoro 400g', 'Polpa di pomodoro', 15, null, 1.29, 0.04],
	['8001110211224', 'Cirio Passata Verace 700g', 'Passata di pomodoro', 15, null, 1.49, 0.04],
	['8001060002015', 'Mutti Pelati 400g', 'Pomodori pelati', 15, null, 1.39, 0.04],
	['8001060001124', 'Rio Mare Tonno all\'Olio 80g x3', 'Tonno in scatola', 15, null, 4.99, 0.04],
	['8000400129013', 'Star Dado Classico 10 cubi', 'Dado per brodo', 15, null, 1.49, 0.04],
	['8001060001834', 'Valfrutta Mais 326g', 'Mais in scatola', 15, null, 1.29, 0.04],
	['8001060001865', 'Valfrutta Piselli 400g', 'Piselli in scatola', 15, null, 1.19, 0.04],

	// Condimenti (ID 16)
	['8002580006000', 'Monini Classico Olio EVO 1L', 'Olio extravergine oliva', 16, null, 8.99, 0.04],
	['8000900300011', 'Carapelli Olio EVO 1L', 'Olio extravergine oliva', 16, null, 7.49, 0.04],
	['8001250124173', 'De Nigris Aceto Balsamico 250ml', 'Aceto balsamico di Modena', 16, null, 3.99, 0.10],
	['8076809529754', 'Barilla Pesto Genovese 190g', 'Pesto alla genovese', 16, null, 2.99, 0.10],
	['8000050011508', 'Star GranRagù 180gx2', 'Ragù pronto', 16, null, 3.49, 0.10],
	['8004350039842', 'Saclà Olive Verdi 290g', 'Olive in salamoia', 16, null, 2.49, 0.10],
	['8000186001001', 'Zucchi Olio di Semi 1L', 'Olio di semi vari', 16, null, 2.99, 0.04],

	// Pet Food (ID 17)
	['4008429001290', 'Whiskas Bocconcini 12x100g', 'Cibo umido gatti', 17, null, 5.99, 0.22],
	['7613033805455', 'Purina Felix 12x100g', 'Cibo umido gatti', 17, null, 6.49, 0.22],
	['5900951262364', 'Cesar Vaschette 6x150g', 'Cibo umido cani', 17, null, 6.99, 0.22],
	['7613035766617', 'Friskies Crocchette Gatto 2kg', 'Cibo secco gatti', 17, null, 7.99, 0.22],
	['7613287424464', 'Purina ONE Cane 1.5kg', 'Cibo secco cani', 17, null, 9.99, 0.22],

	// Bio e Salute (ID 18)
	['8003170052000', 'Valsoia Latte di Soia 1L', 'Bevanda vegetale', 18, null, 2.29, 0.04],
	['8001880100012', 'Alce Nero Passata Bio 700g', 'Passata pomodoro biologica', 18, null, 2.49, 0.04],
	['8003170054127', 'Valsoia Gelato Soia 500ml', 'Gelato vegetale', 18, null, 4.49, 0.10],
	['8001120081012', 'Misura Fette Biscottate Integrali', 'Fette biscottate senza zucchero', 18, null, 2.99, 0.04],
	['8008698000014', 'Riso Scotti Bio 1kg', 'Riso biologico', 18, null, 3.99, 0.04],
];

const insertProduct = db.prepare(`
	INSERT OR IGNORE INTO prodotti (CodiceBarre, NomeProdotto, Descrizione, ID_Categoria, ID_FornitorePreferenziale, PrezzoUnitarioVendita, AliquotaIVA)
	VALUES (?, ?, ?, ?, ?, ?, ?)
`);

let productsAdded = 0;
for (const p of brandProducts) {
	try {
		const result = insertProduct.run(...p);
		if (result.changes > 0) productsAdded++;
	} catch (e) {}
}
console.log(`   Added ${productsAdded} brand products`);

// ==========================================
// 2. ADD MORE EMPLOYEES
// ==========================================
console.log('\n👥 Adding more employees...');

const employees = [
	// Store 1 - Milano Centro (more staff for bigger store)
	['lrossi', 'Luca', 'Rossi', 'Responsabile', 1, 1],
	['mferrari', 'Marco', 'Ferrari', 'Vice Responsabile', 1, 1],
	['abianchi', 'Anna', 'Bianchi', 'Cassiere', 1, 1],
	['gverdi', 'Giulia', 'Verdi', 'Cassiere', 1, 1],
	['pneri', 'Paolo', 'Neri', 'Cassiere', 1, 1],
	['fesposito', 'Francesca', 'Esposito', 'Magazziniere', 1, 1],
	['arusso', 'Alessandro', 'Russo', 'Magazziniere', 1, 1],
	['mcolombo', 'Martina', 'Colombo', 'Addetto Reparto', 1, 1],
	['dricci', 'Davide', 'Ricci', 'Addetto Reparto', 1, 1],
	['emoretti', 'Elena', 'Moretti', 'Cassiere', 1, 1],
	
	// Store 2 - Roma EUR
	['gconti', 'Giovanni', 'Conti', 'Responsabile', 2, 1],
	['sromano', 'Sara', 'Romano', 'Vice Responsabile', 2, 1],
	['mmarini', 'Matteo', 'Marini', 'Cassiere', 2, 1],
	['cgreco', 'Chiara', 'Greco', 'Cassiere', 2, 1],
	['lfontana', 'Lorenzo', 'Fontana', 'Cassiere', 2, 1],
	['vsantoro', 'Valentina', 'Santoro', 'Magazziniere', 2, 1],
	['npalumbo', 'Nicola', 'Palumbo', 'Addetto Reparto', 2, 1],
	['agiordano', 'Alessia', 'Giordano', 'Addetto Reparto', 2, 1],
	
	// Store 3 - Torino Lingotto
	['rmazzoni', 'Roberto', 'Mazzoni', 'Responsabile', 3, 1],
	['lcosta', 'Laura', 'Costa', 'Vice Responsabile', 3, 1],
	['fbarbieri', 'Federico', 'Barbieri', 'Cassiere', 3, 1],
	['aserra', 'Aurora', 'Serra', 'Cassiere', 3, 1],
	['tmarco', 'Tommaso', 'Marco', 'Cassiere', 3, 1],
	['egalli', 'Elisa', 'Galli', 'Magazziniere', 3, 1],
	['dpellegrini', 'Diego', 'Pellegrini', 'Addetto Reparto', 3, 1],
	
	// Store 4 - Napoli Vomero
	['rsorrento', 'Raffaele', 'Sorrento', 'Responsabile', 4, 1],
	['mimperatore', 'Maria', 'Imperatore', 'Vice Responsabile', 4, 1],
	['anapoli', 'Antonio', 'Napoli', 'Cassiere', 4, 1],
	['cpetrone', 'Carla', 'Petrone', 'Cassiere', 4, 1],
	['sdesantis', 'Salvatore', 'De Santis', 'Cassiere', 4, 1],
	['rcaruso', 'Rosa', 'Caruso', 'Magazziniere', 4, 1],
	['gcoppola', 'Giuseppe', 'Coppola', 'Addetto Reparto', 4, 1],
];

const insertEmployee = db.prepare(`
	INSERT OR IGNORE INTO operatori (Username, Nome, Cognome, Ruolo, ID_PuntoVendita, Attivo)
	VALUES (?, ?, ?, ?, ?, ?)
`);

let employeesAdded = 0;
for (const e of employees) {
	try {
		const result = insertEmployee.run(...e);
		if (result.changes > 0) employeesAdded++;
	} catch (err) {}
}
console.log(`   Added ${employeesAdded} employees`);

// ==========================================
// 3. ADD MORE CLIENTS
// ==========================================
console.log('\n👤 Adding more clients...');

const italianNames = [
	['Marco', 'Bianchi', 'BNCMRC85M15F205X', null, 'Via Roma 15', 'Milano', '20100', 'MI', 'marco.bianchi@email.it', '3331234567'],
	['Giulia', 'Rossi', 'RSSGLU90A41H501Y', null, 'Via Veneto 22', 'Roma', '00187', 'RM', 'giulia.rossi@gmail.com', '3287654321'],
	['Alessandro', 'Ferrara', 'FRRLSN88T12L219X', null, 'Corso Torino 45', 'Torino', '10100', 'TO', 'a.ferrara@libero.it', '3409876543'],
	['Francesca', 'Esposito', 'SPSFNC92D55F839Z', null, 'Via Toledo 78', 'Napoli', '80100', 'NA', 'francesca.esposito@yahoo.it', '3291234567'],
	['Luca', 'Colombo', 'CLMLCU82H15F205A', null, 'Via Manzoni 33', 'Milano', '20121', 'MI', 'luca.colombo@hotmail.it', '3665432198'],
	['Sara', 'Romano', 'RMNSRA91L45H501B', null, 'Via Appia 156', 'Roma', '00179', 'RM', 'sara.romano@gmail.com', '3398765432'],
	['Matteo', 'Conti', 'CNTMTT87C22L219C', null, 'Via Po 89', 'Torino', '10124', 'TO', 'matteo.conti@email.it', '3478901234'],
	['Chiara', 'Greco', 'GRCCHR93B60F839D', null, 'Via Chiaia 45', 'Napoli', '80121', 'NA', 'chiara.greco@libero.it', '3201234567'],
	['Andrea', 'Marino', 'MRNNDR84S10F205E', null, 'Corso Buenos Aires 120', 'Milano', '20124', 'MI', 'andrea.marino@gmail.com', '3356789012'],
	['Valentina', 'Ricci', 'RCCVNT89M65H501F', null, 'Via Nazionale 67', 'Roma', '00184', 'RM', 'v.ricci@yahoo.it', '3476543210'],
	['Federico', 'Costa', 'CSTFRC86A01L219G', null, 'Corso Vittorio 23', 'Torino', '10121', 'TO', 'f.costa@hotmail.it', '3289012345'],
	['Eleonora', 'Serra', 'SRRLNR94H50F839H', null, 'Via Posillipo 112', 'Napoli', '80123', 'NA', 'eleonora.serra@gmail.com', '3467890123'],
	['Davide', 'Fontana', 'FNTDVD83E18F205I', null, 'Via Montenapoleone 8', 'Milano', '20121', 'MI', 'davide.fontana@email.it', '3398765432'],
	['Laura', 'Galli', 'GLLLRA90P42H501L', null, 'Via Condotti 34', 'Roma', '00187', 'RM', 'laura.galli@libero.it', '3201234567'],
	['Simone', 'Barbieri', 'BRBSMN85D12L219M', null, 'Corso Francia 67', 'Torino', '10138', 'TO', 'simone.barbieri@gmail.com', '3332345678'],
	['Alice', 'Pellegrini', 'PLLLCA92T55F839N', null, 'Via Mergellina 78', 'Napoli', '80122', 'NA', 'alice.p@yahoo.it', '3445678901'],
	['Roberto', 'Marchetti', 'MRCRBT81M25F205O', null, 'Via Torino 156', 'Milano', '20123', 'MI', 'r.marchetti@hotmail.it', '3556789012'],
	['Silvia', 'Santoro', 'SNTSLV88A66H501P', null, 'Via Cavour 89', 'Roma', '00184', 'RM', 'silvia.santoro@email.it', '3667890123'],
	['Nicola', 'Vitale', 'VTLNCL84L15L219Q', null, 'Via Garibaldi 45', 'Torino', '10122', 'TO', 'nicola.vitale@gmail.com', '3778901234'],
	['Martina', 'Caruso', 'CRSMTN91H40F839R', null, 'Corso Umberto 234', 'Napoli', '80138', 'NA', 'm.caruso@libero.it', '3889012345'],
	['Giorgio', 'Fabbri', 'FBBRGG82T18F205S', null, 'Via Dante 12', 'Milano', '20121', 'MI', 'g.fabbri@yahoo.it', '3990123456'],
	['Elisa', 'Rinaldi', 'RNLLSE89D58H501T', null, 'Via del Corso 145', 'Roma', '00186', 'RM', 'elisa.rinaldi@hotmail.it', '3401234567'],
	['Tommaso', 'Orlando', 'RLNTMS87H22L219U', null, 'Via Roma 78', 'Torino', '10123', 'TO', 't.orlando@gmail.com', '3512345678'],
	['Beatrice', 'De Luca', 'DLCBRC93L55F839V', null, 'Via dei Mille 56', 'Napoli', '80121', 'NA', 'beatrice.deluca@email.it', '3623456789'],
	['Pietro', 'Moretti', 'MRTPTR85A12F205W', null, 'Corso Garibaldi 234', 'Milano', '20121', 'MI', 'pietro.moretti@libero.it', '3734567890'],
	['Giorgia', 'Giordano', 'GRDGRG90P45H501X', null, 'Via Tritone 67', 'Roma', '00187', 'RM', 'giorgia.g@yahoo.it', '3845678901'],
	['Emanuele', 'Leone', 'LNEENL86M18L219Y', null, 'Corso Matteotti 89', 'Torino', '10121', 'TO', 'e.leone@hotmail.it', '3956789012'],
	['Camilla', 'Ferraro', 'FRRCML94R50F839Z', null, 'Via Partenope 23', 'Napoli', '80121', 'NA', 'camilla.ferraro@gmail.com', '3467890123'],
	['Riccardo', 'Mancini', 'MNCRCR83E15F205A', null, 'Via della Spiga 5', 'Milano', '20121', 'MI', 'riccardo.m@email.it', '3578901234'],
	['Aurora', 'Lombardi', 'LMBRRA91M42H501B', null, 'Via Veneto 178', 'Roma', '00187', 'RM', 'aurora.lombardi@libero.it', '3189012345'],
];

const insertClient = db.prepare(`
	INSERT OR IGNORE INTO clienti (Nome, Cognome, CodiceFiscale_Cli, PartitaIVA_Cli, Indirizzo_Cli, Citta_Cli, CAP_Cli, Provincia_Cli, Email_Cli, Telefono_Cli, DataRegistrazione)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || (abs(random()) % 365) || ' days'))
`);

let clientsAdded = 0;
for (const c of italianNames) {
	try {
		const result = insertClient.run(...c);
		if (result.changes > 0) clientsAdded++;
	} catch (err) {}
}
console.log(`   Added ${clientsAdded} clients`);

// ==========================================
// 4. ADD STOCK FOR NEW PRODUCTS
// ==========================================
console.log('\n📦 Adding stock for all products...');

const allProducts = db.prepare('SELECT ID_Prodotto, PrezzoUnitarioVendita FROM prodotti').all();
const stores = [1, 2, 3, 4];

// Check existing stock
const existingStock = db.prepare('SELECT DISTINCT ID_Prodotto, ID_PuntoVendita FROM lottiprodotto_stock').all();
const stockSet = new Set(existingStock.map(s => `${s.ID_Prodotto}-${s.ID_PuntoVendita}`));

const insertStock = db.prepare(`
	INSERT INTO lottiprodotto_stock (ID_Prodotto, ID_PuntoVendita, DataCarico, DataScadenza, QuantitaIniziale, QuantitaAttuale, CostoAcquistoUnitario)
	VALUES (?, ?, ?, ?, ?, ?, ?)
`);

let stockAdded = 0;
for (const product of allProducts) {
	for (const store of stores) {
		const key = `${product.ID_Prodotto}-${store}`;
		if (!stockSet.has(key)) {
			const daysAgo = Math.floor(Math.random() * 14) + 1;
			const dataCarico = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			const scadenzaGiorni = 30 + Math.floor(Math.random() * 180);
			const dataScadenza = new Date(Date.now() + scadenzaGiorni * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
			const qtyIniziale = 80 + Math.floor(Math.random() * 150);
			const qtyAttuale = Math.floor(qtyIniziale * (0.4 + Math.random() * 0.5));
			const costo = (product.PrezzoUnitarioVendita * (0.5 + Math.random() * 0.3)).toFixed(2);
			
			try {
				insertStock.run(product.ID_Prodotto, store, dataCarico, dataScadenza, qtyIniziale, qtyAttuale, costo);
				stockAdded++;
			} catch (e) {}
		}
	}
}
console.log(`   Added ${stockAdded} stock entries`);

// ==========================================
// 5. CLEAR AND REGENERATE SALES
// ==========================================
console.log('\n🧹 Clearing old sales data...');
db.exec('DELETE FROM vendite_dettaglio');
db.exec('DELETE FROM vendite_testata');
db.exec("DELETE FROM sqlite_sequence WHERE name='vendite_testata'");
db.exec("DELETE FROM sqlite_sequence WHERE name='vendite_dettaglio'");

console.log('\n💰 Generating realistic sales data...');

const allClients = db.prepare('SELECT ID_Cliente FROM clienti').all().map(c => c.ID_Cliente);
const allOperators = db.prepare('SELECT ID_Operatore, ID_PuntoVendita FROM operatori WHERE Attivo = 1').all();
const allProductsForSale = db.prepare('SELECT ID_Prodotto, PrezzoUnitarioVendita, AliquotaIVA FROM prodotti').all();
const paymentMethods = ['Contanti', 'Carta', 'Bancomat', 'Satispay', 'Apple Pay', 'Google Pay'];

// Group operators by store
const operatorsByStore = {};
for (const op of allOperators) {
	if (!operatorsByStore[op.ID_PuntoVendita]) operatorsByStore[op.ID_PuntoVendita] = [];
	operatorsByStore[op.ID_PuntoVendita].push(op.ID_Operatore);
}

const insertSaleHeader = db.prepare(`
	INSERT INTO vendite_testata (ID_PuntoVendita, ID_Cliente, ID_Operatore, DataOraVendita, NumeroScontrino, MetodoPagamento, TotaleImponibile, TotaleIVA, TotaleVendita)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertSaleDetail = db.prepare(`
	INSERT INTO vendite_dettaglio (ID_Vendita, ID_Prodotto, QuantitaVenduta, PrezzoUnitarioApplicato, AliquotaIVA, SubtotaleRiga)
	VALUES (?, ?, ?, ?, ?, ?)
`);

let totalSales = 0;
const targetSalesPerDay = { 1: 120, 2: 100, 3: 80, 4: 90 }; // Milano is busiest

// Generate 30 days of sales
for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
	const saleDate = new Date();
	saleDate.setDate(saleDate.getDate() - daysAgo);
	const dateStr = saleDate.toISOString().split('T')[0];
	
	// Weekend has more sales
	const dayOfWeek = saleDate.getDay();
	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
	const weekendMultiplier = isWeekend ? 1.4 : 1;
	
	for (const storeId of stores) {
		const dailySales = Math.floor(targetSalesPerDay[storeId] * weekendMultiplier * (0.85 + Math.random() * 0.3));
		const storeOperators = operatorsByStore[storeId] || [1];
		
		for (let s = 0; s < dailySales; s++) {
			// Realistic hour distribution (peaks at 11-13 and 17-19)
			let hour;
			const rand = Math.random();
			if (rand < 0.15) hour = 8 + Math.floor(Math.random() * 2); // 8-9 (15%)
			else if (rand < 0.40) hour = 10 + Math.floor(Math.random() * 3); // 10-12 (25%)
			else if (rand < 0.55) hour = 13 + Math.floor(Math.random() * 2); // 13-14 (15%)
			else if (rand < 0.85) hour = 15 + Math.floor(Math.random() * 4); // 15-18 (30%)
			else hour = 19 + Math.floor(Math.random() * 2); // 19-20 (15%)
			
			const minute = Math.floor(Math.random() * 60);
			const datetime = `${dateStr} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
			
			const operatorId = storeOperators[Math.floor(Math.random() * storeOperators.length)];
			// 40% of sales have customer ID, 60% anonymous
			const clientId = Math.random() < 0.4 ? allClients[Math.floor(Math.random() * allClients.length)] : null;
			const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
			const scontrinoNum = `SC${storeId}-${dateStr.replace(/-/g, '')}-${(s + 1).toString().padStart(4, '0')}`;
			
			// Generate sale items (1-8 products per sale)
			const numProducts = Math.floor(Math.random() * 8) + 1;
			const usedProducts = new Set();
			let totaleImponibile = 0;
			let totaleIVA = 0;
			const saleItems = [];
			
			for (let p = 0; p < numProducts; p++) {
				let product;
				let attempts = 0;
				do {
					product = allProductsForSale[Math.floor(Math.random() * allProductsForSale.length)];
					attempts++;
				} while (usedProducts.has(product.ID_Prodotto) && attempts < 20);
				
				if (usedProducts.has(product.ID_Prodotto)) continue;
				usedProducts.add(product.ID_Prodotto);
				
				const qty = Math.floor(Math.random() * 4) + 1;
				const subtotale = qty * product.PrezzoUnitarioVendita;
				const ivaAmount = subtotale * product.AliquotaIVA;
				
				totaleImponibile += subtotale;
				totaleIVA += ivaAmount;
				
				saleItems.push({
					prodotto: product.ID_Prodotto,
					qty,
					prezzo: product.PrezzoUnitarioVendita,
					iva: product.AliquotaIVA,
					subtotale
				});
			}
			
			const totaleVendita = totaleImponibile + totaleIVA;
			
			// Insert header
			const result = insertSaleHeader.run(storeId, clientId, operatorId, datetime, scontrinoNum, paymentMethod, totaleImponibile.toFixed(2), totaleIVA.toFixed(2), totaleVendita.toFixed(2));
			const venditaId = result.lastInsertRowid;
			
			// Insert details
			for (const item of saleItems) {
				insertSaleDetail.run(venditaId, item.prodotto, item.qty, item.prezzo, item.iva, item.subtotale);
			}
			
			totalSales++;
		}
	}
}

console.log(`   Generated ${totalSales} sales`);

// ==========================================
// 6. FINAL STATISTICS
// ==========================================
console.log('\n' + '='.repeat(50));
console.log('📊 FINAL DATABASE STATISTICS\n');

const stats = {
	categories: db.prepare('SELECT COUNT(*) as c FROM categorieprodotto').get().c,
	products: db.prepare('SELECT COUNT(*) as c FROM prodotti').get().c,
	stock: db.prepare('SELECT COUNT(*) as c FROM lottiprodotto_stock').get().c,
	clients: db.prepare('SELECT COUNT(*) as c FROM clienti').get().c,
	employees: db.prepare('SELECT COUNT(*) as c FROM operatori').get().c,
	sales: db.prepare('SELECT COUNT(*) as c FROM vendite_testata').get().c,
	saleDetails: db.prepare('SELECT COUNT(*) as c FROM vendite_dettaglio').get().c,
	stores: db.prepare('SELECT COUNT(*) as c FROM puntivendita').get().c,
};

console.log(`   🏪 Stores:      ${stats.stores}`);
console.log(`   📁 Categories:  ${stats.categories}`);
console.log(`   📦 Products:    ${stats.products}`);
console.log(`   📋 Stock lots:  ${stats.stock}`);
console.log(`   👤 Clients:     ${stats.clients}`);
console.log(`   👥 Employees:   ${stats.employees}`);
console.log(`   🧾 Sales:       ${stats.sales}`);
console.log(`   📝 Sale items:  ${stats.saleDetails}`);

const revenue = db.prepare('SELECT SUM(TotaleVendita) as total FROM vendite_testata').get().total;
console.log(`\n   💰 Total Revenue: €${revenue.toFixed(2)}`);

const salesByStore = db.prepare(`
	SELECT pv.NomePuntoVendita, COUNT(*) as sales, SUM(v.TotaleVendita) as revenue
	FROM vendite_testata v
	JOIN puntivendita pv ON v.ID_PuntoVendita = pv.ID_PuntoVendita
	GROUP BY v.ID_PuntoVendita
`).all();

console.log('\n   Sales by Store:');
for (const s of salesByStore) {
	console.log(`      ${s.NomePuntoVendita}: ${s.sales} sales, €${s.revenue.toFixed(2)}`);
}

const dateRange = db.prepare(`SELECT MIN(date(DataOraVendita)) as min, MAX(date(DataOraVendita)) as max FROM vendite_testata`).get();
console.log(`\n   📅 Sales Period: ${dateRange.min} to ${dateRange.max}`);

db.close();
console.log('\n✅ Database update complete!\n');
