// Database types matching SQLite schema

export interface Categoria {
	ID_Categoria: number;
	NomeCategoria: string;
	Descrizione?: string;
}

export interface Cliente {
	ID_Cliente: number;
	Nome?: string;
	Cognome?: string;
	CodiceFiscale_Cli?: string;
	PartitaIVA_Cli?: string;
	Indirizzo_Cli?: string;
	Citta_Cli?: string;
	CAP_Cli?: string;
	Provincia_Cli?: string;
	Email_Cli?: string;
	Telefono_Cli?: string;
	DataRegistrazione?: string;
}

export interface Fornitore {
	ID_Fornitore: number;
	RagioneSociale: string;
	PartitaIVA_F?: string;
	Indirizzo_F?: string;
	Citta_F?: string;
	CAP_F?: string;
	Provincia_F?: string;
	Email_F?: string;
	Telefono_F?: string;
	Referente_F?: string;
}

export interface PuntoVendita {
	ID_PuntoVendita: number;
	NomePuntoVendita: string;
	Indirizzo?: string;
	Citta?: string;
	CAP?: string;
	Provincia?: string;
	Telefono?: string;
}

export interface Prodotto {
	ID_Prodotto: number;
	CodiceBarre?: string;
	NomeProdotto: string;
	Descrizione?: string;
	ID_Categoria?: number;
	ID_FornitorePreferenziale?: number;
	PrezzoUnitarioVendita?: number;
	AliquotaIVA?: number;
	// Joined fields
	NomeCategoria?: string;
	RagioneSociale?: string;
}

export interface LottoStock {
	ID_Lotto: number;
	ID_Prodotto: number;
	ID_PuntoVendita: number;
	DataCarico: string;
	DataScadenza?: string;
	QuantitaIniziale: number;
	QuantitaAttuale: number;
	CostoAcquistoUnitario?: number;
	// Joined
	NomeProdotto?: string;
	NomePuntoVendita?: string;
}

export interface OrdineFornitoreTestata {
	ID_OrdineFornitore: number;
	ID_Fornitore: number;
	ID_PuntoVenditaDestinazione: number;
	DataOrdine: string;
	DataConsegnaPrevista?: string;
	DataConsegnaEffettiva?: string;
	StatoOrdine: string;
	TotaleOrdineStimato?: number;
	// Joined
	RagioneSociale?: string;
	NomePuntoVendita?: string;
}

export interface OrdineFornitoreDettaglio {
	ID_OrdineFornitore_Dettaglio: number;
	ID_OrdineFornitore: number;
	ID_Prodotto: number;
	QuantitaOrdinata: number;
	CostoUnitarioPrevisto?: number;
	QuantitaRicevuta?: number;
	NomeProdotto?: string;
}

export interface VenditaTestata {
	ID_Vendita: number;
	ID_PuntoVendita: number;
	ID_Cliente?: number;
	ID_Operatore?: number;
	DataOraVendita?: string;
	NumeroScontrino?: string;
	MetodoPagamento?: string;
	TotaleImponibile?: number;
	TotaleIVA?: number;
	TotaleVendita?: number;
	Note?: string;
	// Joined
	NomePuntoVendita?: string;
	NomeCliente?: string;
}

export interface VenditaDettaglio {
	ID_Vendita_Dettaglio: number;
	ID_Vendita: number;
	ID_Lotto?: number;
	ID_Prodotto: number;
	QuantitaVenduta: number;
	PrezzoUnitarioApplicato: number;
	AliquotaIVA?: number;
	SubtotaleRiga?: number;
	ScontoApplicato?: number;
	NomeProdotto?: string;
}

export interface Promozione {
	ID_Promozione: number;
	NomePromozione: string;
	Descrizione?: string;
	DataInizio?: string;
	DataFine?: string;
	TipoSconto?: string;
	ValoreSconto?: number;
	CondizioneMinima?: number;
}

export interface Operatore {
	ID_Operatore: number;
	Username: string;
	PasswordHash?: string;
	Nome?: string;
	Cognome?: string;
	Ruolo?: string;
	ID_PuntoVendita?: number;
	Attivo?: number;
}

// Dashboard Stats
export interface DashboardStats {
	totalProducts: number;
	totalCustomers: number;
	totalSales: number;
	totalRevenue: number;
	lowStock: number;
	expiringProducts: number;
	recentSales: VenditaTestata[];
	topProducts: { NomeProdotto: string; totalSold: number }[];
}
