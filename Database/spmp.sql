-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 14, 2021 at 05:24 PM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

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
-- Table structure for table `add_submission`
--

CREATE TABLE `add_submission` (
  `sid` int(11) NOT NULL,
  `sub_title` varchar(70) NOT NULL,
  `sub_desc` varchar(255) NOT NULL,
  `due_date` date NOT NULL,
  `course_id` varchar(20) NOT NULL,
  `cdept` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `add_submission`
--

INSERT INTO `add_submission` (`sid`, `sub_title`, `sub_desc`, `due_date`, `course_id`, `cdept`) VALUES
(2, 'Requirements gathering', 'Get stakeholder requirements', '2021-12-14', '18ES390 - A', 'IT'),
(3, 'SRS', 'submit srs doc', '2021-12-17', '18ES390 - A', 'IT');

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
('18IT490 - B', 'IT003', 'PROJECT MANAGEMENT', 'IT'),
('18ES390 - A', 'IT001', 'DESIGN THINKING', 'IT'),
(' 18ES390 - B', 'IT003', 'DESIGN THINKING', 'IT'),
(' 18ES590 - A', 'IT002', 'SYSTEM THINKING', 'IT'),
(' 18ES590 - B', 'IT004', 'SYSTEM THINKING', 'IT'),
(' 18ES690 - A', 'IT001', 'ENGINEERING DESIGN', 'IT'),
(' 18ES690 - B', 'IT003', 'ENGINEERING DESIGN', 'IT'),
(' 18ES790 - A', 'IT002', 'CAPSTONE PROJECT', 'IT'),
(' 18ES790 - B', 'IT004', 'CAPSTONE PROJECT', 'IT'),
('18IT810 - A', 'IT001', 'FINAL SEM PROJECT', 'IT'),
('18IT810 - A', 'IT003', 'FINAL SEM PROJECT', 'IT');

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `regno` varchar(30) NOT NULL,
  `course_id` varchar(30) NOT NULL,
  `dept` varchar(30) NOT NULL,
  `team_status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`regno`, `course_id`, `dept`, `team_status`) VALUES
('19IT027', '18ES390 - A', 'it', 1),
('19IT027', '18IT490 - A', 'it', 0),
('19IT040', '18ES390 - A', 'IT', 1),
('19IT041', '18ES390 - A', 'IT', 1),
('19IT027', '18ES390 - B', 'IT', 0),
('19IT027', '18ES590 - B', 'it', 0),
('19IT027', '18ES790 - B', 'it', 0),
('19IT027', '18ES590 - A', 'it', 0);

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
('CSE011', 'facultycse011@tce.edu', 'password', 'CSE', 'ab'),
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
  `project_desc` varchar(255) NOT NULL,
  `domain` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`project_id`, `project_name`, `team_id`, `project_desc`, `domain`) VALUES
(1, 'Clinic Appointment System', 1, 'clinic appointment using node js', 'Web Application'),
(3, 'smart labs', 5, 'making labs automatic', 'making labs automatic');

-- --------------------------------------------------------

--
-- Table structure for table `ssub`
--

CREATE TABLE `ssub` (
  `subid` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `sid` int(11) NOT NULL,
  `originalfile` varchar(100) NOT NULL,
  `file` varchar(255) NOT NULL,
  `cf_status` varchar(100) NOT NULL,
  `guide_status` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ssub`
--

INSERT INTO `ssub` (`subid`, `team_id`, `sid`, `originalfile`, `file`, `cf_status`, `guide_status`) VALUES
(4, 5, 3, 'Lang_id.xlsx', '1639484596944-513534371..xlsx', '', '');

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
('19IT040', 'jeswin@student.tce.edu', '$2b$10$niaF.B4DizHGc462aQvkA.F3oHDTGijjM0EUDpnLTBK8K5dRkJRue', 'Jeswin W', 'IT'),
('19IT041', 'jeya@student.tce.edu', '$2b$10$GKFmox3lM7VK6FUunW2P5OGjXyqNeFDxhcGhnMtQyDpRnigchJz5y', 'Jeya Ganesh', 'IT');

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
(5, '19IT027,19IT040,19IT041,', '18ES390 - A', 'tech', 'IT001', 'IT');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `add_submission`
--
ALTER TABLE `add_submission`
  ADD PRIMARY KEY (`sid`);

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
-- Indexes for table `ssub`
--
ALTER TABLE `ssub`
  ADD PRIMARY KEY (`subid`);

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
-- AUTO_INCREMENT for table `add_submission`
--
ALTER TABLE `add_submission`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `project_id` int(50) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ssub`
--
ALTER TABLE `ssub`
  MODIFY `subid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `team`
--
ALTER TABLE `team`
  MODIFY `team_id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
