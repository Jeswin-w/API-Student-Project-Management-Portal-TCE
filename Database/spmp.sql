-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2021 at 05:48 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spmp`
--

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` varchar(20) NOT NULL,
  `fid` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `course_faculty`
--

CREATE TABLE `course_faculty` (
  `fid` varchar(10) NOT NULL,
  `mail` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `faculty_advisor`
--

CREATE TABLE `faculty_advisor` (
  `fid` varchar(10) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `project_id` varchar(20) NOT NULL,
  `team_id` varchar(20) NOT NULL,
  `faculty_id` varchar(20) NOT NULL,
  `advisor_id` varchar(20) NOT NULL,
  `course_id` varchar(20) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `regno` varchar(8) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `password` varchar(30) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `team_id` varchar(20) NOT NULL,
  `course_id` varchar(20) NOT NULL,
  `team_size` int(20) NOT NULL,
  `team_member_1` varchar(50) NOT NULL,
  `team_member_2` varchar(50) NOT NULL,
  `team_member_3` varchar(50) DEFAULT NULL,
  `team_member_4` varchar(50) DEFAULT NULL,
  `team_member_5` varchar(50) DEFAULT NULL,
  `team_member_6` varchar(50) DEFAULT NULL,
  `team_member_7` varchar(11) DEFAULT NULL,
  `team_member_8` varchar(11) DEFAULT NULL,
  `faculty_id` varchar(20) NOT NULL,
  `advisor_id` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `course_faculty`
--
ALTER TABLE `course_faculty`
  ADD PRIMARY KEY (`fid`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- Indexes for table `faculty_advisor`
--
ALTER TABLE `faculty_advisor`
  ADD PRIMARY KEY (`fid`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`project_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`regno`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- Indexes for table `team`
--
ALTER TABLE `team`
  ADD PRIMARY KEY (`team_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
