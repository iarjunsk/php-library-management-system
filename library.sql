-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 13, 2015 at 04:04 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `library`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookcases`
--

CREATE TABLE IF NOT EXISTS `bookcases` (
  `user_email` varchar(50) NOT NULL,
  `bookcase` varchar(50) NOT NULL,
  `shelf_count` int(5) NOT NULL,
  `shelf_cap` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bookcases`
--

INSERT INTO `bookcases` (`user_email`, `bookcase`, `shelf_count`, `shelf_cap`) VALUES
('a2@gmail.com', 'Hall', 4, 4),
('a2@gmail.com', 'Main', 5, 3);

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE IF NOT EXISTS `books` (
  `user_email` varchar(20) NOT NULL,
  `bookcase` varchar(20) NOT NULL,
  `shelf_id` int(5) NOT NULL,
  `title` varchar(20) NOT NULL,
  `author` varchar(20) NOT NULL,
  `gener` varchar(20) NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `price` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`user_email`, `bookcase`, `shelf_id`, `title`, `author`, `gener`, `isbn`, `price`) VALUES
('a2@gmail.com', 'Hall', 1, 'Harry Porter', 'JK Rowling', 'Fantasy', 'GH123', 324),
('a2@gmail.com', 'Hall', 1, 'Book1', 'Author1', 'Funny', 'GH123', 23),
('a2@gmail.com', 'Hall', 1, '123', 'ME', 'Game', 'GM34F', 20),
('a2@gmail.com', 'Hall', 1, 'FF6', 'AA', 'Game', 'FF456', 90),
('a2@gmail.com', 'heap', 2, 'Harry Porter', 'Author1', 'Game', 'GH123', 34);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(3) unsigned zerofill NOT NULL AUTO_INCREMENT,
  `user_email` varchar(20) DEFAULT NULL,
  `user_pass` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_email`, `user_pass`) VALUES
(006, 'a1@gmail.com', '202cb962ac59075b964b07152d234b70'),
(007, 'hello@gmail.com', '202cb962ac59075b964b07152d234b70'),
(008, 'a2@gmail.com', '202cb962ac59075b964b07152d234b70');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
