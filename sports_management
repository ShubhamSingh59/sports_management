CREATE DATABASE sports_management;
-- Use the newly created database
USE sports_management;

-- Create Player table
CREATE TABLE Player (
    Player_ID INT UNIQUE PRIMARY KEY NOT NULL, -- Player_ID: Roll number (Student)
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    DOB DATE,
    Gender CHAR(1),
    Mobile VARCHAR(15) UNIQUE,
    Email VARCHAR(100) UNIQUE
);

-- Create Sports table
CREATE TABLE Sports (
    Sports_Name VARCHAR(50) PRIMARY KEY
);

-- Create Coach table
CREATE TABLE Coach (
    Coach_ID INT PRIMARY KEY UNIQUE,   -- this Coach_ID same as Person_ID 
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    DOB DATE,
    Gender CHAR(1),
    Mobile VARCHAR(15),
    Email VARCHAR(100),
    Experience INT,
    Qualification VARCHAR(100),
    Salary DECIMAL(10, 2),
    Sports_Name VARCHAR(50),
    FOREIGN KEY (Sports_Name) REFERENCES Sports(Sports_Name) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Equipments table
CREATE TABLE Equipments (
    Equipment_Name VARCHAR(50),
    Sports_Name VARCHAR(50),
    Quantity INT,
    Equipment_photo  VARCHAR(244)  ,
    PRIMARY KEY (Equipment_Name, Sports_Name),
    FOREIGN KEY (Sports_Name) REFERENCES Sports(Sports_Name) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Issue Relationship set schemas 
CREATE TABLE Issue (
    Equipment_Name VARCHAR(50),
    Sports_Name VARCHAR(50),
    Player_ID INT,
    Date_Time DATETIME,
    Quantity INT,
	Return_Status ENUM('Returned', 'Not Returned') DEFAULT 'Not Returned',
    PRIMARY KEY (Player_ID, Equipment_Name, Date_Time),
    FOREIGN KEY (Equipment_Name, Sports_Name) REFERENCES Equipments(Equipment_Name, Sports_Name) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Plays_For ( 
    Player_ID INT , 
    Sports_Name VARCHAR(50) , 
    PRIMARY KEY (Player_ID, Sports_Name),
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Sports_Name) REFERENCES Sports(Sports_Name) ON DELETE CASCADE ON UPDATE CASCADE
) ; 

CREATE TABLE Team (
    Team_ID INT PRIMARY KEY UNIQUE,
    Team_Name VARCHAR(100),
    Captain_ID INT,
    Sports_Name  VARCHAR(50),
    FOREIGN KEY (Sports_Name) REFERENCES Sports(Sports_Name) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Captain_ID) REFERENCES Player(Player_ID) ON DELETE SET NULL ON UPDATE CASCADE -- Setting the captain to NULL if the referenced player is deleted
);

CREATE TABLE guide_of ( 
    Team_ID INT unique, 
    Coach_ID INT UNIQUE,
    PRIMARY KEY(Team_ID, Coach_ID),
    FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Coach_ID) REFERENCES Coach(Coach_ID) ON DELETE CASCADE ON UPDATE CASCADE
);    

CREATE TABLE belongs_to( 
    Player_ID INT UNIQUE ,
    Team_ID INT ,
    PRIMARY KEY (Player_ID, Team_ID),
    FOREIGN KEY (Player_ID) REFERENCES Player(Player_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID) ON DELETE CASCADE ON UPDATE CASCADE
) ;

-- Create Tournament table
CREATE TABLE Tournament (
    Tournament_ID INT PRIMARY KEY,
    Tournament_Name VARCHAR(100),
    Start_Date DATE,
    End_Date DATE,
    Venue VARCHAR(100) , 
    Winner_Team_ID INT ,
    FOREIGN KEY (Winner_Team_ID) REFERENCES Team(Team_ID) ON DELETE SET NULL ON UPDATE CASCADE -- Setting the winner to NULL if the referenced team is deleted
);

-- Relationship set between Tournament and Teams 
CREATE TABLE Participate(
    Team_ID INT ,
    Tournament_ID INT ,
    PRIMARY KEY ( Team_ID, Tournament_ID),
    FOREIGN KEY (Team_ID) REFERENCES Team(Team_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Tournament_ID) REFERENCES Tournament(Tournament_ID) ON DELETE CASCADE ON UPDATE CASCADE
 ) ; 


-- Matches  Entity set 
CREATE TABLE Matches( 
    Match_ID INT PRIMARY KEY,
    Date_time DATETIME , 
    Venue VARCHAR(100) , 
    Winner_ID INT ,
    FOREIGN KEY (Winner_ID) REFERENCES Team(Team_ID) ON DELETE SET NULL ON UPDATE CASCADE -- Setting the winner to NULL if the referenced team is deleted
) ; 

 -- Create Competition table for Matches Teams
CREATE TABLE Competition (
    Match_ID INT,
    Team1_ID INT,
    Team2_ID INT , 
    PRIMARY KEY (Match_ID, Team1_ID, Team2_ID),
    FOREIGN KEY (Match_ID) REFERENCES Matches(Match_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Team1_ID) REFERENCES Team(Team_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Team2_ID) REFERENCES Team(Team_ID) ON DELETE CASCADE ON UPDATE CASCADE
);
