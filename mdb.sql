-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: mdb
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clienti`
--

DROP TABLE IF EXISTS `clienti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clienti` (
  `ID_Cliente` int NOT NULL AUTO_INCREMENT,
  `Nome` varchar(100) DEFAULT NULL,
  `Cognome` varchar(100) DEFAULT NULL,
  `CodiceFiscale_Cli` varchar(16) DEFAULT NULL,
  `PartitaIVA_Cli` varchar(20) DEFAULT NULL,
  `Indirizzo_Cli` varchar(255) DEFAULT NULL,
  `Citta_Cli` varchar(100) DEFAULT NULL,
  `CAP_Cli` varchar(10) DEFAULT NULL,
  `Provincia_Cli` varchar(50) DEFAULT NULL,
  `Email_Cli` varchar(100) DEFAULT NULL,
  `Telefono_Cli` varchar(30) DEFAULT NULL,
  `DataRegistrazione` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID_Cliente`),
  UNIQUE KEY `CodiceFiscale_Cli` (`CodiceFiscale_Cli`),
  UNIQUE KEY `PartitaIVA_Cli` (`PartitaIVA_Cli`),
  UNIQUE KEY `Email_Cli` (`Email_Cli`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clienti`
--

LOCK TABLES `clienti` WRITE;
/*!40000 ALTER TABLE `clienti` DISABLE KEYS */;
INSERT INTO `clienti` VALUES (1,'Anna','Neri',NULL,NULL,NULL,NULL,NULL,NULL,'anna.neri@email.com',NULL,'2025-06-17 09:33:32'),(2,'Giovanni','Gialli',NULL,NULL,NULL,NULL,NULL,NULL,'gio.gialli@email.com',NULL,'2025-06-17 09:33:32');
/*!40000 ALTER TABLE `clienti` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornitori`
--

DROP TABLE IF EXISTS `fornitori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornitori` (
  `ID_Fornitore` int NOT NULL AUTO_INCREMENT,
  `RagioneSociale` varchar(255) NOT NULL,
  `PartitaIVA_F` varchar(20) DEFAULT NULL,
  `Indirizzo_F` varchar(255) DEFAULT NULL,
  `Citta_F` varchar(100) DEFAULT NULL,
  `CAP_F` varchar(10) DEFAULT NULL,
  `Provincia_F` varchar(50) DEFAULT NULL,
  `Email_F` varchar(100) DEFAULT NULL,
  `Telefono_F` varchar(30) DEFAULT NULL,
  `Referente_F` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Fornitore`),
  UNIQUE KEY `RagioneSociale` (`RagioneSociale`),
  UNIQUE KEY `PartitaIVA_F` (`PartitaIVA_F`),
  UNIQUE KEY `Email_F` (`Email_F`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornitori`
--

LOCK TABLES `fornitori` WRITE;
/*!40000 ALTER TABLE `fornitori` DISABLE KEYS */;
INSERT INTO `fornitori` VALUES (1,'Salumi & Formaggi S.p.A.',NULL,NULL,NULL,NULL,NULL,'info@salumieformaggi.it',NULL,'Franco Grossi'),(2,'Ortofrutta Fresca S.r.l.',NULL,NULL,NULL,NULL,NULL,'ordini@ortofrutta.it',NULL,'Laura Ortolani'),(3,'Panificio del Borgo',NULL,NULL,NULL,NULL,NULL,'panificio.borgo@email.it',NULL,'Roberto Fornai');
/*!40000 ALTER TABLE `fornitori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lottiprodotto_stock`
--

DROP TABLE IF EXISTS `lottiprodotto_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lottiprodotto_stock` (
  `ID_Lotto` int NOT NULL AUTO_INCREMENT,
  `ID_Prodotto` int NOT NULL,
  `ID_PuntoVendita` int NOT NULL,
  `DataCarico` date NOT NULL,
  `DataScadenza` date DEFAULT NULL,
  `QuantitaIniziale` int NOT NULL,
  `QuantitaAttuale` int NOT NULL,
  `CostoAcquistoUnitario` decimal(10,2) DEFAULT NULL,
  `ID_OrdineFornitore_Dettaglio` int DEFAULT NULL,
  PRIMARY KEY (`ID_Lotto`),
  UNIQUE KEY `ID_OrdineFornitore_Dettaglio` (`ID_OrdineFornitore_Dettaglio`),
  KEY `fk_lottiprodottostock_prodotti` (`ID_Prodotto`),
  KEY `fk_lottiprodottostock_puntivendita` (`ID_PuntoVendita`),
  CONSTRAINT `fk_lottiprodottostock_ordinifornitoredettaglio` FOREIGN KEY (`ID_OrdineFornitore_Dettaglio`) REFERENCES `ordinifornitore_dettaglio` (`ID_OrdineFornitore_Dettaglio`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_lottiprodottostock_prodotti` FOREIGN KEY (`ID_Prodotto`) REFERENCES `prodotti` (`ID_Prodotto`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_lottiprodottostock_puntivendita` FOREIGN KEY (`ID_PuntoVendita`) REFERENCES `puntivendita` (`ID_PuntoVendita`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lottiprodotto_stock`
--

LOCK TABLES `lottiprodotto_stock` WRITE;
/*!40000 ALTER TABLE `lottiprodotto_stock` DISABLE KEYS */;
INSERT INTO `lottiprodotto_stock` VALUES (101,1,1,'2023-10-27','2023-11-15',10,9,18.00,1),(102,2,1,'2023-10-27','2023-11-05',20,20,9.50,2),(103,3,1,'2023-10-26','2023-11-10',50,50,1.20,NULL),(104,4,1,'2023-10-27','2023-10-30',30,30,2.50,NULL);
/*!40000 ALTER TABLE `lottiprodotto_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordinifornitore_dettaglio`
--

DROP TABLE IF EXISTS `ordinifornitore_dettaglio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordinifornitore_dettaglio` (
  `ID_OrdineFornitore_Dettaglio` int NOT NULL AUTO_INCREMENT,
  `ID_OrdineFornitore` int NOT NULL,
  `ID_Prodotto` int NOT NULL,
  `QuantitaOrdinata` int NOT NULL,
  `CostoUnitarioPrevisto` decimal(10,2) DEFAULT NULL,
  `QuantitaRicevuta` int DEFAULT NULL,
  PRIMARY KEY (`ID_OrdineFornitore_Dettaglio`),
  UNIQUE KEY `ID_OrdineFornitore` (`ID_OrdineFornitore`,`ID_Prodotto`),
  KEY `fk_ordinifornitoredettaglio_prodotti` (`ID_Prodotto`),
  CONSTRAINT `fk_ordinifornitoredettaglio_ordinifornitoretestata` FOREIGN KEY (`ID_OrdineFornitore`) REFERENCES `ordinifornitore_testata` (`ID_OrdineFornitore`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ordinifornitoredettaglio_prodotti` FOREIGN KEY (`ID_Prodotto`) REFERENCES `prodotti` (`ID_Prodotto`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordinifornitore_dettaglio`
--

LOCK TABLES `ordinifornitore_dettaglio` WRITE;
/*!40000 ALTER TABLE `ordinifornitore_dettaglio` DISABLE KEYS */;
INSERT INTO `ordinifornitore_dettaglio` VALUES (1,1,1,10,18.00,10),(2,1,2,20,9.50,20),(3,3,1,5,18.00,NULL);
/*!40000 ALTER TABLE `ordinifornitore_dettaglio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordinifornitore_testata`
--

DROP TABLE IF EXISTS `ordinifornitore_testata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordinifornitore_testata` (
  `ID_OrdineFornitore` int NOT NULL AUTO_INCREMENT,
  `ID_Fornitore` int NOT NULL,
  `ID_PuntoVenditaDestinazione` int NOT NULL,
  `DataOrdine` date NOT NULL,
  `DataConsegnaPrevista` date DEFAULT NULL,
  `DataConsegnaEffettiva` date DEFAULT NULL,
  `StatoOrdine` varchar(50) NOT NULL DEFAULT 'Bozza',
  `TotaleOrdineStimato` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`ID_OrdineFornitore`),
  KEY `fk_ordinifornitoretestata_fornitori` (`ID_Fornitore`),
  KEY `fk_ordinifornitoretestata_puntivendita` (`ID_PuntoVenditaDestinazione`),
  KEY `idx_ordinifornitoretestata_statordine` (`StatoOrdine`),
  CONSTRAINT `fk_ordinifornitoretestata_fornitori` FOREIGN KEY (`ID_Fornitore`) REFERENCES `fornitori` (`ID_Fornitore`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ordinifornitoretestata_puntivendita` FOREIGN KEY (`ID_PuntoVenditaDestinazione`) REFERENCES `puntivendita` (`ID_PuntoVendita`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordinifornitore_testata`
--

LOCK TABLES `ordinifornitore_testata` WRITE;
/*!40000 ALTER TABLE `ordinifornitore_testata` DISABLE KEYS */;
INSERT INTO `ordinifornitore_testata` VALUES (1,1,1,'2023-10-25','2023-10-27',NULL,'Ricevuto Completamente',NULL),(2,2,1,'2023-10-26','2023-10-26',NULL,'Inviato',NULL),(3,1,1,'2025-06-17','2025-06-19',NULL,'Bozza',NULL);
/*!40000 ALTER TABLE `ordinifornitore_testata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prodotti`
--

DROP TABLE IF EXISTS `prodotti`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prodotti` (
  `ID_Prodotto` int NOT NULL AUTO_INCREMENT,
  `CodiceBarre` varchar(50) NOT NULL,
  `NomeProdotto` varchar(255) NOT NULL,
  `Descrizione` text,
  `ID_Categoria` int NOT NULL,
  `ID_FornitorePreferenziale` int DEFAULT NULL,
  `PrezzoUnitarioVendita` decimal(10,2) NOT NULL,
  `AliquotaIVA` decimal(4,2) NOT NULL,
  PRIMARY KEY (`ID_Prodotto`),
  UNIQUE KEY `CodiceBarre` (`CodiceBarre`),
  KEY `fk_prodotti_categoriaprodotto` (`ID_Categoria`),
  KEY `fk_prodotti_fornitori` (`ID_FornitorePreferenziale`),
  CONSTRAINT `fk_prodotti_categoriaprodotto` FOREIGN KEY (`ID_Categoria`) REFERENCES `categorieprodotto` (`ID_Categoria`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_prodotti_fornitori` FOREIGN KEY (`ID_FornitorePreferenziale`) REFERENCES `fornitori` (`ID_Fornitore`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prodotti`
--

LOCK TABLES `prodotti` WRITE;
/*!40000 ALTER TABLE `prodotti` DISABLE KEYS */;
INSERT INTO `prodotti` VALUES (1,'8001234567890','Prosciutto Cotto Alta Qualità',NULL,1,1,25.50,0.10),(2,'8009876543210','Mozzarella di Bufala DOP',NULL,2,1,13.90,0.04),(3,'8001122334455','Mele Golden',NULL,3,2,2.50,0.04),(4,'8005566778899','Pagnotta Integrale',NULL,4,3,4.00,0.04),(5,'8001112223334','Pecorino Sardo Stagionato',NULL,2,1,19.99,0.04);
/*!40000 ALTER TABLE `prodotti` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `After_Prodotto_Update_Log_Prezzo` AFTER UPDATE ON `prodotti` FOR EACH ROW BEGIN
    IF OLD.PrezzoUnitarioVendita <> NEW.PrezzoUnitarioVendita THEN
        INSERT INTO LogPrezzi (ID_Prodotto, VecchioPrezzo, NuovoPrezzo, UtenteModifica)
        VALUES (OLD.ID_Prodotto, OLD.PrezzoUnitarioVendita, NEW.PrezzoUnitarioVendita, USER());
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `prodotti_promozioni`
--

DROP TABLE IF EXISTS `prodotti_promozioni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prodotti_promozioni` (
  `ID_ProdottoPromozione` int NOT NULL AUTO_INCREMENT,
  `ID_Promozione` int NOT NULL,
  `ID_Prodotto` int NOT NULL,
  PRIMARY KEY (`ID_ProdottoPromozione`),
  UNIQUE KEY `ID_Promozione` (`ID_Promozione`,`ID_Prodotto`),
  KEY `fk_prodottipromozioni_prodotti` (`ID_Prodotto`),
  CONSTRAINT `fk_prodottipromozioni_prodotti` FOREIGN KEY (`ID_Prodotto`) REFERENCES `prodotti` (`ID_Prodotto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_prodottipromozioni_promozioni` FOREIGN KEY (`ID_Promozione`) REFERENCES `promozioni` (`ID_Promozione`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prodotti_promozioni`
--

LOCK TABLES `prodotti_promozioni` WRITE;
/*!40000 ALTER TABLE `prodotti_promozioni` DISABLE KEYS */;
INSERT INTO `prodotti_promozioni` VALUES (1,1,2);
/*!40000 ALTER TABLE `prodotti_promozioni` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promozioni`
--

DROP TABLE IF EXISTS `promozioni`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promozioni` (
  `ID_Promozione` int NOT NULL AUTO_INCREMENT,
  `NomePromozione` varchar(150) NOT NULL,
  `DescrizionePromozione` text,
  `DataInizio` date NOT NULL,
  `DataFine` date NOT NULL,
  `TipoPromozione` varchar(50) DEFAULT NULL,
  `ValoreSconto` decimal(10,2) DEFAULT NULL,
  `Condizioni` text,
  PRIMARY KEY (`ID_Promozione`),
  UNIQUE KEY `NomePromozione` (`NomePromozione`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promozioni`
--

LOCK TABLES `promozioni` WRITE;
/*!40000 ALTER TABLE `promozioni` DISABLE KEYS */;
INSERT INTO `promozioni` VALUES (1,'Sconto Latticini 20%',NULL,'2023-10-20','2023-10-31','Percentuale',0.20,NULL);
/*!40000 ALTER TABLE `promozioni` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntivendita`
--

DROP TABLE IF EXISTS `puntivendita`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntivendita` (
  `ID_PuntoVendita` int NOT NULL AUTO_INCREMENT,
  `NomePuntoVendita` varchar(150) NOT NULL,
  `Indirizzo_PV` varchar(255) DEFAULT NULL,
  `Citta_PV` varchar(100) DEFAULT NULL,
  `CAP_PV` varchar(10) DEFAULT NULL,
  `Provincia_PV` varchar(50) DEFAULT NULL,
  `Telefono_PV` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`ID_PuntoVendita`),
  UNIQUE KEY `NomePuntoVendita` (`NomePuntoVendita`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntivendita`
--

LOCK TABLES `puntivendita` WRITE;
/*!40000 ALTER TABLE `puntivendita` DISABLE KEYS */;
INSERT INTO `puntivendita` VALUES (1,'Supermercato Centro','Via Roma 10','Milano','20121','MI',NULL),(2,'Supermercato Periferia','Viale dei Tigli 55','Roma','00152','RM',NULL);
/*!40000 ALTER TABLE `puntivendita` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_inventariocompleto`
--

DROP TABLE IF EXISTS `v_inventariocompleto`;
/*!50001 DROP VIEW IF EXISTS `v_inventariocompleto`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_inventariocompleto` AS SELECT 
 1 AS `ID_Prodotto`,
 1 AS `NomeProdotto`,
 1 AS `CodiceBarre`,
 1 AS `NomeCategoria`,
 1 AS `ID_PuntoVendita`,
 1 AS `GiacenzaTotale`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_prodottiinscadenza`
--

DROP TABLE IF EXISTS `v_prodottiinscadenza`;
/*!50001 DROP VIEW IF EXISTS `v_prodottiinscadenza`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_prodottiinscadenza` AS SELECT 
 1 AS `NomeProdotto`,
 1 AS `QuantitaAttuale`,
 1 AS `DataScadenza`,
 1 AS `ID_PuntoVendita`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_reportvenditegiornaliero`
--

DROP TABLE IF EXISTS `v_reportvenditegiornaliero`;
/*!50001 DROP VIEW IF EXISTS `v_reportvenditegiornaliero`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_reportvenditegiornaliero` AS SELECT 
 1 AS `GiornoVendita`,
 1 AS `ID_PuntoVendita`,
 1 AS `NomeProdotto`,
 1 AS `NomeCategoria`,
 1 AS `TotaleQuantitaVenduta`,
 1 AS `IncassoTotaleImponibile`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `vendite_dettaglio`
--

DROP TABLE IF EXISTS `vendite_dettaglio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendite_dettaglio` (
  `ID_Vendita_Dettaglio` int NOT NULL AUTO_INCREMENT,
  `ID_Vendita` int NOT NULL,
  `ID_Lotto` int NOT NULL,
  `ID_Prodotto` int NOT NULL,
  `QuantitaVenduta` int NOT NULL,
  `PrezzoUnitarioApplicato` decimal(10,2) NOT NULL,
  `AliquotaIVAApplicata` decimal(4,2) NOT NULL,
  `SubtotaleRiga` decimal(10,2) NOT NULL,
  `ID_PromozioneApplicata` int DEFAULT NULL,
  PRIMARY KEY (`ID_Vendita_Dettaglio`),
  UNIQUE KEY `ID_Vendita` (`ID_Vendita`,`ID_Lotto`),
  KEY `fk_venditedettaglio_lottiprodottostock` (`ID_Lotto`),
  KEY `fk_venditedettaglio_prodotti_redundant` (`ID_Prodotto`),
  KEY `fk_venditedettaglio_promozioni` (`ID_PromozioneApplicata`),
  CONSTRAINT `fk_venditedettaglio_lottiprodottostock` FOREIGN KEY (`ID_Lotto`) REFERENCES `lottiprodotto_stock` (`ID_Lotto`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_venditedettaglio_prodotti_redundant` FOREIGN KEY (`ID_Prodotto`) REFERENCES `prodotti` (`ID_Prodotto`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_venditedettaglio_promozioni` FOREIGN KEY (`ID_PromozioneApplicata`) REFERENCES `promozioni` (`ID_Promozione`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_venditedettaglio_venditetestata` FOREIGN KEY (`ID_Vendita`) REFERENCES `vendite_testata` (`ID_Vendita`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendite_dettaglio`
--

LOCK TABLES `vendite_dettaglio` WRITE;
/*!40000 ALTER TABLE `vendite_dettaglio` DISABLE KEYS */;
INSERT INTO `vendite_dettaglio` VALUES (1,1,101,1,1,25.50,0.10,25.50,NULL);
/*!40000 ALTER TABLE `vendite_dettaglio` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `Before_Vendita_Dettaglio_Insert` BEFORE INSERT ON `vendite_dettaglio` FOR EACH ROW BEGIN
    DECLARE quantita_disponibile DECIMAL(10,2);

    SELECT QuantitaAttuale INTO quantita_disponibile
    FROM LottiProdotto_Stock
    WHERE ID_Lotto = NEW.ID_Lotto;

    IF quantita_disponibile < NEW.QuantitaVenduta THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Quantità non disponibile in magazzino per questo lotto.';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `Before_Vendita_Dettaglio_Insert_Calc` BEFORE INSERT ON `vendite_dettaglio` FOR EACH ROW BEGIN
    -- Calcola il subtotale della riga
    SET NEW.SubtotaleRiga = NEW.QuantitaVenduta * NEW.PrezzoUnitarioApplicato;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `After_Vendita_Dettaglio_Insert` AFTER INSERT ON `vendite_dettaglio` FOR EACH ROW BEGIN
    UPDATE LottiProdotto_Stock
    SET QuantitaAttuale = QuantitaAttuale - NEW.QuantitaVenduta
    WHERE ID_Lotto = NEW.ID_Lotto;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `After_Vendita_Dettaglio_Insert_Update_Testata` AFTER INSERT ON `vendite_dettaglio` FOR EACH ROW BEGIN
    DECLARE imponibile DECIMAL(12,2);
    DECLARE iva DECIMAL(12,2);
    
    SET imponibile = NEW.SubtotaleRiga;
    SET iva = NEW.SubtotaleRiga * NEW.AliquotaIVAApplicata;

    UPDATE Vendite_Testata
    SET
        TotaleImponibile = TotaleImponibile + imponibile,
        TotaleIVA = TotaleIVA + iva,
        TotaleVendita = TotaleVendita + imponibile + iva
    WHERE ID_Vendita = NEW.ID_Vendita;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `vendite_testata`
--

DROP TABLE IF EXISTS `vendite_testata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendite_testata` (
  `ID_Vendita` int NOT NULL AUTO_INCREMENT,
  `ID_PuntoVendita` int NOT NULL,
  `ID_Cliente` int DEFAULT NULL,
  `ID_Operatore` int DEFAULT NULL,
  `DataOraVendita` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `NumeroScontrinoFiscale` varchar(50) DEFAULT NULL,
  `NumeroFattura` varchar(50) DEFAULT NULL,
  `TotaleImponibile` decimal(12,2) NOT NULL,
  `TotaleIVA` decimal(12,2) NOT NULL,
  `TotaleVendita` decimal(12,2) NOT NULL,
  `MetodoPagamento` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID_Vendita`),
  UNIQUE KEY `NumeroScontrinoFiscale` (`NumeroScontrinoFiscale`),
  UNIQUE KEY `NumeroFattura` (`NumeroFattura`),
  KEY `fk_venditetestata_puntivendita` (`ID_PuntoVendita`),
  KEY `fk_venditetestata_clienti` (`ID_Cliente`),
  KEY `fk_venditetestata_operatori` (`ID_Operatore`),
  CONSTRAINT `fk_venditetestata_clienti` FOREIGN KEY (`ID_Cliente`) REFERENCES `clienti` (`ID_Cliente`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_venditetestata_operatori` FOREIGN KEY (`ID_Operatore`) REFERENCES `operatori` (`ID_Operatore`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_venditetestata_puntivendita` FOREIGN KEY (`ID_PuntoVendita`) REFERENCES `puntivendita` (`ID_PuntoVendita`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendite_testata`
--

LOCK TABLES `vendite_testata` WRITE;
/*!40000 ALTER TABLE `vendite_testata` DISABLE KEYS */;
INSERT INTO `vendite_testata` VALUES (1,1,2,1,'2025-06-17 09:49:28',NULL,NULL,25.50,2.55,28.05,NULL);
/*!40000 ALTER TABLE `vendite_testata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'mdb'
--

--
-- Dumping routines for database 'mdb'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_AggiornaStatoOrdine` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_AggiornaStatoOrdine`(
    IN p_ID_OrdineFornitore INT,
    IN p_NuovoStato VARCHAR(50)
)
BEGIN
    UPDATE OrdiniFornitore_Testata
    SET StatoOrdine = p_NuovoStato
    WHERE ID_OrdineFornitore = p_ID_OrdineFornitore;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_AggiungiProdottoAScontrino` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_AggiungiProdottoAScontrino`(
    IN p_ID_Vendita INT,
    IN p_ID_Lotto INT,
    IN p_QuantitaVenduta DECIMAL(10,2)
)
BEGIN
    DECLARE v_ID_Prodotto INT;
    DECLARE v_PrezzoUnitario DECIMAL(10,2);
    DECLARE v_AliquotaIVA DECIMAL(4,2);

    SELECT ID_Prodotto INTO v_ID_Prodotto FROM LottiProdotto_Stock WHERE ID_Lotto = p_ID_Lotto;
    SELECT PrezzoUnitarioVendita, AliquotaIVA INTO v_PrezzoUnitario, v_AliquotaIVA FROM Prodotti WHERE ID_Prodotto = v_ID_Prodotto;
    
    INSERT INTO Vendite_Dettaglio (ID_Vendita, ID_Lotto, ID_Prodotto, QuantitaVenduta, PrezzoUnitarioApplicato, AliquotaIVAApplicata)
    VALUES (p_ID_Vendita, p_ID_Lotto, v_ID_Prodotto, p_QuantitaVenduta, v_PrezzoUnitario, v_AliquotaIVA);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_CreaOrdineFornitore` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_CreaOrdineFornitore`(
    IN p_ID_Fornitore INT,
    IN p_ID_PuntoVendita INT,
    IN p_ID_Prodotto INT,
    IN p_QuantitaOrdinata INT
)
BEGIN
    DECLARE v_id_ordine INT;
    DECLARE v_costo_previsto DECIMAL(10,2);

    SELECT CostoAcquistoUnitario INTO v_costo_previsto
    FROM LottiProdotto_Stock
    WHERE ID_Prodotto = p_ID_Prodotto
    ORDER BY DataCarico DESC LIMIT 1;
    
    START TRANSACTION;
    
    INSERT INTO OrdiniFornitore_Testata (ID_Fornitore, ID_PuntoVenditaDestinazione, DataOrdine, DataConsegnaPrevista, StatoOrdine)
    VALUES (p_ID_Fornitore, p_ID_PuntoVendita, CURDATE(), CURDATE() + INTERVAL 2 DAY, 'Bozza');
    
    SET v_id_ordine = LAST_INSERT_ID();
    
    INSERT INTO OrdiniFornitore_Dettaglio (ID_OrdineFornitore, ID_Prodotto, QuantitaOrdinata, CostoUnitarioPrevisto)
    VALUES (v_id_ordine, p_ID_Prodotto, p_QuantitaOrdinata, v_costo_previsto);
    
    COMMIT;
    
    SELECT v_id_ordine AS ID_NuovoOrdine;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_RegistraNuovaVendita` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_RegistraNuovaVendita`(
    IN p_ID_PuntoVendita INT,
    IN p_ID_Cliente INT,
    IN p_ID_Operatore INT,
    OUT p_ID_NuovaVendita INT  -- Parametro di output per restituire l'ID
)
BEGIN
    INSERT INTO Vendite_Testata (ID_PuntoVendita, ID_Cliente, ID_Operatore, TotaleImponibile, TotaleIVA, TotaleVendita)
    VALUES (p_ID_PuntoVendita, p_ID_Cliente, p_ID_Operatore, 0, 0, 0);

    SET p_ID_NuovaVendita = LAST_INSERT_ID();
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `v_inventariocompleto`
--

/*!50001 DROP VIEW IF EXISTS `v_inventariocompleto`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_inventariocompleto` AS select `p`.`ID_Prodotto` AS `ID_Prodotto`,`p`.`NomeProdotto` AS `NomeProdotto`,`p`.`CodiceBarre` AS `CodiceBarre`,`c`.`NomeCategoria` AS `NomeCategoria`,`l`.`ID_PuntoVendita` AS `ID_PuntoVendita`,sum(`l`.`QuantitaAttuale`) AS `GiacenzaTotale` from ((`lottiprodotto_stock` `l` join `prodotti` `p` on((`l`.`ID_Prodotto` = `p`.`ID_Prodotto`))) join `categorieprodotto` `c` on((`p`.`ID_Categoria` = `c`.`ID_Categoria`))) where (`l`.`QuantitaAttuale` > 0) group by `p`.`ID_Prodotto`,`p`.`NomeProdotto`,`p`.`CodiceBarre`,`c`.`NomeCategoria`,`l`.`ID_PuntoVendita` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_prodottiinscadenza`
--

/*!50001 DROP VIEW IF EXISTS `v_prodottiinscadenza`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_prodottiinscadenza` AS select `p`.`NomeProdotto` AS `NomeProdotto`,`l`.`QuantitaAttuale` AS `QuantitaAttuale`,`l`.`DataScadenza` AS `DataScadenza`,`l`.`ID_PuntoVendita` AS `ID_PuntoVendita` from (`lottiprodotto_stock` `l` join `prodotti` `p` on((`l`.`ID_Prodotto` = `p`.`ID_Prodotto`))) where ((`l`.`DataScadenza` between curdate() and (curdate() + interval 7 day)) and (`l`.`QuantitaAttuale` > 0)) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_reportvenditegiornaliero`
--

/*!50001 DROP VIEW IF EXISTS `v_reportvenditegiornaliero`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_reportvenditegiornaliero` AS select cast(`vt`.`DataOraVendita` as date) AS `GiornoVendita`,`vt`.`ID_PuntoVendita` AS `ID_PuntoVendita`,`p`.`NomeProdotto` AS `NomeProdotto`,`c`.`NomeCategoria` AS `NomeCategoria`,sum(`vd`.`QuantitaVenduta`) AS `TotaleQuantitaVenduta`,sum(`vd`.`SubtotaleRiga`) AS `IncassoTotaleImponibile` from (((`vendite_dettaglio` `vd` join `prodotti` `p` on((`vd`.`ID_Prodotto` = `p`.`ID_Prodotto`))) join `vendite_testata` `vt` on((`vd`.`ID_Vendita` = `vt`.`ID_Vendita`))) join `categorieprodotto` `c` on((`p`.`ID_Categoria` = `c`.`ID_Categoria`))) group by `GiornoVendita`,`vt`.`ID_PuntoVendita`,`p`.`NomeProdotto`,`c`.`NomeCategoria` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-17 12:01:11
