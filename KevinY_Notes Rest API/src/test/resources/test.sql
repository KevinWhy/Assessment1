-- SQL is based on a phpMyAdmin SQL dump...
-- but I'm using H2, which apparently uses slightly different syntax.
-- Reference:
--     https://h2database.com/html/grammar.html

-- Start each test with a clean database
DROP TABLE IF EXISTS `note`;

CREATE TABLE `note` (
  `id` int(11) NOT NULL,
  `body` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=UTF8;

--
-- Dumping data for table `note`
--
INSERT INTO `note` (`id`, `body`) VALUES
(1, 'THIS IS AN APPLE TEST'),
(2, 'Quench aPPLe Slam'),
(4, 'Milk'),
(5, 'milk tea'),
(6, 'Printing Parchment');

--
-- Indexes for table `note`
--
ALTER TABLE `note`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for table `note`
--
ALTER TABLE `note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
-- The next statement might look very weird in SQL bcause it doesn't follow MySQL's syntax
-- It follow H2 database's syntax:
--     https://h2database.com/html/grammar.html#alter_table_alter_column
ALTER TABLE `note` ALTER COLUMN `id` RESTART WITH 7;