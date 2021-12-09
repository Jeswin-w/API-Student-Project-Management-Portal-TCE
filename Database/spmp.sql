-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2021 at 08:28 PM
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
  `fid` varchar(20) NOT NULL,
  `course_name` varchar(40) NOT NULL,
  `cdept` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `fid`, `course_name`, `cdept`) VALUES
('18ES390 - A', 'IT001', 'DESIGN THINKING', 'IT'),
('18ES390 - B', 'IT004', 'DESIGN THINKING', 'IT'),
('18IT490 - A', 'IT007', 'PROJECT MANAGEMENT', 'IT'),
('18IT490 - B', 'IT003', 'PROJECT MANAGEMENT', 'IT');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `regno` varchar(30) NOT NULL,
  `course_id` varchar(30) NOT NULL,
  `dept` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`regno`, `course_id`, `dept`) VALUES
('19IT027', '18ES390 - A', 'it'),
('19IT027', '18IT490 - A', 'it');

-- --------------------------------------------------------

--
-- Table structure for table `faculty_advisor`
--

CREATE TABLE `faculty_advisor` (
  `fid` varchar(10) NOT NULL,
  `mail` varchar(30) NOT NULL,
  `password` varchar(300) NOT NULL,
  `dept` varchar(11) NOT NULL,
  `fname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `faculty_advisor`
--

INSERT INTO `faculty_advisor` (`fid`, `mail`, `password`, `dept`, `fname`) VALUES
('CSE011', 'facultycse011@tce.edu', 'password', 'CSE', ''),
('IT001', 'faculty001@tce.edu', 'password', 'IT', 'Faculty001'),
('IT003', 'faculty003@gmail.com', 'password', 'IT', 'Faculty003'),
('IT004', 'faculty004@tce.edu', 'password', 'IT', 'Faculty004'),
('IT007', 'faculty010@tce.edu', 'password', 'IT', 'Faculty010'),
('MA001', 'facultymech001@tce.edu', 'password', 'MECH', '');

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `project_id` int(50) NOT NULL,
  `project_name` varchar(50) NOT NULL,
  `team_id` int(50) NOT NULL,
  `project_desc` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`project_id`, `project_name`, `team_id`, `project_desc`) VALUES
(1, 'Clinic Appointment System', 1, 'clinic appointment using node js');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `regno` varchar(8) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `name` varchar(50) NOT NULL,
  `dept` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`regno`, `mail`, `password`, `name`, `dept`) VALUES
('19IT027', 'eniyan@student.tce.edu', '$2b$10$GKFmox3lM7VK6FUunW2P5OGjXyqNeFDxhcGhnMtQyDpRnigchJz5y', 'Eniyan', 'IT'),
('19IT040', 'jeswin@student.tce.edu', '$2b$10$niaF.B4DizHGc462aQvkA.F3oHDTGijjM0EUDpnLTBK8K5dRkJRue', 'Jeswin W', 'IT');

-- --------------------------------------------------------

--
-- Table structure for table `team`
--

CREATE TABLE `team` (
  `team_id` int(30) NOT NULL,
  `team_members` varchar(30) NOT NULL,
  `course_id` varchar(30) NOT NULL,
  `team_name` varchar(30) NOT NULL,
  `fid` varchar(30) NOT NULL,
  `cdept` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `team`
--

INSERT INTO `team` (`team_id`, `team_members`, `course_id`, `team_name`, `fid`, `cdept`) VALUES
(1, '19IT027, 19IT041, 19IT040', '18ES390 - A', 'Eniyan and his fans', 'IT001', 'IT');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`);

--
-- Indexes for table `faculty_advisor`
--
ALTER TABLE `faculty_advisor`
  ADD PRIMARY KEY (`fid`),
  ADD UNIQUE KEY `email` (`mail`);

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

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `project_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `team_id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
