// Add more employees, promotions, and suppliers to HyperMart database
// Usage: node add-more-data.cjs [--promos N] [--low-stock N] [--clients N]
const Database = require('better-sqlite3');
const db = new Database('hypermart.db');

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (name, defaultVal) => {
	const idx = args.indexOf(`--${name}`);
	return idx !== -1 && args[idx + 1] ? parseInt(args[idx + 1]) : defaultVal;
};

const CONFIG = {
	targetPromos: getArg('promos', 50),      // Target number of new promotions to add
	targetLowStock: getArg('low-stock', 15), // Target number of low stock items
	extraClients: getArg('clients', 0),      // Extra random clients to generate
};

console.log('🛒 HyperMart - Adding More Data\n');
console.log('='.repeat(50));
console.log(`Config: promos=${CONFIG.targetPromos}, low-stock=${CONFIG.targetLowStock}, extra-clients=${CONFIG.extraClients}`);

// ==========================================
// 1. ADD MORE SUPPLIERS (Fornitori)
// ==========================================
console.log('\n📦 Adding more suppliers...');

const suppliers = [
	// Major Italian Food Distributors
	['Barilla Group', 'IT01234567890', 'Via Mantova 166', 'Parma', '43122', 'PR', 'ordini@barilla.it', '+39 0521 2621', 'Pasta, Sughi, Prodotti da Forno'],
	['Ferrero SpA', 'IT09876543210', 'Piazzale Pietro Ferrero 1', 'Alba', '12051', 'CN', 'fornitori@ferrero.com', '+39 0173 3131', 'Dolciumi, Snack'],
	['Lavazza Luigi SpA', 'IT11223344556', 'Via Bologna 32', 'Torino', '10152', 'TO', 'ordini@lavazza.it', '+39 011 23981', 'Caffe'],
	['Mutti SpA', 'IT22334455667', 'Via Traversetolo 28', 'Montechiarugolo', '43022', 'PR', 'vendite@mutti.it', '+39 0521 652511', 'Conserve Pomodoro'],
	['Granarolo SpA', 'IT33445566778', 'Via Cadriano 27/2', 'Bologna', '40127', 'BO', 'ordini@granarolo.it', '+39 051 4170311', 'Latticini'],
	['Parmalat SpA', 'IT44556677889', 'Via delle Nazioni Unite 4', 'Collecchio', '43044', 'PR', 'clienti@parmalat.it', '+39 0521 8081', 'Latte e Derivati'],
	['Coca-Cola HBC Italia', 'IT55667788990', 'Viale Monza 338', 'Sesto San Giovanni', '20099', 'MI', 'ordini@cocacola.it', '+39 02 270761', 'Bevande'],
	['San Benedetto SpA', 'IT66778899001', 'Via Brentella 18', 'Scorzè', '30037', 'VE', 'vendite@sanbenedetto.it', '+39 041 4537111', 'Acqua Minerale, The'],
	['Amadori', 'IT77889900112', 'Via Poligono 3', 'Cesena', '47521', 'FC', 'ordini@amadori.it', '+39 0547 3771', 'Carni Avicole'],
	['Aia SpA', 'IT88990011223', 'Via Valpantena 18/G', 'Verona', '37142', 'VR', 'clienti@aia.it', '+39 045 8097911', 'Carni e Salumi'],
	// Household & Personal Care
	['Henkel Italia', 'IT99001122334', 'Via Amoretti 78', 'Milano', '20157', 'MI', 'ordini@henkel.it', '+39 02 35791', 'Detergenti, Cura Persona'],
	['Procter & Gamble Italia', 'IT00112233445', 'Viale Giorgio Ribotta 11', 'Roma', '00144', 'RM', 'forniture@pg.com', '+39 06 509581', 'Cura Casa e Persona'],
	['Unilever Italia', 'IT11223344550', 'Via Paolo Di Dono 3/A', 'Roma', '00142', 'RM', 'ordini@unilever.it', '+39 06 54991', 'Alimentari, Cura Persona'],
	['Colgate-Palmolive', 'IT22334455661', 'Via Merendi 22', 'Anzola Emilia', '40011', 'BO', 'vendite@colgate.it', '+39 051 6505111', 'Igiene Orale, Cura Persona'],
	// Pet Food
	['Purina Nestle', 'IT33445566772', 'Viale Richard 1', 'Castellanza', '21053', 'VA', 'ordini@purina.it', '+39 0331 526111', 'Pet Food'],
	['Mars Italia', 'IT44556677883', 'Via Nino Bonnet 10', 'Milano', '20154', 'MI', 'forniture@mars.com', '+39 02 6229621', 'Pet Food, Dolciumi'],
	// Frozen Foods
	['Findus Italia', 'IT55667788994', 'Via Sandro Sandri 2', 'Roma', '00198', 'RM', 'ordini@findus.it', '+39 06 85381', 'Surgelati'],
	['Bofrost Italia', 'IT66778899005', 'Via Clauzetto 4', 'San Vito al Tagliamento', '33078', 'PN', 'ordini@bofrost.it', '+39 0434 849111', 'Surgelati'],
	// Beverages
	['Campari Group', 'IT77889900116', 'Via Franco Sacchetti 20', 'Sesto San Giovanni', '20099', 'MI', 'vendite@campari.com', '+39 02 62251', 'Bevande Alcoliche'],
	['Sanpellegrino', 'IT88990011227', 'Via Castelvetro 17', 'Milano', '20154', 'MI', 'ordini@sanpellegrino.it', '+39 02 31971', 'Acqua Minerale, Bibite'],
	// Organic & Health
	['Alce Nero SpA', 'IT99001122338', 'Via Palazzina 25', 'Monterenzio', '40050', 'BO', 'ordini@alcenero.it', '+39 051 929647', 'Prodotti Biologici'],
	['Valsoia SpA', 'IT00112233449', 'Via Ilio Barontini 16/5', 'Bologna', '40138', 'BO', 'vendite@valsoia.it', '+39 051 6086811', 'Prodotti Vegetali'],
	// Fresh & Meat
	['Inalca SpA', 'IT11223344560', 'Via Spilamberto 30/C', 'Castelvetro', '41014', 'MO', 'ordini@inalca.it', '+39 059 755111', 'Carni Bovine'],
	['Rovagnati', 'IT22334455671', 'Via Famagosta 75', 'Milano', '20142', 'MI', 'vendite@rovagnati.it', '+39 02 893701', 'Salumi'],
	['Galbani', 'IT33445566782', 'Via Flavio Gioia 8', 'Milano', '20149', 'MI', 'ordini@galbani.it', '+39 02 43356001', 'Formaggi'],
];

const insertSupplier = db.prepare(`
	INSERT OR IGNORE INTO fornitori (RagioneSociale, PartitaIVA_F, Indirizzo_F, Citta_F, CAP_F, Provincia_F, Email_F, Telefono_F, Referente_F)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let suppliersAdded = 0;
for (const s of suppliers) {
	try {
		const result = insertSupplier.run(...s);
		if (result.changes > 0) suppliersAdded++;
	} catch (e) {}
}
console.log(`   Added ${suppliersAdded} suppliers`);

// ==========================================
// 2. ADD MORE EMPLOYEES
// ==========================================
console.log('\n👥 Adding more employees...');

const additionalEmployees = [
	// Store 1 - Milano Centro (add more)
	['cmorandi', 'Cristina', 'Morandi', 'Cassiere', 1, 1],
	['tgalli', 'Tommaso', 'Galli', 'Cassiere', 1, 1],
	['lserra', 'Lucia', 'Serra', 'Addetto Reparto', 1, 1],
	['agentile', 'Andrea', 'Gentile', 'Magazziniere', 1, 1],
	['sbellini', 'Sofia', 'Bellini', 'Cassiere', 1, 1],
	['mgrasso', 'Marco', 'Grasso', 'Addetto Reparto', 1, 1],
	['fparisi', 'Federica', 'Parisi', 'Cassiere', 1, 1],
	['nlongo', 'Nicola', 'Longo', 'Magazziniere', 1, 1],
	
	// Store 2 - Roma EUR (add more)
	['cmartini', 'Claudia', 'Martini', 'Cassiere', 2, 1],
	['aferrari', 'Alberto', 'Ferrari', 'Cassiere', 2, 1],
	['pbianco', 'Paola', 'Bianco', 'Addetto Reparto', 2, 1],
	['smonti', 'Simone', 'Monti', 'Magazziniere', 2, 1],
	['vrosso', 'Valentino', 'Rosso', 'Cassiere', 2, 1],
	['lbruni', 'Laura', 'Bruni', 'Addetto Reparto', 2, 1],
	['mmorandi', 'Mattia', 'Morandi', 'Cassiere', 2, 1],
	
	// Store 3 - Torino Lingotto (add more)
	['gfiorentino', 'Giulio', 'Fiorentino', 'Cassiere', 3, 1],
	['amonaco', 'Alessandra', 'Monaco', 'Cassiere', 3, 1],
	['fconte', 'Francesco', 'Conte', 'Addetto Reparto', 3, 1],
	['rcardinal', 'Roberta', 'Cardinale', 'Magazziniere', 3, 1],
	['mvitali', 'Mirko', 'Vitali', 'Cassiere', 3, 1],
	['cpagano', 'Chiara', 'Pagano', 'Addetto Reparto', 3, 1],
	
	// Store 4 - Napoli Vomero (add more)
	['aesposito', 'Angelo', 'Esposito', 'Cassiere', 4, 1],
	['mromano', 'Marianna', 'Romano', 'Cassiere', 4, 1],
	['gdamico', 'Giovanni', "D'Amico", 'Addetto Reparto', 4, 1],
	['tferro', 'Teresa', 'Ferro', 'Magazziniere', 4, 1],
	['lparisi', 'Luigi', 'Parisi', 'Cassiere', 4, 1],
	['srusso', 'Serena', 'Russo', 'Addetto Reparto', 4, 1],
	['fcaputo', 'Fabio', 'Caputo', 'Cassiere', 4, 1],
];

const insertEmployee = db.prepare(`
	INSERT OR IGNORE INTO operatori (Username, Nome, Cognome, Ruolo, ID_PuntoVendita, Attivo)
	VALUES (?, ?, ?, ?, ?, ?)
`);

let employeesAdded = 0;
for (const e of additionalEmployees) {
	try {
		const result = insertEmployee.run(...e);
		if (result.changes > 0) employeesAdded++;
	} catch (err) {}
}
console.log(`   Added ${employeesAdded} employees`);

// ==========================================
// 3. ADD MORE PROMOTIONS
// ==========================================
console.log('\n🏷️  Adding more promotions...');

// Get all products for promotions
const products = db.prepare('SELECT ID_Prodotto, NomeProdotto, PrezzoUnitarioVendita FROM prodotti').all();
const today = new Date();

// Insert promotion (schema: NomePromozione, Descrizione, DataInizio, DataFine, TipoSconto, ValoreSconto, CondizioneMinima)
const insertPromo = db.prepare(`
	INSERT OR IGNORE INTO promozioni (NomePromozione, Descrizione, DataInizio, DataFine, TipoSconto, ValoreSconto, CondizioneMinima)
	VALUES (?, ?, ?, ?, ?, ?, ?)
`);

// Link promotion to product
const linkPromoProduct = db.prepare(`
	INSERT OR IGNORE INTO prodotti_promozioni (ID_Prodotto, ID_Promozione)
	VALUES (?, ?)
`);

// Create various types of promotions
const promoTypes = [
	{ type: 'Percentuale', minVal: 10, maxVal: 40 },
	{ type: 'Fisso', minVal: 1, maxVal: 5 },
	{ type: '3x2', minVal: 33, maxVal: 33 },
	{ type: 'Percentuale', minVal: 15, maxVal: 50 },
];

// Create promotions for random products
const promoNames = [
	'Offerta Natale 2025',
	'Super Risparmio',
	'Prezzo Shock',
	'Convenienza Garantita',
	'Sottocosto',
	'Offerta Speciale',
	'Promo Week',
	'Solo Per Te',
	'Best Price',
	'Sconto Famiglia',
	'Weekend Promo',
	'Flash Sale',
	'Happy Hour',
	'Saldi Invernali',
	'Black Friday',
];

let promosAdded = 0;

// Get products that already have promotions
const productsWithPromos = new Set(
	db.prepare(`SELECT DISTINCT pp.ID_Prodotto FROM prodotti_promozioni pp JOIN promozioni p ON pp.ID_Promozione = p.ID_Promozione WHERE date(p.DataFine) >= date('now')`).all().map(p => p.ID_Prodotto)
);

// Add promotions based on config
for (let i = 0; i < CONFIG.targetPromos; i++) {
	// Pick a random product that doesn't have an active promo
	let product;
	let attempts = 0;
	do {
		product = products[Math.floor(Math.random() * products.length)];
		attempts++;
	} while (productsWithPromos.has(product.ID_Prodotto) && attempts < 50);
	
	if (productsWithPromos.has(product.ID_Prodotto)) continue;
	productsWithPromos.add(product.ID_Prodotto);
	
	const promoType = promoTypes[Math.floor(Math.random() * promoTypes.length)];
	const startOffset = Math.floor(Math.random() * 14) - 7; // -7 to +7 days
	const duration = 7 + Math.floor(Math.random() * 21); // 7-28 days
	
	const startDate = new Date(today);
	startDate.setDate(startDate.getDate() + startOffset);
	const endDate = new Date(startDate);
	endDate.setDate(endDate.getDate() + duration);
	
	const value = Math.floor(promoType.minVal + Math.random() * (promoType.maxVal - promoType.minVal));
	const minCondition = Math.floor(Math.random() * 20); // 0-20 euro minimum
	
	const promoName = promoNames[Math.floor(Math.random() * promoNames.length)] + ' - ' + product.NomeProdotto.substring(0, 20) + ' #' + Date.now().toString(36).slice(-4);
	const desc = `${promoType.type === '3x2' ? 'Prendi 3 paghi 2' : `Sconto ${value}${promoType.type === 'Percentuale' ? '%' : '€'}`} su ${product.NomeProdotto}`;
	
	try {
		const result = insertPromo.run(
			promoName,
			desc,
			startDate.toISOString().split('T')[0],
			endDate.toISOString().split('T')[0],
			promoType.type,
			value,
			minCondition
		);
		
		if (result.changes > 0) {
			// Link to product
			linkPromoProduct.run(product.ID_Prodotto, result.lastInsertRowid);
			promosAdded++;
		}
	} catch (e) {}
}
console.log(`   Added ${promosAdded} promotions`);

// ==========================================
// 4. ENSURE SOME LOW STOCK ITEMS
// ==========================================
console.log('\n📉 Ensuring some low stock items exist...');

// Check current low stock count (<=15 threshold)
const currentLowStock = db.prepare('SELECT COUNT(*) as c FROM lottiprodotto_stock WHERE QuantitaAttuale <= 15 AND QuantitaAttuale > 0').get().c;
console.log(`   Current low stock items: ${currentLowStock}`);

// Set some random stock entries to low values if we have fewer than 10
const updateLowStock = db.prepare(`
	UPDATE lottiprodotto_stock 
	SET QuantitaAttuale = ? 
	WHERE ID_Lotto = ?
`);

const targetLowStock = CONFIG.targetLowStock; // Target number of low stock items
const toAdd = Math.max(0, targetLowStock - currentLowStock);

if (toAdd > 0) {
	const stockEntries = db.prepare('SELECT ID_Lotto FROM lottiprodotto_stock WHERE QuantitaAttuale > 15 ORDER BY RANDOM() LIMIT ?').all(toAdd);
	let lowStockUpdated = 0;
	for (const entry of stockEntries) {
		const qty = 1 + Math.floor(Math.random() * 14); // 1-14 units (<=15 threshold)
		updateLowStock.run(qty, entry.ID_Lotto);
		lowStockUpdated++;
	}
	console.log(`   Set ${lowStockUpdated} additional items to low stock`);
} else {
	console.log(`   Already have enough low stock items, skipping`);
}

// ==========================================
// 5. ADD MORE CLIENTS
// ==========================================
console.log('\n👤 Adding more clients...');

const moreClients = [
	['Vincenzo', 'De Luca', 'DLCVNC80A15F839A', null, 'Via San Gregorio 45', 'Napoli', '80132', 'NA'],
	['Antonella', 'Pugliese', 'PGLNTN85E55H501B', null, 'Via Cassia 234', 'Roma', '00191', 'RM'],
	['Massimo', 'Cattaneo', 'CTTMSM78L12F205C', null, 'Corso Sempione 78', 'Milano', '20154', 'MI'],
	['Ilaria', 'Piazza', 'PZZLRI88D65L219D', null, 'Via Nizza 123', 'Torino', '10126', 'TO'],
	['Daniele', 'Vitali', 'VTLDNL82H18F839E', null, 'Via Duomo 56', 'Napoli', '80138', 'NA'],
	['Roberta', 'Grasso', 'GRSRRT90P45H501F', null, 'Via Tiburtina 456', 'Roma', '00159', 'RM'],
	['Stefano', 'Silvestri', 'SLVSFN75S22F205G', null, 'Viale Papiniano 67', 'Milano', '20123', 'MI'],
	['Monica', 'Testa', 'TSTMNC87A50L219H', null, 'Corso Orbassano 89', 'Torino', '10137', 'TO'],
	['Fabrizio', 'Bruno', 'BRNFRZ79C15F839I', null, 'Via Posillipo 234', 'Napoli', '80123', 'NA'],
	['Sabrina', 'Leone', 'LNESRN86L60H501L', null, 'Via Prenestina 567', 'Roma', '00176', 'RM'],
	['Claudio', 'Morelli', 'MRLCLD81M25F205M', null, 'Via Washington 12', 'Milano', '20146', 'MI'],
	['Cristina', 'Villa', 'VLLCRS89E52L219N', null, 'Via Madama Cristina 78', 'Torino', '10126', 'TO'],
	['Enrico', 'Amato', 'MTANRC77P18F839O', null, 'Via Tribunali 123', 'Napoli', '80138', 'NA'],
	['Paola', 'Sartori', 'SRTPLA84B45H501P', null, 'Via Nomentana 234', 'Roma', '00198', 'RM'],
	['Alberto', 'Benedetti', 'BNDLRT76K22F205Q', null, 'Corso Como 45', 'Milano', '20154', 'MI'],
	['Veronica', 'Martinelli', 'MRTVNC91G50L219R', null, 'Via San Secondo 67', 'Torino', '10128', 'TO'],
	['Francesco', 'Marchetti', 'MRCFNC83D15F839S', null, 'Via Chiaia 89', 'Napoli', '80121', 'NA'],
	['Simona', 'Caputo', 'CPTSMN88H55H501T', null, 'Via Salaria 345', 'Roma', '00199', 'RM'],
	['Michele', 'Ferrante', 'FRRMHL80L22F205U', null, 'Corso Vercelli 56', 'Milano', '20144', 'MI'],
	['Eleonora', 'Mazza', 'MZZLNR92A48L219V', null, 'Corso Vittorio 123', 'Torino', '10121', 'TO'],
];

const insertClient = db.prepare(`
	INSERT OR IGNORE INTO clienti (Nome, Cognome, CodiceFiscale_Cli, PartitaIVA_Cli, Indirizzo_Cli, Citta_Cli, CAP_Cli, Provincia_Cli, DataRegistrazione)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || (abs(random()) % 180) || ' days'))
`);

let clientsAdded = 0;
for (const c of moreClients) {
	try {
		const result = insertClient.run(...c);
		if (result.changes > 0) clientsAdded++;
	} catch (err) {}
}
console.log(`   Added ${clientsAdded} clients`);

// Generate additional random clients if requested
if (CONFIG.extraClients > 0) {
	console.log(`\n👥 Generating ${CONFIG.extraClients} random clients...`);
	
	const firstNames = ['Marco', 'Giulia', 'Alessandro', 'Francesca', 'Luca', 'Sara', 'Andrea', 'Chiara', 'Matteo', 'Elena', 'Davide', 'Martina', 'Federico', 'Valentina', 'Simone', 'Giorgia', 'Riccardo', 'Alessia', 'Lorenzo', 'Beatrice'];
	const lastNames = ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti'];
	const cities = [
		{ city: 'Milano', cap: '20100', prov: 'MI' },
		{ city: 'Roma', cap: '00100', prov: 'RM' },
		{ city: 'Torino', cap: '10100', prov: 'TO' },
		{ city: 'Napoli', cap: '80100', prov: 'NA' },
		{ city: 'Bologna', cap: '40100', prov: 'BO' },
		{ city: 'Firenze', cap: '50100', prov: 'FI' },
	];
	const streets = ['Via Roma', 'Corso Italia', 'Via Garibaldi', 'Piazza Duomo', 'Via Mazzini', 'Corso Vittorio', 'Via Dante', 'Via Cavour'];
	
	const insertRandomClient = db.prepare(`
		INSERT INTO clienti (Nome, Cognome, CodiceFiscale_Cli, Indirizzo_Cli, Citta_Cli, CAP_Cli, Provincia_Cli, DataRegistrazione)
		VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', '-' || ? || ' days'))
	`);
	
	let randomClientsAdded = 0;
	for (let i = 0; i < CONFIG.extraClients; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const cityInfo = cities[Math.floor(Math.random() * cities.length)];
		const street = streets[Math.floor(Math.random() * streets.length)] + ' ' + Math.floor(Math.random() * 200 + 1);
		const cf = (lastName.substring(0, 3) + firstName.substring(0, 3) + Math.floor(Math.random() * 90 + 10) + 'A' + Math.floor(Math.random() * 30 + 10) + 'X' + Math.floor(Math.random() * 900 + 100) + 'Z').toUpperCase();
		const daysAgo = Math.floor(Math.random() * 365);
		
		try {
			const result = insertRandomClient.run(firstName, lastName, cf, street, cityInfo.city, cityInfo.cap, cityInfo.prov, daysAgo);
			if (result.changes > 0) randomClientsAdded++;
		} catch (e) {}
	}
	console.log(`   Generated ${randomClientsAdded} random clients`);
}

// ==========================================
// FINAL STATISTICS
// ==========================================
console.log('\n' + '='.repeat(50));
console.log('📊 FINAL DATABASE STATISTICS\n');

const stats = {
	categories: db.prepare('SELECT COUNT(*) as c FROM categorieprodotto').get().c,
	products: db.prepare('SELECT COUNT(*) as c FROM prodotti').get().c,
	suppliers: db.prepare('SELECT COUNT(*) as c FROM fornitori').get().c,
	stock: db.prepare('SELECT COUNT(*) as c FROM lottiprodotto_stock').get().c,
	lowStock: db.prepare('SELECT COUNT(*) as c FROM lottiprodotto_stock WHERE QuantitaAttuale <= 15 AND QuantitaAttuale > 0').get().c,
	clients: db.prepare('SELECT COUNT(*) as c FROM clienti').get().c,
	employees: db.prepare('SELECT COUNT(*) as c FROM operatori').get().c,
	sales: db.prepare('SELECT COUNT(*) as c FROM vendite_testata').get().c,
	promotions: db.prepare('SELECT COUNT(*) as c FROM promozioni').get().c,
	activePromos: db.prepare("SELECT COUNT(*) as c FROM promozioni WHERE date(DataFine) >= date('now') AND date(DataInizio) <= date('now')").get().c,
	stores: db.prepare('SELECT COUNT(*) as c FROM puntivendita').get().c,
};

console.log(`   🏪 Stores:           ${stats.stores}`);
console.log(`   📁 Categories:       ${stats.categories}`);
console.log(`   📦 Products:         ${stats.products}`);
console.log(`   🏭 Suppliers:        ${stats.suppliers}`);
console.log(`   📋 Stock lots:       ${stats.stock}`);
console.log(`   ⚠️  Low stock items:  ${stats.lowStock}`);
console.log(`   👤 Clients:          ${stats.clients}`);
console.log(`   👥 Employees:        ${stats.employees}`);
console.log(`   🧾 Sales:            ${stats.sales}`);
console.log(`   🏷️  Total Promotions: ${stats.promotions}`);
console.log(`   ✅ Active Promos:    ${stats.activePromos}`);

db.close();
console.log('\n✅ Data update complete!\n');
