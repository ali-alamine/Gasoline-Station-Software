-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 14, 2018 at 11:42 AM
-- Server version: 10.1.34-MariaDB
-- PHP Version: 7.2.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dmd_brkf`
--
CREATE DATABASE IF NOT EXISTS `dmd_brkf` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dmd_brkf`;

-- --------------------------------------------------------

--
-- Table structure for table `facture`
--

CREATE TABLE `facture` (
  `FID` int(11) NOT NULL,
  `FDID` int(11) NOT NULL,
  `IUID` int(11) NOT NULL,
  `crt` int(11) DEFAULT NULL,
  `piece` int(11) DEFAULT NULL,
  `note` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price_crt` decimal(11,3) DEFAULT NULL,
  `price_piece` decimal(11,3) DEFAULT NULL,
  `isDeleted` bit(1) DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facture_details`
--

CREATE TABLE `facture_details` (
  `FDID` int(11) NOT NULL,
  `UID` int(11) NOT NULL,
  `PID` int(11) NOT NULL,
  `code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_req` datetime NOT NULL,
  `total_price` decimal(11,3) NOT NULL,
  `profit` decimal(11,3) NOT NULL,
  `status` tinyint(1) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facture_extra`
--

CREATE TABLE `facture_extra` (
  `FDID` int(11) NOT NULL,
  `date_del` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facture_return`
--

CREATE TABLE `facture_return` (
  `FID` int(11) NOT NULL,
  `date_req` date NOT NULL,
  `date_com` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `IID` int(11) NOT NULL,
  `code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pck_list` int(11) NOT NULL,
  `isActivated` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `item_user`
--

CREATE TABLE `item_user` (
  `IUID` int(11) NOT NULL,
  `IID` int(11) NOT NULL,
  `isDamaged` int(11) NOT NULL,
  `UID` int(11) NOT NULL,
  `crt` int(11) NOT NULL,
  `piece` int(11) NOT NULL,
  `cost` decimal(11,3) NOT NULL,
  `price` decimal(11,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `person`
--

CREATE TABLE `person` (
  `PID` int(11) NOT NULL,
  `code` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActivated` bit(1) NOT NULL DEFAULT b'1',
  `isClient` bit(1) NOT NULL DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `person_user`
--

CREATE TABLE `person_user` (
  `PID` int(11) NOT NULL,
  `UID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transfer_history`
--

CREATE TABLE `transfer_history` (
  `TID` int(11) NOT NULL,
  `UID` int(11) NOT NULL,
  `IID` int(11) NOT NULL,
  `date_t` datetime NOT NULL,
  `crt` int(11) DEFAULT NULL,
  `piece` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UID` int(11) NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActivated` bit(1) NOT NULL DEFAULT b'1',
  `isAdmin` bit(1) NOT NULL DEFAULT b'0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `facture`
--
ALTER TABLE `facture`
  ADD PRIMARY KEY (`FID`),
  ADD KEY `FDID` (`FDID`),
  ADD KEY `IUID` (`IUID`);

--
-- Indexes for table `facture_details`
--
ALTER TABLE `facture_details`
  ADD PRIMARY KEY (`FDID`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `UID_PID` (`UID`,`PID`),
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `facture_extra`
--
ALTER TABLE `facture_extra`
  ADD PRIMARY KEY (`FDID`);

--
-- Indexes for table `facture_return`
--
ALTER TABLE `facture_return`
  ADD PRIMARY KEY (`FID`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`IID`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `item_user`
--
ALTER TABLE `item_user`
  ADD PRIMARY KEY (`IUID`),
  ADD KEY `IID` (`IID`),
  ADD KEY `UID` (`UID`);

--
-- Indexes for table `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`PID`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `person_user`
--
ALTER TABLE `person_user`
  ADD PRIMARY KEY (`PID`,`UID`),
  ADD KEY `UID` (`UID`);

--
-- Indexes for table `transfer_history`
--
ALTER TABLE `transfer_history`
  ADD PRIMARY KEY (`TID`),
  ADD KEY `UID_IID` (`UID`,`IID`),
  ADD KEY `IID` (`IID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `facture`
--
ALTER TABLE `facture`
  MODIFY `FID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facture_details`
--
ALTER TABLE `facture_details`
  MODIFY `FDID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `IID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_user`
--
ALTER TABLE `item_user`
  MODIFY `IUID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `person`
--
ALTER TABLE `person`
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `transfer_history`
--
ALTER TABLE `transfer_history`
  MODIFY `TID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `facture`
--
ALTER TABLE `facture`
  ADD CONSTRAINT `facture_ibfk_1` FOREIGN KEY (`FDID`) REFERENCES `facture_details` (`FDID`),
  ADD CONSTRAINT `facture_ibfk_2` FOREIGN KEY (`IUID`) REFERENCES `item_user` (`IUID`);

--
-- Constraints for table `facture_details`
--
ALTER TABLE `facture_details`
  ADD CONSTRAINT `facture_details_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `person` (`PID`),
  ADD CONSTRAINT `facture_details_ibfk_2` FOREIGN KEY (`UID`) REFERENCES `user` (`UID`);

--
-- Constraints for table `facture_extra`
--
ALTER TABLE `facture_extra`
  ADD CONSTRAINT `facture_extra_ibfk_1` FOREIGN KEY (`FDID`) REFERENCES `facture_details` (`FDID`);

--
-- Constraints for table `facture_return`
--
ALTER TABLE `facture_return`
  ADD CONSTRAINT `facture_return_ibfk_1` FOREIGN KEY (`FID`) REFERENCES `facture` (`FID`);

--
-- Constraints for table `item_user`
--
ALTER TABLE `item_user`
  ADD CONSTRAINT `item_user_ibfk_1` FOREIGN KEY (`IID`) REFERENCES `item` (`IID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `item_user_ibfk_2` FOREIGN KEY (`UID`) REFERENCES `user` (`UID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `person_user`
--
ALTER TABLE `person_user`
  ADD CONSTRAINT `person_user_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `person` (`PID`),
  ADD CONSTRAINT `person_user_ibfk_2` FOREIGN KEY (`UID`) REFERENCES `user` (`UID`);

--
-- Constraints for table `transfer_history`
--
ALTER TABLE `transfer_history`
  ADD CONSTRAINT `transfer_history_ibfk_1` FOREIGN KEY (`IID`) REFERENCES `item` (`IID`),
  ADD CONSTRAINT `transfer_history_ibfk_2` FOREIGN KEY (`UID`) REFERENCES `user` (`UID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
