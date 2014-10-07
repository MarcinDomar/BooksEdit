-- MySQL dump 10.13  Distrib 5.5.23, for Win32 (x86)
--
-- Host: localhost    Database: booksinfo
-- ------------------------------------------------------
-- Server version	5.5.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `books` (
  `author` varchar(128) CHARACTER SET latin1 DEFAULT NULL,
  `title` varchar(128) CHARACTER SET latin1 DEFAULT NULL,
  `year` smallint(6) DEFAULT NULL,
  `comment` text CHARACTER SET latin1,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `modifiedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `isDeleted` tinyint(3) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `modifiedDate` (`modifiedDate`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES ('Marcin Domarski','powieÄÅ¼ËÄÅ¼Ë o przemijaniu',2,'pozytywny komentarz',1,'2014-10-05 21:56:56',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'pozytywny komentarz',3,'2014-10-05 22:06:00',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'pozytywny komentarz',5,'2014-10-05 22:09:43',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'pozytywny komentarz',6,'2014-10-05 22:09:43',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'pozytywny komentarz',7,'2014-10-05 22:13:31',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'pozytywny komentarz',8,'2014-10-05 22:13:31',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'pozytywny komentarz',9,'2014-10-05 22:18:25',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'pozytywny komentarz',10,'2014-10-05 22:18:25',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'pozytywny komentarz',11,'2014-10-05 22:19:13',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'',12,'2014-10-05 22:19:13',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'',13,'2014-10-05 22:21:01',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,'',14,'2014-10-05 22:21:01',1),('Marcin','Domarski',1900,' 6',15,'2014-10-05 22:25:47',1),('Marcin','Domarski',1939,' 6',16,'2014-10-05 22:25:47',1),('Marcin1','Domarski1',1939,' 6VSA',17,'2014-10-05 22:26:33',1),('Marcin1','Domarski1',1939,'OIUOTIUIOUAWETT309485',18,'2014-10-05 22:26:33',1),('Marcin1','Domarski1',1939,'OIUOTIUIOUAWETT309485',19,'2014-10-06 06:02:38',1),('Marcin2','Domarski1',1939,'OIUOTIUIOUAWETT309485',20,'2014-10-06 06:02:38',1),('Marcin Domarski1','2',2001,' 3',21,'2014-10-06 07:28:16',1),('Marcin Domarski2','2',2001,' 3',22,'2014-10-06 07:28:16',1),('Marcin1','2',2001,' 3',23,'2014-10-06 08:22:47',1),('Marcin2','2',2001,' 3',24,'2014-10-06 08:22:47',1),('Marcin1','1',2001,' 1',25,'2014-10-06 08:24:35',1),('Marcin2','3',2001,' 1',26,'2014-10-06 08:24:35',1),('Marcin2','4',2001,' 1',27,'2014-10-06 08:26:21',1),('Marcin5','5',2001,' 1',28,'2014-10-06 08:26:21',1),('Marcin6','6',2001,' 1',29,'2014-10-06 08:42:49',1),('1Marcin','1 CoÅ› nowego',2001,' 1',30,'2014-10-07 10:25:49',1),('2Marcin','2',2001,' 1',31,'2014-10-06 11:25:24',1),('3Marcin','3',2002,' Komnentarz Nowy',32,'2014-10-06 11:29:03',1),('4Marcin Domarski','4powieÅ›Ä‡ o przemijaniu',1904,' Nowy Komentarz ',33,'2014-10-06 11:32:17',1),('5Marcin Domarski','5powieÅ›Ä‡ o przemijaniu',1909,' Nowy Komentarz 1909',34,'2014-10-06 11:42:37',1),('4Marcin','4',2000,' Nowy Rok 2000',35,'2014-10-06 11:50:24',1),('1Marcin Domarski','1powieÅ›Ä‡ o przemijaniu 1',1901,' Nowy Tytul rok  1901  1',36,'2014-10-06 11:59:24',1),('2Marcin Domarski Czubat','2powieÅ›Ä‡ o przemijaniu',1904,' Nowy Rok Czubat Nowy rok',37,'2014-10-06 12:36:47',1),('Marcin 1','2',1900,' Nowy',38,'2014-10-06 12:29:01',1),('Marcin 2','2',1900,' ',39,'2014-10-06 12:20:54',1),('Marcin 3','2',1900,' Nowy',40,'2014-10-06 12:29:01',1),('Marcin 4','2',1900,' Nowy Komentarz',41,'2014-10-06 12:36:47',1),('Marcin 5','2',1900,' ',42,'2014-10-06 12:38:32',1),('Marcin 6','2',1900,' ',43,'2014-10-06 12:38:32',1),('Marcin 7','2',1900,' ',44,'2014-10-06 12:45:21',1),('Marcin 8','2',1900,' ',45,'2014-10-06 12:45:21',1),('Marcin 9','2',1900,' ',46,'2014-10-06 12:59:49',1),('Marcin 10','2',1900,' ',47,'2014-10-06 12:59:49',1),('Marcin 11 CoÅ› Nowego','2',1900,' ',48,'2014-10-07 10:25:49',1),('Marcin Domarski1','powieÅ›Ä‡ o przemijaniu',2001,' ',49,'2014-10-07 10:25:49',1),('Marcin Domarski2','powieÅ›Ä‡ o przemijaniu',2001,' ',50,'2014-10-07 10:25:49',1),('Marcin Domarski5','powieÅ›Ä‡ o przemijaniu',2001,' ',51,'2014-10-07 10:25:49',1),('Marcin 12','2',1900,' ',52,'2014-10-07 10:25:49',1),('Marcin 12','2',1900,' ',53,'2014-10-07 10:25:49',1),('Marcin 12','2',1900,' ',54,'2014-10-07 10:25:49',1),('Marcin 12','2',1900,' ',55,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',56,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',57,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',58,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',59,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',60,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',61,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',62,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',63,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',64,'2014-10-07 10:25:49',1),('Marcin Domarski','powieÅ›Ä‡ o przemijaniu',2001,' ',65,'2014-10-07 10:25:49',1),('Nicholas C Zakas Jeremy McPeak, Joe Fawcett','Ajax Zaawansowane Programowanie',2007,' Stara nie przydaÅ‚a sie ',66,'2014-10-07 10:24:06',0),('Robin Nixon','Learning PHP, MySQL JavaScript, CSS & HTML5',2014,' Bardzo pomocna przy nauce i tym projectem.',67,'2014-10-07 10:24:06',0),('John  Resing Bear Bibeault','Tajemnice JavaScriptu podrÄ™cznik Ninja',2014,' Wydaje sie byÄ‡ bardzo przydatna ale porusza zzawansowane (jak dla mnie) zagadnienia i trzeba czasu Å¼eby je zrozumieÄ‡ ',68,'2014-10-07 10:24:06',0),(' Matt Zandstra ','Learning PHP, MySQL JavaScript, CSS & HTML5',2014,' Po tytule wydaje siÄ™ Å¼e moÅ¼e byÄ‡ pomocna ',69,'2014-10-07 10:23:37',0);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-10-07 12:33:46
