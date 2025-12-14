# Sistema di Gestione per Catena di Supermercati

## 1. Descrizione del Database

La catena di supermercati è una struttura commerciale complessa che gestisce la vendita di una vasta gamma di prodotti a una clientela diversificata. I prodotti vengono approvvigionati da vari fornitori, stoccati in magazzini centralizzati o specifici per punto vendita, e devono essere tracciati per monitorare l'inventario e le date di scadenza.

Il sistema deve supportare:

- Le operazioni di cassa
- La registrazione dei clienti (opzionale: fidelity card o fatturazione)
- La generazione di scontrini e fatture
- La gestione degli ordini ai fornitori
- Il monitoraggio delle scorte

La struttura dati dovrà supportare un ambiente commerciale e logistico-amministrativo. Quando un prodotto arriva dal fornitore, viene registrato, catalogato e la sua giacenza aggiornata. Al momento della vendita, il prodotto viene scaricato dall'inventario e la transazione registrata. Per i clienti che richiedono fattura, è necessario raccogliere i dati fiscali.

### Macro-aree di gestione

1. **Gestione Commerciale e delle Vendite**
   - Registrazione dei prodotti
   - Gestione anagrafica clienti
   - Elaborazione delle transazioni
   - Emissione di scontrini e fatture

2. **Gestione Logistica e degli Approvvigionamenti**
   - Anagrafica fornitori
   - Gestione ordini d'acquisto
   - Carico merci
   - Tracciamento inventario e scadenze

---

## 2. Analisi dei Requisiti

Si richiede la gestione delle seguenti funzioni:

- **Anagrafica Prodotti**: codice, descrizione, prezzo, IVA, categoria, fornitore, scadenze per lotto
- **Inventario e Magazzino**: giacenze per lotto, scorte minime, carico/scarico merci
- **Clienti**: dati per fidelizzazione/fatturazione
- **Vendite**: transazioni, sconti/promozioni, scontrini
- **Fatturazione**: gestione clienti con P.IVA
- **Fornitori**: dati di contatto
- **Approvvigionamenti**: ordini, ricezione merci

### Requisiti specifici

- Tracciabilità dei lotti: data carico, scadenza, quantità, costo
- Reportistica: vendite per periodo/prodotto/cliente, scorte, scadenze
- Tracciamento operatore: es. ID OP007
- Gestione multi-punto vendita tramite entità `PuntoVendita`

---

## 3. Glossario dei Termini

| Termine            | Descrizione                                                                 | Sinonimi                       | Entità Coinvolte                                  |
|--------------------|-----------------------------------------------------------------------------|--------------------------------|---------------------------------------------------|
| **Prodotto**       | Articolo fisico venduto                                                     | Articolo, Merce                | Prodotti, Lotti, Vendite, Ordini, Categorie       |
| **Cliente**        | Acquirente                                                                 | Compratore                     | Clienti, Vendite                                  |
| **Vendita**        | Transazione commerciale                                                     | Scontrino, Acquisto            | Vendite                                           |
| **Fattura**        | Documento fiscale                                                           | Documento Fiscale              | Vendite                                           |
| **Fornitore**      | Azienda che rifornisce                                                      | Distributore                   | Fornitori, Prodotti, Ordini                       |
| **Magazzino/PV**   | Luogo fisico o logico dove si trovano i prodotti                            | Deposito, Negozio              | PuntiVendita, Lotti, Vendite, Ordini              |
| **Inventario**     | Giacenza di magazzino                                                       | Stock, Scorte                  | Lotti                                             |
| **Approvvigionamento** | Processo di rifornimento                                               | Ordine a Fornitore             | Ordini, Lotti                                     |
| **Lotto Prodotto** | Partita specifica con scadenza e quantità                                   | Batch                          | Lotti, Vendite                                    |
| **Scadenza**       | Data entro cui consumare un prodotto                                        | Data di Scadenza               | Lotti                                             |
| **Operatore**      | Dipendente addetto alle operazioni                                          | Cassiere, Magazziniere         | Operatori, Vendite                                |
| **Categoria**      | Raggruppamento logico (es. Latticini)                                       | Reparto                        | Categorie, Prodotti                               |

---

## 4. Progettazione Concettuale

### Strategia di progetto:
Si sceglie di creare il database sulla base di un approccio misto: sia top-down (identificando le macro-aree e poi dettagliandole) che bottom-up (partendo da attributi specifici richiesti e raggruppandoli in entità). Di seguito verranno riepilogate le sequenze, con i vari raffinamenti, che porteranno all'effettivo modello relazionale.

Di seguito la progettazione della “Gestione Catena di Supermercati":

### 1° Sequenza:
Viene generato un primo schema scheletro che individua due entità centrali: PRODOTTO e PUNTO_VENDITA (o Magazzino, se unico). I capisaldi della nostra struttura iniziale, legate dalla relazione: "è disponibile in", indica quindi la presenza di un prodotto in un determinato punto vendita/magazzino.

Diagramma semplice: `[PRODOTTO] --(è disponibile in)-- [PUNTO_VENDITA]`

### 2° Sequenza:
Viene introdotta l'entità CLIENTE e l'entità VENDITA. La VENDITA è l'atto che lega un CLIENTE ai PRODOTTI acquistati in un PUNTO_VENDITA. La relazione "effettua" lega CLIENTE a VENDITA, e una relazione molti-a-molti (che diventerà DETTAGLIO_VENDITA) lega VENDITA a PRODOTTO.

Diagramma:
`[CLIENTE] --(effettua)-- [VENDITA] --(include)-- [PRODOTTO]`
`[VENDITA] --(avviene in)-- [PUNTO_VENDITA]`

### 3° Sequenza:
Viene introdotta l'entità FORNITORE. Essa indica chi approvvigiona i PRODOTTI. La relazione "fornisce" lega FORNITORE a PRODOTTO. Per gestire gli approvvigionamenti in modo più strutturato, si introduce l'entità ORDINE_FORNITORE.

Diagramma:
`[FORNITORE] --(emette)-- [ORDINE_FORNITORE] --(contiene dettagli per)-- [PRODOTTO]`
`[ORDINE_FORNITORE] --(è destinato a)-- [PUNTO_VENDITA]`

### 4° Sequenza:
È immediata l'introduzione dell'entità LOTTO_PRODOTTO (o STOCK_PRODOTTO) per tracciare le scadenze e le quantità specifiche di ogni partita di merce in arrivo, collegata a PRODOTTO e PUNTO_VENDITA, e alimentata dagli ORDINI_FORNITORE ricevuti. L'entità CATEGORIA_PRODOTTO viene aggiunta per classificare i PRODOTTI.

Diagramma:
`[PRODOTTO] --(appartiene a)-- [CATEGORIA_PRODOTTO]`
`[LOTTO_PRODOTTO] --(riferisce a)-- [PRODOTTO]`
`[LOTTO_PRODOTTO] --(è stoccato in)-- [PUNTO_VENDITA]`
`[ORDINE_FORNITORE] --(genera)-- [LOTTO_PRODOTTO] (alla ricezione)`

---

Si arriva ad un primo raffinamento dello scheletro:
Iniziamo con elencare le varie relazioni ed entità con i rispettivi attributi e collegamenti.

Grazie all'analisi preliminare, abbiamo identificato gli attributi delle seguenti entità:

#### Prodotto
| Attributo                 | Chiave / Nota     |
|---------------------------|-------------------|
| ID_Prodotto               | PK                |
| CodiceBarre               |                   |
| NomeProdotto              |                   |
| Descrizione               |                   |
| PrezzoUnitarioVendita     |                   |
| AliquotaIVA               |                   |
| ID_Categoria              | FK                |
| ID_FornitorePreferenziale | FK, opzionale     |

#### PuntoVendita (o Magazzino)
| Attributo       | Chiave / Nota |
|-----------------|---------------|
| ID_PuntoVendita | PK            |
| NomePV          |               |
| IndirizzoPV     |               |
| CittaPV         |               |

#### LottoProdotto_Stock
| Attributo               | Chiave / Nota                           |
|-------------------------|-----------------------------------------|
| ID_Lotto                | PK (composta o surrogata)               |
| ID_Prodotto             | FK                                      |
| ID_PuntoVendita         | FK                                      |
| DataCarico              |                                         |
| DataScadenza            |                                         |
| QuantitaAttuale         |                                         |
| CostoAcquistoUnitario   | opzionale                               |
**Cardinalità:** Un Prodotto può avere N Lotti. Un PuntoVendita può avere N Lotti. Un Lotto appartiene a un solo Prodotto e si trova in un solo PuntoVendita (se i lotti non sono spostati; altrimenti serve tracciare trasferimenti).

#### Cliente
| Attributo           | Chiave / Nota |
|---------------------|---------------|
| ID_Cliente          | PK            |
| Nome                |               |
| Cognome             |               |
| CodiceFiscale/PartitaIVA |           |
| Email               |               |
| Telefono            |               |

#### Vendita_Testata
| Attributo         | Chiave / Nota |
|-------------------|---------------|
| ID_Vendita        | PK            |
| ID_Cliente        | FK, opzionale |
| ID_PuntoVendita   | FK            |
| ID_Operatore      | FK, opzionale |
| DataOraVendita    |               |
| NumeroScontrino   |               |
| NumeroFattura     | opzionale     |
| TotaleComplessivo |               |
**Cardinalità:** Un Cliente può fare N Vendite. Una Vendita è fatta da un Cliente (o è anonima). Una Vendita avviene in un PuntoVendita e può essere processata da un Operatore.

#### Vendita_Dettaglio (risolve la N:M tra Vendita e Prodotto/Lotto)
| Attributo             | Chiave / Nota                          |
|-----------------------|----------------------------------------|
| ID_Vendita_Dettaglio  | PK o (ID_Vendita(FK), ID_Lotto(FK)) PK |
| QuantitaVenduta       |                                        |
| PrezzoApplicato       |                                        |
**Cardinalità:** Una Vendita_Testata ha N righe di Vendita_Dettaglio. Ogni riga di Vendita_Dettaglio si riferisce a un LottoProdotto_Stock.

#### Fornitore
| Attributo       | Chiave / Nota |
|-----------------|---------------|
| ID_Fornitore    | PK            |
| RagioneSociale  |               |
| PartitaIVA      |               |
| IndirizzoF      |               |
| EmailF          |               |

#### OrdineFornitore_Testata
| Attributo                     | Chiave / Nota |
|-------------------------------|---------------|
| ID_OrdineF                    | PK            |
| ID_Fornitore                  | FK            |
| ID_PuntoVenditaDestinazione   | FK            |
| DataOrdine                    |               |
| StatoOrdine                   |               |

#### OrdineFornitore_Dettaglio
| Attributo               | Chiave / Nota                     |
|-------------------------|-----------------------------------|
| (ID_OrdineF, ID_Prodotto) | PK (chiave composta ID_OrdineF FK, ID_Prodotto FK) |
| QuantitaOrdinata        |                                   |
| CostoUnitarioPrevisto   |                                   |

#### CategoriaProdotto
| Attributo     | Chiave / Nota |
|---------------|---------------|
| ID_Categoria  | PK            |
| NomeCategoria |               |

#### Operatore
| Attributo    | Chiave / Nota |
|--------------|---------------|
| ID_Operatore | PK            |
| NomeOp       |               |
| CognomeOp    |               |
| Ruolo        |               |
(Se vogliamo tracciare chi fa cosa).

**Riepilogo Relazioni Chiave:**
*   La relazione "è disponibile in" tra Prodotto e PuntoVendita è ora rappresentata più finemente da LottoProdotto_Stock.
*   La relazione "effettua" tra Cliente e Vendita_Testata è 1:N.
*   La relazione "include" tra Vendita_Testata e Prodotto è N:M, risolta da Vendita_Dettaglio che punta a LottoProdotto_Stock (che a sua volta punta a Prodotto).
*   La relazione "fornisce" è gestita tramite OrdineFornitore_Testata e OrdineFornitore_Dettaglio.
*   La relazione "Mantenuto" (come ASL per Canile) potrebbe essere un'entità "AmministrazioneCatena" se ci fossero attributi specifici di gestione finanziaria centralizzata da associare, ma per ora le finanze sono deducibili da Vendite e Ordini.

---

### Introduzione delle Promozioni
Lo schema si complica con l'introduzione delle Promozioni:

#### Promozione
| Attributo       | Chiave / Nota             |
|-----------------|---------------------------|
| ID_Promozione   | PK                        |
| DescrizionePromo|                           |
| DataInizio      |                           |
| DataFine        |                           |
| TipoSconto      | (es. %, fisso)            |
| ValoreSconto    |                           |

#### ProdottiInPromozione
| Attributo                 | Chiave / Nota                          |
|---------------------------|----------------------------------------|
| (ID_Promozione, ID_Prodotto) | PK (chiave composta ID_Promozione FK, ID_Prodotto FK) |

La Vendita_Dettaglio potrebbe avere un ID_PromozioneApplicata (FK, opzionale).

---

### Schema E-R intermedio (testuale, prima della ristrutturazione):

*   **PRODOTTO** (`ID_Prodotto`, `CodiceBarre`, `NomeProdotto`, `Descrizione`, `PrezzoUnitarioVendita`, `AliquotaIVA`)
*   **CATEGORIA_PRODOTTO** (`ID_Categoria`, `NomeCategoria`) ---< **PRODOTTO** (1:N, Prodotto appartiene a Categoria)
*   **PUNTO_VENDITA** (`ID_PuntoVendita`, `NomePV`, `IndirizzoPV`)
*   **LOTTO_PRODOTTO_STOCK** (`ID_Lotto`, `DataCarico`, `DataScadenza`, `QuantitaAttuale`, `CostoAcquistoUnitario`)
    *   Relazione con **PRODOTTO** (1:N, Lotto è di un Prodotto)
    *   Relazione con **PUNTO_VENDITA** (1:N, Lotto è in un PuntoVendita)
*   **CLIENTE** (`ID_Cliente`, `Nome`, `Cognome`, `CF_PIVA`, `Email`)
*   **OPERATORE** (`ID_Operatore`, `NomeOp`, `CognomeOp`, `Ruolo`)
*   **VENDITA_TESTATA** (`ID_Vendita`, `DataOraVendita`, `NumeroScontrino`, `NumeroFattura`, `Totale`)
    *   Relazione con **CLIENTE** (N:1, Vendita è di un Cliente, opzionale)
    *   Relazione con **PUNTO_VENDITA** (N:1, Vendita avviene in un PuntoVendita)
    *   Relazione con **OPERATORE** (N:1, Vendita è processata da un Operatore, opzionale)
*   **VENDITA_DETTAGLIO** (`ID_Vendita_Dettaglio` o `{ID_Vendita, ID_Lotto}` come PK, `QuantitaVenduta`, `PrezzoApplicato`)
    *   Relazione con **VENDITA_TESTATA** (N:1)
    *   Relazione con **LOTTO_PRODOTTO_STOCK** (N:1, riga vendita preleva da Lotto)
*   **FORNITORE** (`ID_Fornitore`, `RagioneSociale`, `PartitaIVA_F`)
*   **PRODOTTO** --- **FORNITORE** (N:1, Prodotto ha un Fornitore Preferenziale, opzionale)
*   **ORDINE_FORNITORE_TESTATA** (`ID_OrdineF`, `DataOrdine`, `StatoOrdine`)
    *   Relazione con **FORNITORE** (N:1, Ordine è per un Fornitore)
    *   Relazione con **PUNTO_VENDITA** (N:1, Ordine è destinato a un PuntoVendita)
*   **ORDINE_FORNITORE_DETTAGLIO** (`{ID_OrdineF, ID_Prodotto}` come PK, `QuantitaOrdinata`, `CostoUnitarioPrevisto`)
    *   Relazione con **ORDINE_FORNITORE_TESTATA** (N:1)
    *   Relazione con **PRODOTTO** (N:1)
    *(Al ricevimento merce, ORDINE_FORNITORE_DETTAGLIO + DataScadenza (da bolla) -> LOTTO_PRODOTTO_STOCK)*
*   **PROMOZIONE** (`ID_Promozione`, `DescrizionePromo`, `DataInizio`, `DataFine`, `TipoSconto`, `ValoreSconto`)
*   **PRODOTTI_IN_PROMOZIONE** (`{ID_Promozione, ID_Prodotto}` come PK)
*   **VENDITA_DETTAGLIO** potrebbe avere `ID_PromozioneApplicata` (FK, opzionale)

---

### Schema finale della 'Gestione Catena di Supermercati' (Schema ER Concettuale, prima della traduzione logica):
Immagina uno schema ER grafico con le entità e le relazioni descritte sopra.
*   **PRODOTTO** è collegato a CATEGORIA_PRODOTTO (1) e LOTTO_PRODOTTO_STOCK (N) e ORDINE_FORNITORE_DETTAGLIO (N) e FORNITORE (1, opzionale).
*   **PUNTO_VENDITA** è collegato a LOTTO_PRODOTTO_STOCK (N) e VENDITA_TESTATA (N) e ORDINE_FORNITORE_TESTATA (N).
*   **LOTTO_PRODOTTO_STOCK** è il cuore dell'inventario, collegato a VENDITA_DETTAGLIO (N).
*   **CLIENTE** è collegato a VENDITA_TESTATA (N, opzionale).
*   **OPERATORE** è collegato a VENDITA_TESTATA (N, opzionale).
*   **VENDITA_TESTATA** è collegata a VENDITA_DETTAGLIO (1-N).
*   **FORNITORE** è collegato a ORDINE_FORNITORE_TESTATA (N).
*   **ORDINE_FORNITORE_TESTATA** è collegata a ORDINE_FORNITORE_DETTAGLIO (1-N).
*   **PROMOZIONE** è collegata a PRODOTTI_IN_PROMOZIONE (1-N), che a sua volta è legata a PRODOTTO.

(Questo schema è ancora concettuale, la traduzione in tabelle logiche affinerà le chiavi e le relazioni).

---

### Schema Intermedio (Raffinamento):
Al termine delle seguenti raffinazioni si è giunti al seguente Schema Intermedio (rappresentazione testuale delle entità principali e delle loro relazioni chiave):

#### ENTITÀ PRINCIPALI:

##### CATEGORIE_PRODOTTO
| Attributo       |
|-----------------|
| ID_Categoria    |
| NomeCategoria   |

##### FORNITORI
| Attributo       |
|-----------------|
| ID_Fornitore    |
| RagioneSociale  |
| PIVA_F          |
| Contatti        |

##### PRODOTTI
| Attributo            | Chiave / Nota |
|----------------------|---------------|
| ID_Prodotto          |               |
| CodiceBarre          |               |
| Nome                 |               |
| Descrizione          |               |
| ID_Categoria         | FK            |
| ID_Fornitore_Pref    | FK            |
| PrezzoVendita        |               |
| AliquotaIVA          |               |

##### PUNTI_VENDITA
| Attributo        |
|------------------|
| ID_PuntoVendita  |
| NomePV           |
| IndirizzoPV      |

##### LOTTI_PRODOTTO_STOCK
| Attributo        | Chiave / Nota |
|------------------|---------------|
| ID_Lotto         |               |
| ID_Prodotto      | FK            |
| ID_PuntoVendita  | FK            |
| DataCarico       |               |
| DataScadenza     |               |
| QtaIniziale      |               |
| QtaAttuale       |               |
| CostoAcquisto    |               |

##### CLIENTI
| Attributo        |
|------------------|
| ID_Cliente       |
| Nome             |
| Cognome          |
| CF_PIVA          |
| Indirizzo_Cli    |
| Email_Cli        |

##### OPERATORI
| Attributo        |
|------------------|
| ID_Operatore     |
| NomeOp           |
| CognomeOp        |
| Ruolo            |

##### VENDITE_TESTATA
| Attributo         | Chiave / Nota |
|-------------------|---------------|
| ID_Vendita        |               |
| ID_PuntoVendita   | FK            |
| ID_Cliente        | FK            |
| ID_Operatore      | FK            |
| DataOra           |               |
| NumScontrino      |               |
| NumFattura        |               |
| TotaleImponibile  |               |
| TotaleIVA         |               |
| TotaleFinale      |               |
| MetodoPagamento   |               |

##### VENDITE_DETTAGLIO
| Attributo         | Chiave / Nota |
|-------------------|---------------|
| ID_VenditaDet     |               |
| ID_Vendita        | FK            |
| ID_Lotto          | FK            |
| QtaVenduta        |               |
| PrezzoUnitarioAppl|               |
| AliquotaIVAAppl   |               |
| Subtotale         |               |

##### ORDINI_FORNITORE_TESTATA
| Attributo             | Chiave / Nota |
|-----------------------|---------------|
| ID_OrdineF            |               |
| ID_Fornitore          | FK            |
| ID_PuntoVendita_Dest  | FK            |
| DataOrdine            |               |
| DataPrevConsegna      |               |
| StatoOrdine           |               |

##### ORDINI_FORNITORE_DETTAGLIO
| Attributo            | Chiave / Nota |
|----------------------|---------------|
| ID_OrdineFDet        |               |
| ID_OrdineF           | FK            |
| ID_Prodotto          | FK            |
| QtaOrdinata          |               |
| CostoUnitarioPrev    |               |

##### PROMOZIONI
| Attributo        |
|------------------|
| ID_Promozione    |
| DescrizionePromo |
| DataInizio       |
| DataFine         |
| TipoSconto       |
| ValoreSconto     |

##### PRODOTTI_PROMOZIONI (Tabella associativa)
| Attributo         | Chiave / Nota |
|-------------------|---------------|
| ID_ProdottoPromo  |               |
| ID_Promozione     | FK            |
| ID_Prodotto       | FK            |

Le relazioni collegano queste entità come descritto in precedenza (es. Prodotti a Categorie, Lotti a Prodotti e PuntiVendita, VenditeDettaglio a VenditeTestata e Lotti, ecc.).

---

### Ristrutturazione dello schema ER
Notiamo subito che sia presente una potenziale generalizzazione/specializzazione se avessimo tipi diversi di Prodotti con attributi molto specifici (es. "Prodotti Freschi" vs "Prodotti a Lunga Conservazione" con attributi unici). Per questo scenario, tuttavia, la gestione tramite LottiProdotto_Stock con DataScadenza è sufficiente e non introduciamo generalizzazioni complesse per mantenere lo schema più snello.

### COLLASSO (SE APPLICABILE O SEMPLIFICAZIONE):
Nell'esempio del canile c'era "Trovatello" come specializzazione di "Cane". Nel nostro caso:
*   Non abbiamo una chiara generalizzazione così forte da collassare. L'entità PRODOTTI è già abbastanza generica.
*   La relazione tra VENDITE_TESTATA e PRODOTTI (tramite VENDITE_DETTAGLIO e LOTTI_PRODOTTO_STOCK) è cruciale e non va semplificata eliminando dettagli.
*   Se avessimo considerato "Tipologie di Cliente" (es. "Privato", "Azienda") con attributi molto diversi, avremmo potuto pensare a una generalizzazione. Ma per ora, un'unica entità CLIENTI con campi opzionali per P.IVA è gestibile.
*   L'entità PRODOTTI_PROMOZIONI è una tabella associativa standard per la relazione N:M tra PRODOTTI e PROMOZIONI.

Di conseguenza, lo schema intermedio è già abbastanza ristrutturato e pronto per la fase logica, senza necessità di collassi significativi come nell'esempio del canile. La complessità risiede più nel numero di entità e nelle loro interazioni che in gerarchie complesse.

---

### Schema Finale (Post-Ristrutturazione)
A seguito della ristrutturazione (o meglio, della validazione dello schema intermedio), ecco come sarà visualizzato lo schema concettuale finale (ancora una descrizione testuale in attesa del grafico UML):

Lo schema finale riflette sostanzialmente quello intermedio, con una chiara definizione delle entità e delle relazioni N:M risolte da tabelle associative (come VENDITE_DETTAGLIO e PRODOTTI_PROMOZIONI).

Le entità chiave sono:
*   CategorieProdotto
*   Fornitori
*   Prodotti (collegata a Categorie e Fornitori)
*   PuntiVendita
*   LottiProdotto_Stock (collegata a Prodotti e PuntiVendita)
*   Clienti
*   Operatori
*   Vendite_Testata (collegata a PuntiVendita, Clienti, Operatori)
*   Vendite_Dettaglio (collegata a Vendite_Testata e LottiProdotto_Stock)
*   OrdiniFornitore_Testata (collegata a Fornitori e PuntiVendita)
*   OrdiniFornitore_Dettaglio (collegata a OrdiniFornitore_Testata e Prodotti)
*   Promozioni
*   Prodotti_Promozioni (collegata a Promozioni e Prodotti)

Le relazioni sono principalmente 1:N o N:M risolte. Ad esempio:
*   Prodotti 1 <-- N LottiProdotto_Stock
*   PuntiVendita 1 <-- N LottiProdotto_Stock
*   Vendite_Testata 1 <-- N Vendite_Dettaglio
*   LottiProdotto_Stock 1 <-- N Vendite_Dettaglio
*   Promozioni N <--> M Prodotti (risolta da Prodotti_Promozioni)



## 5. Dizionario dei dati:
Di seguito è riportato il dizionario dei dati, sia rispetto all'entità che alle relazioni (le relazioni con attributi sono già tabelle):

| Entità/Relazione          | Descrizione                                                                     | Attributi (Chiavi Primarie in grassetto)                                                                                                                                                           | Identificatore (PK)                                                           |
|---------------------------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| CategorieProdotto         | Raggruppamento di prodotti (es. Latticini, Ortofrutta).                         | **ID_Categoria**, NomeCategoria, DescrizioneCategoria                                                                                                                                              | **ID_Categoria**                                                              |
| Fornitori                 | Aziende che forniscono prodotti al supermercato.                                | **ID_Fornitore**, RagioneSociale, PartitaIVA_F, Indirizzo_F, Citta_F, CAP_F, Provincia_F, Email_F, Telefono_F, Referente_F                                                                      | **ID_Fornitore**                                                              |
| Prodotti                  | Articolo in vendita, con dettagli generali.                                     | **ID_Prodotto**, CodiceBarre, NomeProdotto, Descrizione, ID_Categoria (FK), ID_FornitorePreferenziale (FK, Opz.), PrezzoUnitarioVendita, AliquotaIVA                                              | **ID_Prodotto**                                                               |
| PuntiVendita              | Singolo supermercato o magazzino della catena.                                  | **ID_PuntoVendita**, NomePuntoVendita, Indirizzo_PV, Citta_PV, CAP_PV, Provincia_PV, Telefono_PV                                                                                                  | **ID_PuntoVendita**                                                           |
| LottiProdotto_Stock       | Traccia i singoli lotti di prodotti in magazzino, con scadenze e quantità.        | **ID_Lotto**, ID_Prodotto (FK), ID_PuntoVendita (FK), DataCarico, DataScadenza, QuantitaIniziale, QuantitaAttuale, CostoAcquistoUnitario, ID_OrdineFornitore_Dettaglio (FK, Opz.)                   | **ID_Lotto**                                                                  |
| Clienti                   | Anagrafica dei clienti registrati.                                              | **ID_Cliente**, Nome, Cognome, CodiceFiscale_Cli, PartitaIVA_Cli, Indirizzo_Cli, Citta_Cli, CAP_Cli, Provincia_Cli, Email_Cli, Telefono_Cli, DataRegistrazione                                  | **ID_Cliente**                                                                |
| Operatori                 | Dipendenti che operano sul sistema (cassieri, magazzinieri).                    | **ID_Operatore**, NomeOperatore, CognomeOperatore, Username, Ruolo (es. Cassiere, Magazziniere, Responsabile)                                                                                       | **ID_Operatore**                                                              |
| Vendite_Testata           | Intestazione di una transazione di vendita (scontrino/fattura).                 | **ID_Vendita**, ID_PuntoVendita (FK), ID_Cliente (FK, Opz.), ID_Operatore (FK, Opz.), DataOraVendita, NumeroScontrinoFiscale, NumeroFattura (Opz.), TotaleImponibile, TotaleIVA, TotaleVendita, MetodoPagamento | **ID_Vendita**                                                                |
| Vendite_Dettaglio         | Singoli prodotti/lotti venduti in una transazione. (Tabella associativa tra Vendite e Lotti) | **ID_Vendita_Dettaglio**, ID_Vendita (FK), ID_Lotto (FK), ID_Prodotto (FK, ridondante ma utile), QuantitaVenduta, PrezzoUnitarioApplicato, AliquotaIVAApplicata, SubtotaleRiga, ID_PromozioneApplicata (FK, Opz.) | **ID_Vendita_Dettaglio** (o PK composta {**ID_Vendita**, **ID_Lotto**} se un lotto può apparire una sola volta per vendita) |
| OrdiniFornitore_Testata   | Intestazione di un ordine di acquisto verso un fornitore.                       | **ID_OrdineFornitore**, ID_Fornitore (FK), ID_PuntoVenditaDestinazione (FK), DataOrdine, DataConsegnaPrevista, DataConsegnaEffettiva (Opz.), StatoOrdine, TotaleOrdineStimato                     | **ID_OrdineFornitore**                                                        |
| OrdiniFornitore_Dettaglio | Dettaglio dei prodotti ordinati in un ordine fornitore. (Tabella associativa tra Ordini e Prodotti) | **ID_OrdineFornitore_Dettaglio**, ID_OrdineFornitore (FK), ID_Prodotto (FK), QuantitaOrdinata, CostoUnitarioPrevisto, QuantitaRicevuta (Opz.)                                                    | **ID_OrdineFornitore_Dettaglio** (o PK composta {**ID_OrdineFornitore**, **ID_Prodotto**}) |
| Promozioni                | Definisce le offerte speciali e gli sconti.                                     | **ID_Promozione**, NomePromozione, DescrizionePromozione, DataInizio, DataFine, TipoPromozione (es. %, fisso, 3x2), ValoreSconto (se fisso o %), Condizioni (testo)                                | **ID_Promozione**                                                             |
| Prodotti_Promozioni       | Associa i prodotti alle promozioni attive. (Tabella associativa tra Prodotti e Promozioni) | **ID_ProdottoPromozione**, ID_Promozione (FK), ID_Prodotto (FK)                                                                                                                                  | **ID_ProdottoPromozione** (o PK composta {**ID_Promozione**, **ID_Prodotto**}) |

## 6. Dizionario delle relazioni:
(Molte relazioni sono già state trasformate in tabelle associative nel Dizionario dei Dati perché erano N:M o avevano attributi propri)

| Relazione (Concettuale)    | Descrizione                                                                       | Componenti (Entità e Cardinalità)                                               | Attributi della Relazione (ora nella tabella associativa)                                                                         |
|----------------------------|-----------------------------------------------------------------------------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| Registra_Vendita           | Un operatore in un punto vendita registra una vendita per un cliente (opzionale).   | Vendite_Testata (1) --- Operatori (0..1), Clienti (0..1), PuntiVendita (1)      | Già in Vendite_Testata (ID_Operatore, ID_Cliente, ID_PuntoVendita, DataOraVendita, etc.)                                          |
| Dettaglia_Vendita          | Una vendita include più prodotti da specifici lotti.                              | Vendite_Testata (1) --- Vendite_Dettaglio (N) --- LottiProdotto_Stock (1)       | QuantitaVenduta, PrezzoUnitarioApplicato (in Vendite_Dettaglio)                                                                   |
| Appartiene_A_Categoria     | Un prodotto appartiene ad una categoria.                                          | Prodotti (N) --- CategorieProdotto (1)                                          | ID_Categoria (FK in Prodotti)                                                                                                   |
| Stoccato_In                | Un lotto di prodotto è stoccato in un punto vendita.                              | LottiProdotto_Stock (N) --- PuntiVendita (1) ; LottiProdotto_Stock (N) --- Prodotti (1) | ID_PuntoVendita, ID_Prodotto (FKs in LottiProdotto_Stock)                                                                         |
| Emette_Ordine              | Un ordine viene emesso a un fornitore per un punto vendita.                       | OrdiniFornitore_Testata (1) --- Fornitori (1), PuntiVendita (1)                 | ID_Fornitore, ID_PuntoVenditaDestinazione (FKs in OrdiniFornitore_Testata), DataOrdine, StatoOrdine                               |
| Dettaglia_Ordine           | Un ordine fornitore contiene più prodotti.                                        | OrdiniFornitore_Testata (1) --- OrdiniFornitore_Dettaglio (N) --- Prodotti (1)  | QuantitaOrdinata, CostoUnitarioPrevisto (in OrdiniFornitore_Dettaglio)                                                            |
| Applica_Promozione_A       | Una promozione si applica a determinati prodotti.                                 | Promozioni (N) --- Prodotti_Promozioni (N) --- Prodotti (N)                     | (Nessun attributo specifico sulla relazione, solo le FKs in Prodotti_Promozioni)                                                  |
| Ricezione_Merce_Lotto      | La ricezione di un dettaglio ordine genera/aggiorna un lotto.                     | OrdiniFornitore_Dettaglio (1) ---(genera/aggiorna)---> LottiProdotto_Stock (1 o N a seconda della gestione) | DataCarico, DataScadenza, QuantitaIniziale, CostoAcquistoUnitario (attributi di LottiProdotto_Stock derivati o inseriti alla ricezione) |



## 7. Progettazione Logica

Dopo la stesura dello schema concettuale del progetto, si prosegue con una stima dei dati e delle operazioni da effettuare sul database.

### Tabella dei volumi
(Stime indicative, da adattare alla reale dimensione della catena)

| Concetto                    | Tipo      | Volume Medio Stimato                     | Note                                                 |
|-----------------------------|-----------|------------------------------------------|------------------------------------------------------|
| CategorieProdotto           | Entità    | 50 - 200                                 | Numero di reparti/categorie merceologiche            |
| Fornitori                   | Entità    | 100 - 500                                | Numero di aziende fornitrici                         |
| Prodotti                    | Entità    | 5.000 - 50.000 per punto vendita         | Vasta gamma di articoli                              |
| PuntiVendita                | Entità    | 1 - 50                                   | Numero di supermercati nella catena                  |
| LottiProdotto_Stock         | Entità    | 20.000 - 200.000 attivi per punto vendita | Ogni prodotto può avere più lotti; alta rotazione    |
| Clienti                     | Entità    | 1.000 - 100.000 per punto vendita (se con fidelity) | Dipende dalla politica di registrazione          |
| Operatori                   | Entità    | 20 - 200 per punto vendita               | Personale addetto                                    |
| Vendite_Testata             | Entità    | 500 - 5.000 / giorno / punto vendita     | Numero di scontrini/fatture emesse                   |
| Vendite_Dettaglio           | Entità    | 3 - 15 righe / Vendita_Testata           | Media prodotti per scontrino                         |
| OrdiniFornitore_Testata     | Entità    | 10 - 50 / settimana / punto vendita      | Numero di ordini ai fornitori                        |
| OrdiniFornitore_Dettaglio   | Entità    | 5 - 50 righe / OrdineFornitore_Testata   | Media prodotti per ordine                            |
| Promozioni                  | Entità    | 20 - 100 attive contemporaneamente       | Numero di offerte speciali                           |
| Prodotti_Promozioni         | Relazione | 1 - 1000 prodotti / Promozione           | Quanti prodotti sono inclusi in una data promozione  |
| **Relazioni (Operazioni)**  |           |                                          |                                                      |
| Registra_Vendita            | Relazione | Come Vendite_Testata                     | Ogni vendita è una registrazione                     |
| Dettaglia_Vendita           | Relazione | Come Vendite_Dettaglio                   | Ogni riga di vendita è un dettaglio                  |
| Emette_Ordine               | Relazione | Come OrdiniFornitore_Testata             | Ogni ordine è un'emissione                           |
| Ricezione_Merce_Lotto       | Operazione| Frequenza legata agli arrivi (simile a Ordini_Dettaglio) | Creazione/aggiornamento lotti                      |

### Volume delle frequenze (Operazioni Principali):

| Operazione                                       | Descrizione                                                                        | Frequenza Stimata (per Punto Vendita) | Tipo (I: Interattiva, B: Batch) |
|--------------------------------------------------|------------------------------------------------------------------------------------|---------------------------------------|---------------------------------|
| Inserimento nuovo Prodotto (raro dopo setup iniziale) | Aggiunta di un nuovo articolo al catalogo generale.                               | 5-20 / mese                           | I                               |
| Modifica dati Prodotto (prezzo, descrizione)     | Aggiornamento informazioni di un prodotto esistente.                                | 10-100 / giorno                       | I                               |
| Carico Merce / Creazione Lotto                   | Registrazione arrivo merci da fornitore, creazione/aggiornamento lotti e giacenze. | 5-30 / giorno                         | I / B (se da import bolla)      |
| Registrazione Vendita (Scontrino)                | Processo di cassa: scansione prodotti, calcolo totale, pagamento.                  | 500-5000 / giorno                     | I (alta frequenza)              |
| Generazione Fattura (su richiesta)               | Emissione documento fiscale per cliente.                                           | 10-100 / giorno                       | I                               |
| Registrazione Cliente                            | Inserimento nuovo cliente nel database (es. per fidelity card).                    | 5-50 / giorno                         | I                               |
| Consultazione Inventario Prodotto                | Verifica disponibilità e dettagli di un prodotto.                                  | 50-200 / giorno                       | I                               |
| Report Prodotti in Scadenza                      | Estrazione lista prodotti vicini alla data di scadenza.                            | 1-2 / giorno                          | B / I                           |
| Report Vendite (giornaliero, settimanale)        | Analisi delle vendite per periodo, prodotto, categoria.                            | 1-5 / giorno                          | B / I                           |
| Creazione Ordine a Fornitore                     | Preparazione e invio ordine per rifornimento scorte.                               | 2-10 / giorno                         | I                               |
| Aggiornamento Stato Ordine Fornitore             | Modifica stato ordine (es. da "Inviato" a "Ricevuto Parzialmente").                | 5-20 / settimana                      | I                               |
| Applicazione Promozione a Prodotti               | Definizione di quali prodotti sono inclusi in una nuova promozione.                 | 1-5 / settimana                       | I                               |
| Ricerca Cliente (per fidelity o storico acquisti)| Trovare un cliente registrato.                                                     | 20-100 / giorno                       | I                               |
| Stampa Etichette Scaffale/Prodotto               | Generazione etichette con prezzi e codici a barre.                                 | 1-2 / settimana (o al bisogno)        | B / I                           |
| Chiusura Cassa Giornaliera                       | Operazione di fine giornata per ogni cassa/operatore.                              | Numero casse / giorno                 | I / B                           |

---

## 8. Analisi delle ridondanze:

Grazie all'approccio di normalizzazione seguito durante la progettazione concettuale e logica (identificazione di entità distinte, uso di chiavi primarie ed esterne, risoluzione di relazioni N:M con tabelle associative), la base di dati è stata concepita per minimizzare le ridondanze dannose (quelle che portano a inconsistenza).

Tuttavia, si possono considerare alcune ridondanze controllate per ottimizzare le prestazioni di specifiche query:

*   **ID_Prodotto in Vendite_Dettaglio:**
    *   **Analisi senza ridondanza:** Per ottenere l'ID del prodotto venduto, si dovrebbe fare un join Vendite_Dettaglio -> LottiProdotto_Stock -> Prodotti.
    *   **Analisi con ridondanza:** Includere ID_Prodotto direttamente in Vendite_Dettaglio (oltre a ID_Lotto).
    *   **Vantaggio:** Semplifica e velocizza le query che necessitano solo dell'ID prodotto dalla riga di vendita (es. report vendite per prodotto) evitando un join.
    *   **Svantaggio:** Leggero aumento dello spazio disco. È fondamentale garantire la coerenza: l'ID_Prodotto in Vendite_Dettaglio deve sempre corrispondere a quello del ID_Lotto referenziato. Questo può essere gestito a livello applicativo o con trigger.
    *   **Decisione:** Introdurre la ridondanza controllata. Il beneficio prestazionale per query frequenti sulle vendite giustifica la complessità aggiuntiva minima per il mantenimento della coerenza.

*   **NomeCategoria in Prodotti (invece di solo ID_Categoria):**
    *   **Analisi senza ridondanza:** Per visualizzare il nome della categoria di un prodotto, si fa un join Prodotti -> CategorieProdotto.
    *   **Analisi con ridondanza:** Aggiungere NomeCategoria a Prodotti.
    *   **Vantaggio:** Evita un join per la visualizzazione semplice del nome categoria.
    *   **Svantaggio:** Rischio di inconsistenza se il nome della categoria cambia in CategorieProdotto e non viene aggiornato in tutte le occorrenze in Prodotti. Richiede trigger o logica applicativa per la sincronizzazione.
    *   **Decisione:** Non introdurre questa ridondanza. Il join su ID_Categoria è generalmente performante su tabelle ben indicizzate e il rischio di inconsistenza è più alto. L'entità CategorieProdotto non ha un volume elevatissimo.

*   **Denormalizzazione per reportistica complessa (Data Warehouse):**
    *   Per analisi molto complesse e storiche (Business Intelligence), si potrebbe considerare la creazione di tabelle denormalizzate (star schema o snowflake schema) in un ambiente separato (Data Warehouse) popolato periodicamente dal database operativo. Questo esula dalla progettazione del DB transazionale primario ma è una considerazione per esigenze future di analisi avanzata.
    *   **Decisione:** Non implementare nel DB operativo. Mantenere il DB operativo normalizzato per l'efficienza transazionale.

### Conclusione sull'analisi delle ridondanze:
Si opta per una ridondanza controllata minima e mirata (ID_Prodotto in Vendite_Dettaglio) per migliorare le prestazioni di query critiche, mantenendo per il resto uno schema prevalentemente normalizzato per garantire integrità e flessibilità.