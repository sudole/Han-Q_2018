-- ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'oqdb!!23'

CREATE DATABASE `onquizdb`;

CREATE TABLE `onquizdb`.`tstudent` (
  `sid` INT NOT NULL AUTO_INCREMENT,
  `sname` VARCHAR(45) NULL,
  `scode` VARCHAR(45) NULL,
  `userid` VARCHAR(45) NULL,
  `passwd` VARCHAR(45) NULL,
  `sphone` VARCHAR(45) NULL,
  `discd` INT NULL DEFAULT 0 COMMENT '삭제여부 1 삭제',
  PRIMARY KEY (`sid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '학생테이블';

CREATE TABLE `onquizdb`.`tsubject` (
  `sbid` INT NOT NULL AUTO_INCREMENT,
  `sbname` VARCHAR(45) NULL,
  PRIMARY KEY (`sbid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '과목테이블';

CREATE TABLE `onquizdb`.`tlecture` (
  `lid` INT NOT NULL AUTO_INCREMENT,
  `sbid` INT NOT NULL,
  `semester` VARCHAR(45) NULL,
  `lname` VARCHAR(45) NULL,
  `discd` INT NULL DEFAULT 0,
  PRIMARY KEY (`lid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '강좌테이블';

CREATE TABLE `onquizdb`.`tprofessor` (
  `pid` INT NOT NULL AUTO_INCREMENT,
  `pname` VARCHAR(45) NULL,
  `pcode` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `passwd` VARCHAR(45) NULL,
  PRIMARY KEY (`pid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '교수테이블';

CREATE TABLE `onquizdb`.`tregexam` (
  `reid` INT NOT NULL AUTO_INCREMENT,
  `sbid` INT NOT NULL,
  `lid` INT NULL,
  `type` TINYINT NULL,
  `question` TEXT NULL,
  `comment` VARCHAR(45) NULL,
  `answer1` VARCHAR(45) NULL,
  `answer2` VARCHAR(45) NULL,
  `answer3` VARCHAR(45) NULL,
  `answer4` VARCHAR(45) NULL,
  `answer5` VARCHAR(45) NULL,
  PRIMARY KEY (`reid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '등록된 문제 테이블';

CREATE TABLE `onquizdb`.`tlecmember` (
  `lmid` INT NOT NULL AUTO_INCREMENT,
  `lid` INT NOT NULL,
  `sid` INT NOT NULL,
  PRIMARY KEY (`lmid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '학생 수강 강좌 테이블';

CREATE TABLE `onquizdb`.`tmktest` (
  `mktid` INT NOT NULL AUTO_INCREMENT,
  `lid` INT NULL,
  `testname` VARCHAR(45) NULL,
  `testdate` VARCHAR(45) NULL,
  `sttime` VARCHAR(45) NULL,
  `endtime` VARCHAR(45) NULL,
  `discd` INT NULL DEFAULT 0, 
  PRIMARY KEY (`mktid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '시험지 테이블';

CREATE TABLE `onquizdb`.`toxexam` (
  `oxeid` INT NOT NULL AUTO_INCREMENT,
  `mktid` INT NULL,
  `reid` INT NULL,
  `point` INT NULL,
  `sn` INT NULL COMMENT '순서',
  PRIMARY KEY (`oxeid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '시험지에 등록한 OX 문제 테이블';

CREATE TABLE `onquizdb`.`tblankexam` (
  `beid` INT NOT NULL AUTO_INCREMENT,
  `mktid` INT NULL,
  `reid` INT NULL,
  `point` INT NULL,
  `sn` INT NULL COMMENT '순서',
  PRIMARY KEY (`beid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '시험지에 등록된 괄호 문제 테이블';

CREATE TABLE `onquizdb`.`tfintest` (
  `fintid` INT NOT NULL AUTO_INCREMENT,
  `mktid` INT NULL,
  `etype` TINYINT NULL,
  `question` TEXT NULL,
  `comment` VARCHAR(45) NULL,
  `answer1` VARCHAR(45) NULL,
  `answer2` VARCHAR(45) NULL,
  `answer3` VARCHAR(45) NULL,
  `answer4` VARCHAR(45) NULL,
  `answer5` VARCHAR(45) NULL,
  `sn` INT NULL,
  `point` INT NULL,
  PRIMARY KEY (`fintid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '완성된 시험지';

CREATE TABLE `onquizdb`.`tscorecard` (
  `scid` INT NOT NULL AUTO_INCREMENT,
  `sid` INT NOT NULL,
  `mktid` INT NOT NULL,
  `score` INT NULL,
  `rank` INT NULL,
  PRIMARY KEY (`scid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '성적표\n학생성적테이블';

CREATE TABLE `onquizdb`.`tanswersheet` (
  `asid` INT NOT NULL AUTO_INCREMENT,
  `fintid` INT NOT NULL,
  `sid` INT NOT NULL,
  `question` TEXT NULL,
  `stanswer` VARCHAR(45) NULL,
  `point` INT NULL,
  PRIMARY KEY (`asid`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COMMENT = '답안지 테이블';
