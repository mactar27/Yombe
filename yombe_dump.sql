-- MySQL dump 10.13  Distrib 8.0.43, for macos15 (x86_64)
--
-- Host: localhost    Database: Yombe
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
INSERT INTO `contact_messages` VALUES (1,'Test',NULL,'test@yombe.sn','+221771234567',NULL,'Message de test depuis lAPI','2026-06-18 15:58:17');
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jersey_orders`
--

DROP TABLE IF EXISTS `jersey_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jersey_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `player_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `with_logo` tinyint(1) DEFAULT '0',
  `details` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jersey_orders`
--

LOCK TABLES `jersey_orders` WRITE;
/*!40000 ALTER TABLE `jersey_orders` DISABLE KEYS */;
INSERT INTO `jersey_orders` VALUES (1,'Maillot col rond','Or','DIALLO','10',1,'Commande test - 15 maillots taille M','2026-06-18 15:58:33');
/*!40000 ALTER TABLE `jersey_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `quantity` int NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL,
  `status` enum('pending','paid','shipped','delivered','cancelled') DEFAULT 'pending',
  `total` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int NOT NULL,
  `old_price` int DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `audience` json DEFAULT NULL,
  `sizes` json DEFAULT NULL,
  `colors` json DEFAULT NULL,
  `image` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_new` tinyint(1) DEFAULT '0',
  `is_promo` tinyint(1) DEFAULT '0',
  `in_stock` tinyint(1) DEFAULT '1',
  `rating` tinyint DEFAULT '5',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('ballon-match-officiel','Ballon de Match Officiel',12000,NULL,'Ballon taille 5 cousu main, parfait pour les matchs et entraînements.','Ballons','[\"football\", \"accessoires\"]','[\"Taille 5\"]','[\"Blanc\", \"Or\"]','/placeholder.svg?height=600&width=480',0,0,1,5),('casquette-brodee','Casquette Brodée Signature',6000,NULL,'Casquette ajustable avec broderie dorée, finition haut de gamme.','Casquettes','[\"homme\", \"femme\", \"accessoires\"]','[\"Unique\"]','[\"Noir\", \"Or\", \"Blanc\"]','/placeholder.svg?height=600&width=480',1,0,1,5),('chaussures-football-pro','Chaussures de Football Pro',25000,NULL,'Crampons légers et stables pour une accroche optimale sur gazon.','Chaussures de football','[\"football\", \"homme\"]','[\"40\", \"41\", \"42\", \"43\", \"44\"]','[\"Noir\", \"Or\"]','/placeholder.svg?height=600&width=480',0,0,1,4),('chemise-lin-premium','Chemise Lin Premium',14000,NULL,'Chemise en lin élégante et respirante pour un style raffiné au quotidien.','Chemises','[\"homme\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Blanc\", \"Beige\", \"Noir\"]','/placeholder.svg?height=600&width=480',1,0,1,4),('ensemble-survetement','Ensemble Survêtement Lifestyle',21000,26000,'Ensemble confortable et tendance, parfait pour le sport et la détente.','Ensembles','[\"homme\", \"femme\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Noir\", \"Or\", \"Gris\"]','/placeholder.svg?height=600&width=480',0,1,1,5),('gants-gardien','Gants de Gardien Pro',11000,NULL,'Gants haute adhérence avec protection des doigts pour les gardiens exigeants.','Équipements de gardien','[\"football\"]','[\"8\", \"9\", \"10\", \"11\"]','[\"Noir\", \"Or\"]','/placeholder.svg?height=600&width=480',0,0,0,5),('jean-slim-premium','Jean Slim Premium',16000,NULL,'Jean coupe slim en denim stretch, confort et durabilité garantis.','Jeans','[\"homme\", \"femme\"]','[\"28\", \"30\", \"32\", \"34\", \"36\"]','[\"Bleu\", \"Noir\"]','/placeholder.svg?height=600&width=480',0,0,1,4),('kit-arbitre','Kit d\'Arbitrage Complet',9000,NULL,'Sifflet, cartons jaune et rouge, chronomètre et carnet pour l\'arbitre moderne.','Cartons jaunes et rouges','[\"football\", \"accessoires\"]','[\"Unique\"]','[\"Jaune\", \"Rouge\"]','/placeholder.svg?height=600&width=480',0,0,1,4),('lot-cones-entrainement','Lot de Cônes d\'Entraînement',7000,9000,'Set de 20 cônes et coupelles pour vos exercices d\'agilité et de vitesse.','Cônes d\'entraînement','[\"football\", \"accessoires\"]','[\"Lot de 20\"]','[\"Multicolore\"]','/placeholder.svg?height=600&width=480',0,1,1,4),('maillot-club-domicile','Maillot Club Domicile 2026',18000,22000,'Maillot officiel respirant, coupe athlétique pour le terrain comme la ville.','Maillots de clubs','[\"football\", \"homme\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Or\", \"Noir\", \"Blanc\"]','/placeholder.svg?height=600&width=480',0,1,1,5),('maillot-perso-equipe','Maillot Personnalisé Équipe',15000,NULL,'Maillot sublimé avec nom, numéro et logo de votre choix. Idéal pour les clubs.','Maillots personnalisés','[\"football\"]','[\"S\", \"M\", \"L\", \"XL\", \"XXL\"]','[\"Or\", \"Noir\", \"Rouge\", \"Bleu\"]','/placeholder.svg?height=600&width=480',1,0,1,5),('veste-bomber','Veste Bomber Élégante',23000,NULL,'Veste bomber structurée, doublure premium et finitions dorées discrètes.','Vestes','[\"homme\", \"femme\"]','[\"S\", \"M\", \"L\", \"XL\"]','[\"Noir\", \"Vert\", \"Or\"]','/placeholder.svg?height=600&width=480',0,0,1,5);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quote` text COLLATE utf8mb4_unicode_ci,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` tinyint DEFAULT '5',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'Awa Diédhiou','Cliente fidèle, Ziguinchor','Des vêtements de qualité et un service impeccable. Je trouve toujours mon bonheur chez Yombe Ctyi 313 !','/placeholder.svg?height=120&width=120',5),(2,'Modou Sané','Coach, Académie Casa Foot','Nous avons commandé les maillots personnalisés de toute l\'académie. Rendu magnifique et livraison rapide.','/placeholder.svg?height=120&width=120',5),(3,'Fatou Mendy','Étudiante','Les prix sont compétitifs et le style est vraiment premium. Mon ensemble survêtement est parfait.','/placeholder.svg?height=120&width=120',5);
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','client') DEFAULT 'client',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Admin','admin@yombe.com','$2b$10$T8w8OP5B9jc1QCqgTfHvaeKQHpGC7I5GtmYmDWe39Y4rCh4c24LQK','admin','2026-06-18 16:55:01');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-18 19:02:53
