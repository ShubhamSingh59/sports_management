
INSERT INTO Player (Player_ID, First_Name, Last_Name, DOB, Gender, Mobile, Email)
VALUES
(100151, 'Amit', 'Kumar', '1990-05-15', 'M', '9876543210', 'amit.kumar@email.com'),
(100521, 'Neha', 'Patel', '1995-02-28', 'F', '9988776654', 'neha.patel@email.com'),
(100540, 'Prakash', 'Singh', '1982-09-10', 'M', '8877665543', 'prakash.singh@email.com'),
(100653, 'Kavita', 'Mishra', '1993-08-05', 'F', '7766554432', 'kavita.mishra@email.com'),
(100854, 'Sunita', 'Rani', '1987-06-25', 'F', '6655443321', 'sunita.rani@email.com'),
(101055, 'Pooja', 'Yadav', '1983-04-12', 'F', '5544332210', 'pooja.yadav@email.com'),
(101256, 'Mona', 'Jha', '1989-01-14', 'F', '4433221100', 'mona.jha@email.com'),
(101457, 'Sara', 'Verma', '1996-09-22', 'F', '3322110098', 'sara.verma@email.com'),
(101545, 'Kunal', 'Gupta', '1984-12-10', 'M', '2211009987', 'kunal.gupta@email.com'),
(101644, 'Ritu', 'Yadav', '1990-03-18', 'F', '1100998876', 'ritu.yadav@email.com'),
(101949, 'Vikas', 'Sharma', '1987-04-12', 'M', '9988776634', 'vikas.sharma@email.com'),
(102043, 'Nisha', 'Yadav', '1992-07-28', 'F', '8887665543', 'nisha.yadav@email.com'),
(102141, 'Ankur', 'Kumar', '1985-01-14', 'M', '7776554432', 'ankur.kumar@email.com'),
(102444, 'Manisha', 'Gupta', '1982-12-10', 'F', '6055443321', 'manisha.gupta@email.com'),
(102537, 'Sachin', 'Yadav', '1990-03-18', 'M', '0544332210', 'sachin.yadav@email.com'),
(102839, 'Divya', 'Sharma', '1992-04-12', 'F', '4430221100', 'divya.sharma@email.com'),
(102932, 'Alok', 'Yadav', '1983-07-28', 'M', '3302110098', 'alok.yadav@email.com'),
(103033, 'Swati', 'Kumar', '1998-01-14', 'F', '2201009987', 'swati.kumar@email.com'),
(103200, 'Shikha', 'Verma', '1996-09-22', 'F', '1000998876', 'shikha.verma@email.com'),
(103399, 'Rajat', 'Gupta', '1984-12-10', 'M', '9988776653', 'rajat.gupta@email.com');

SELECT * FROM Player;


-- inserting values into the sports 
INSERT INTO Sports (Sports_Name)
VALUES
('Cricket'),
('Football'),
('Basketball'),
('Volleyball'),
('Tennis'),
('Badminton'),
('Hockey'),
('Rugby'),
('Baseball'),
('Golf'),
('Swimming'),
('Cycling'),
('Boxing'),
('Wrestling'),
('Gymnastics'),
('Athletics'),
('Skiing'),
('Snowboarding'),
('Surfing'),
('Skateboarding');

SELECT * FROM Sports;

-- insert into tems 



INSERT INTO Team (Team_ID, Team_Name, Captain_ID, Sports_Name) VALUES
(200001, 'The Avengers', 100151, 'Cricket'),
(200002, 'The Ninjas', 100521, 'Badminton'),
(200003, 'The Panthers', 100540, 'Hockey'),
(200004, 'The Knights', 100653, 'Cycling'),
(200005, 'The Stars', 100854, 'Boxing'),
(200006, 'The Pirates', 101055, 'Volleyball'),
(200007, 'The Magicians', 101256, 'Basketball'),
(200008, 'The Spartans', 101457, 'Football'),
(200009, 'The Kings', 101545, 'Tennis'),
(200010, 'The Rockets', 101644, 'Athletics'),
(200011, 'The Warriors', 102141, 'Cricket'),
(200012, 'The Dragons', 102537, 'Badminton'),
(200013, 'The Tigers', 102839, 'Hockey'),
(200014, 'The Lions', 103033, 'Cycling'),
(200015, 'The Bears', 103200, 'Boxing'),
(200016, 'The Eagles', 103399, 'Volleyball'),
(200017, 'The Falcons', 100521, 'Basketball'),
(200018, 'The Sharks', 100854, 'Football'),
(200019, 'The Wolves', 101644, 'Tennis'),
(200020, 'The Hawks', 102141, 'Athletics');


SELECT * FROM Team;




-- inserting into the coach 


INSERT INTO Coach (Coach_ID, First_Name, Last_Name, DOB, Gender, Mobile, Email, Experience, Qualification, Salary, Sports_Name)
VALUES
(10, 'John', 'Doe', '1970-01-01', 'M', '9876543210', 'john.doe@email.com', 10, 'Diploma in Sports Coaching', 50000.00, 'Cricket'),
(11, 'Jane', 'Doe', '1970-01-02', 'F', '9876543211', 'jane.doe@email.com', 11, 'Diploma in Physical Education', 51000.00, 'Football'),
(12, 'Jim', 'Smith', '1970-01-03', 'M', '9876543212', 'jim.smith@email.com', 12, 'Diploma in Sports Science', 52000.00, 'Basketball'),
(13, 'Jill', 'Smith', '1970-01-04', 'F', '9876543213', 'jill.smith@email.com', 13, 'Diploma in Sports Management', 53000.00, 'Volleyball'),
(14, 'Joe', 'Johnson', '1970-01-05', 'M', '9876543214', 'joe.johnson@email.com', 14, 'Diploma in Sports Psychology', 54000.00, 'Tennis'),
(15, 'Jenny', 'Johnson', '1970-01-06', 'F', '9876543215', 'jenny.johnson@email.com', 15, 'Diploma in Sports Nutrition', 55000.00, 'Badminton'),
(16, 'Jack', 'Williams', '1970-01-07', 'M', '9876543216', 'jack.williams@email.com', 16, 'Diploma in Sports Therapy', 56000.00, 'Hockey'),
(17, 'Jill', 'Williams', '1970-01-08', 'F', '9876543217', 'jill.williams@email.com', 17, 'Diploma in Sports Rehabilitation', 57000.00, 'Rugby'),
(18, 'Jake', 'Brown', '1970-01-09', 'M', '9876543218', 'jake.brown@email.com', 18, 'Diploma in Sports Medicine', 58000.00, 'Baseball'),
(19, 'Julie', 'Brown', '1970-01-10', 'F', '9876543219', 'julie.brown@email.com', 19, 'Diploma in Sports Performance Analysis', 59000.00, 'Golf'),
(20, 'Jerry', 'Davis', '1970-01-11', 'M', '9876543220', 'jerry.davis@email.com', 20, 'Diploma in Sports Journalism', 60000.00, 'Swimming'),
(21, 'Jessica', 'Davis', '1970-01-12', 'F', '9876543221', 'jessica.davis@email.com', 21, 'Diploma in Sports Marketing', 61000.00, 'Cycling'),
(22, 'Jeff', 'Miller', '1970-01-13', 'M', '9876543222', 'jeff.miller@email.com', 22, 'Diploma in Sports Law', 62000.00, 'Boxing'),
(23, 'Jennifer', 'Miller', '1970-01-14', 'F', '9876543223', 'jennifer.miller@email.com', 23, 'Diploma in Sports Development', 63000.00, 'Wrestling'),
(24, 'Jason', 'Wilson', '1970-01-15', 'M', '9876543224', 'jason.wilson@email.com', 24, 'Diploma in Sports Event Management', 64000.00, 'Gymnastics'),
(25, 'Jasmine', 'Wilson', '1970-01-16', 'F', '9876543225', 'jasmine.wilson@email.com', 25, 'Diploma in Sports Broadcasting', 65000.00, 'Athletics'),
(26, 'Jacob', 'Moore', '1970-01-17', 'M', '9876543226', 'jacob.moore@email.com', 26, 'Diploma in Sports Photography', 66000.00, 'Skiing'),
(27, 'Jade', 'Moore', '1970-01-18', 'F', '9876543227', 'jade.moore@email.com', 27, 'Diploma in Sports Leadership', 67000.00, 'Snowboarding'),
(28, 'Justin', 'Taylor', '1970-01-19', 'M', '9876543228', 'justin.taylor@email.com', 28, 'Diploma in Sports Conditioning', 68000.00, 'Surfing'),
(29, 'Joy', 'Taylor', '1970-01-20', 'F', '9876543229', 'joy.taylor@email.com', 29, 'Diploma in Sports Officiating', 69000.00, 'Skateboarding');

select * from Coach ;





INSERT INTO Plays_For (Player_ID, Sports_Name) VALUES
(100151, 'Cricket'), (100151, 'Badminton'),
(100521, 'Tennis'), (100521, 'Volleyball'),
(100540, 'Cricket'),
(100653, 'Basketball'),
(100854, 'Badminton'),
(101055, 'Cricket'), (101055, 'Football'),
(101256, 'Volleyball'),
(101457, 'Basketball'), (101457, 'Tennis'),
(101545, 'Football'),
(101644, 'Cricket'),
(101949, 'Cricket'),
(102043, 'Tennis'),
(102141, 'Cricket'), (102141, 'Football'),
(102444, 'Badminton'), (102444, 'Volleyball'),
(102537, 'Football'),
(102839, 'Cricket'), (102839, 'Badminton'),
(102932, 'Basketball'), (102932, 'Volleyball'),
(103033, 'Cricket'), (103033, 'Football'),
(103200, 'Basketball'), (103200, 'Tennis'),
(103399, 'Cricket'), (103399, 'Badminton');

select * from Plays_For ;

-- inserting values into guide of





INSERT INTO guide_of (Team_ID, Coach_ID) VALUES
(200001, 10),
(200002, 15),
(200003, 16),
(200004, 17),
(200005, 18),
(200006, 13),
(200007, 12),
(200008, 11),
(200009, 14),
(200010, 21),
(200011, 22),
(200012, 23),
(200013, 24),
(200014, 25),
(200015, 26),
(200016, 27),
(200017, 29),
(200018, 28),
(200019, 19),
(200020, 20);


select* from guide_of ;

-- Inserting values into the Equipments table with Equipment_photo column containing NULL for image URLs
INSERT INTO Equipments (Equipment_Name, Sports_Name, Quantity, Equipment_photo) VALUES
('Cricket Bat', 'Cricket', 20, 'https://cdnmedia.dsc-cricket.com/media/catalog/product/cache/f6804705d3c9b06dccd038949280b6b0/k/r/krunch-pro-english-willow-cricket-bat-2023.jpg'),
('Cricket Ball', 'Cricket', 50, NULL),
('Football', 'Football', 10, 'https://www.jagranimages.com/images/newimg/18072023/18_07_2023-best_football_brands_in_india_23475109.jpg'),
('Basketball', 'Basketball', 5, NULL),
('Volleyball', 'Volleyball', 6, NULL),
('Tennis Racket', 'Tennis', 8, NULL),
('Tennis Ball', 'Tennis', 20, NULL),
('Badminton Racket', 'Badminton', 12, NULL),
('Badminton Shuttlecock', 'Badminton', 24, NULL),
('Hockey Stick', 'Hockey', 15, NULL),
('Hockey Ball', 'Hockey', 30, NULL),
('Baseball Bat', 'Baseball', 10, NULL),
('Baseball Ball', 'Baseball', 20, NULL),
('Golf Club', 'Golf', 10, NULL),
('Golf Ball', 'Golf', 30, NULL),
('Swimming Goggles', 'Swimming', 25, NULL),
('Swimming Cap', 'Swimming', 30, NULL),
('Cycling Helmet', 'Cycling', 15, NULL),
('Cycling Gloves', 'Cycling', 20, NULL),
('Boxing Gloves', 'Boxing', 15, NULL),
('Boxing Punching Bag', 'Boxing', 5, NULL),
('Wrestling Mat', 'Wrestling', 10, NULL),
('Gymnastics Mat', 'Gymnastics', 20, NULL),
('Athletics Shoes', 'Athletics', 20, NULL),
('Athletics Jersey', 'Athletics', 30, NULL),
('Skiing Equipment', 'Skiing', 10, NULL),
('Snowboarding Equipment', 'Snowboarding', 10, NULL),
('Surfing Board', 'Surfing', 8, NULL),
('Skateboarding Deck', 'Skateboarding', 12, NULL);



select* from Equipments ;



-- Assuming each player belongs to one team for now
INSERT INTO belongs_to (Player_ID, Team_ID) VALUES
(100151, 200001),
(100521, 200002),
(100540, 200003),
(100653, 200004),
(100854, 200005),
(101055, 200006),
(101256, 200007),
(101457, 200008),
(101545, 200009),
(101644, 200010),
(101949, 200011),
(102043, 200012),
(102141, 200013),
(102444, 200014),
(102537, 200015),
(102839, 200016),
(102932, 200017),
(103033, 200018),
(103200, 200019),
(103399, 200020);


select * from belongs_to;

-- Inserting values into the Tournament table
-- Assuming some sample tournaments with winner teams
INSERT INTO Tournament (Tournament_ID, Tournament_Name, Start_Date, End_Date, Venue, Winner_Team_ID) VALUES
(1, 'Cricket Championship', '2024-03-01', '2024-03-15', 'Stadium 1', 200001),
(2, 'Football League', '2024-04-01', '2024-05-15', 'Stadium 2', 200008),
(3, 'Basketball Tournament', '2024-05-01', '2024-06-15', 'Stadium 3', 200007),
(4, 'Volleyball Championship', '2024-06-01', '2024-07-15', 'Stadium 4', 200006),
(5, 'Tennis Open', '2024-07-01', '2024-08-15', 'Stadium 5', 200009),
(6, 'Badminton Classic', '2024-08-01', '2024-09-15', 'Stadium 6', 200012),
(7, 'Hockey Cup', '2024-09-01', '2024-10-15', 'Stadium 7', 200003),
(8, 'Athletics Championship', '2024-10-01', '2024-11-15', 'Stadium 8', 200010);


select *from Tournament ;


-- Inserting values into the Participate table
-- Assuming all teams participate in all tournaments
INSERT INTO Participate (Team_ID, Tournament_ID) VALUES
(200001, 1), (200002, 1), (200003, 1), (200004, 1), (200005, 1),
(200006, 1), (200007, 1), (200008, 1), (200009, 1), (200010, 1),
(200011, 1), (200012, 1), (200013, 1), (200014, 1), (200015, 1),
(200016, 1), (200017, 1), (200018, 1), (200019, 1), (200020, 1),
(200001, 2), (200002, 2), (200003, 2), (200004, 2), (200005, 2),
(200006, 2), (200007, 2), (200008, 2), (200009, 2), (200010, 2),
(200011, 2), (200012, 2), (200013, 2), (200014, 2), (200015, 2),
(200016, 2), (200017, 2), (200018, 2), (200019, 2), (200020, 2),
(200001, 3), (200002, 3), (200003, 3), (200004, 3), (200005, 3),
(200006, 3), (200007, 3), (200008, 3), (200009, 3), (200010, 3),
(200011, 3), (200012, 3), (200013, 3), (200014, 3), (200015, 3),
(200016, 3), (200017, 3), (200018, 3), (200019, 3), (200020, 3),
(200001, 4), (200002, 4), (200003, 4), (200004, 4), (200005, 4),
(200006, 4), (200007, 4), (200008, 4), (200009, 4), (200010, 4),
(200011, 4), (200012, 4), (200013, 4), (200014, 4), (200015, 4),
(200016, 4), (200017, 4), (200018, 4), (200019, 4), (200020, 4),
(200001, 5), (200002, 5), (200003, 5), (200004, 5), (200005, 5),
(200006, 5), (200007, 5), (200008, 5), (200009, 5), (200010, 5),
(200011, 5), (200012, 5), (200013, 5), (200014, 5), (200015, 5),
(200016, 5), (200017, 5), (200018, 5), (200019, 5), (200020, 5),
(200001, 6), (200002, 6), (200003, 6), (200004, 6), (200005, 6),
(200006, 6), (200007, 6), (200008, 6), (200009, 6), (200010, 6),
(200011, 6), (200012, 6), (200013, 6), (200014, 6), (200015, 6),
(200016, 6), (200017, 6), (200018, 6), (200019, 6), (200020, 6),
(200001, 7), (200002, 7), (200003, 7), (200004, 7), (200005, 7),
(200006, 7), (200007, 7), (200008, 7), (200009, 7), (200010, 7),
(200011, 7), (200012, 7), (200013, 7), (200014, 7), (200015, 7),
(200016, 7), (200017, 7), (200018, 7), (200019, 7), (200020, 7),
(200001, 8), (200002, 8), (200003, 8), (200004, 8), (200005, 8),
(200006, 8), (200007, 8), (200008, 8), (200009, 8), (200010, 8),
(200011, 8), (200012, 8), (200013, 8), (200014, 8), (200015, 8),
(200016, 8), (200017, 8), (200018, 8), (200019, 8), (200020, 8);


select * from Participate ;

-- Inserting values into the Matches table
-- Assuming some sample matches with winners
INSERT INTO Matches (Match_ID, Date_time, Venue, Winner_ID) VALUES
(1, '2024-03-05 15:00:00', 'Stadium 1', 200001),
(2, '2024-03-08 16:00:00', 'Stadium 2', 200008),
(3, '2024-03-10 14:00:00', 'Stadium 3', 200007),
(4, '2024-03-12 17:00:00', 'Stadium 4', 200006),
(5, '2024-03-15 18:00:00', 'Stadium 5', 200009),
(6, '2024-04-01 15:00:00', 'Stadium 6', 200012),
(7, '2024-04-05 16:00:00', 'Stadium 7', 200003),
(8, '2024-04-08 14:00:00', 'Stadium 8', 200010);

select * from Matches ;
-- Inserting values into the Competition table
-- Assuming each match has two competing teams
INSERT INTO Competition (Match_ID, Team1_ID, Team2_ID) VALUES
(1, 200001, 200002),
(2, 200003, 200004),
(3, 200005, 200006),
(4, 200007, 200008),
(5, 200009, 200010),
(6, 200011, 200012),
(7, 200013, 200014),
(8, 200015, 200016);


select * from competition ;


  

-- inserting into issue 


INSERT INTO Issue (Equipment_Name, Sports_Name, Player_ID, Date_Time, Quantity, Return_Status)
VALUES 
('Cricket Bat', 'Cricket', 100151, '2024-03-01 10:00:00', 1, 'Not Returned'),
('Football', 'Football', 100854, '2024-03-02 14:30:00', 1, 'Not Returned'),
('Basketball', 'Basketball', 100521, '2024-03-03 11:45:00', 1, 'Not Returned'),
('Volleyball', 'Volleyball', 100653, '2024-03-04 09:20:00', 1, 'Not Returned'),
('Tennis Racket', 'Tennis', 100540, '2024-03-05 13:00:00', 1, 'Not Returned'),
('Badminton Racket', 'Badminton', 100151, '2024-03-06 15:10:00', 1, 'Not Returned'),
('Hockey Stick', 'Hockey', 100854, '2024-03-07 08:45:00', 1, 'Not Returned'),
('Baseball Bat', 'Baseball', 100653, '2024-03-08 16:20:00', 1, 'Not Returned'),
('Golf Club', 'Golf', 100521, '2024-03-09 14:00:00', 1, 'Not Returned'),
('Swimming Goggles', 'Swimming', 100540, '2024-03-10 12:30:00', 1, 'Not Returned'), 
('Cycling Helmet', 'Cycling', 100151, '2024-03-11 11:15:00', 1, 'Not Returned'),
('Boxing Gloves', 'Boxing', 100854, '2024-03-12 09:45:00', 1, 'Not Returned'),
('Wrestling Mat', 'Wrestling', 100521, '2024-03-13 08:00:00', 1, 'Not Returned'),
('Gymnastics Mat', 'Gymnastics', 100653, '2024-03-14 16:40:00', 1, 'Not Returned'),
('Athletics Shoes', 'Athletics', 100540, '2024-03-15 10:25:00', 1, 'Not Returned'),
('Cricket Bat', 'Cricket', 101055, '2024-03-16 11:30:00', 1, 'Not Returned'),
('Football', 'Football', 101256, '2024-03-17 13:20:00', 1, 'Not Returned'),
('Basketball', 'Basketball', 101457, '2024-03-18 09:15:00', 1, 'Not Returned'),
('Volleyball', 'Volleyball', 101545, '2024-03-19 12:45:00', 1, 'Not Returned'),
('Tennis Racket', 'Tennis', 101644, '2024-03-20 14:00:00', 1, 'Not Returned'),
('Badminton Racket', 'Badminton', 101949, '2024-03-21 09:30:00', 1, 'Not Returned'),
('Hockey Stick', 'Hockey', 102043, '2024-03-22 08:10:00', 1, 'Not Returned'),
('Baseball Bat', 'Baseball', 102141, '2024-03-23 15:20:00', 1, 'Not Returned'),
('Golf Club', 'Golf', 102444, '2024-03-24 10:45:00', 1, 'Not Returned'),
('Swimming Goggles', 'Swimming', 102537, '2024-03-25 12:00:00', 1, 'Not Returned'),
('Cycling Helmet', 'Cycling', 102839, '2024-03-26 11:30:00', 1, 'Not Returned'),
('Boxing Gloves', 'Boxing', 102932, '2024-03-27 09:15:00', 1, 'Not Returned'),
('Wrestling Mat', 'Wrestling', 103033, '2024-03-28 08:20:00', 1, 'Not Returned'),
('Gymnastics Mat', 'Gymnastics', 103200, '2024-03-29 16:40:00', 1, 'Not Returned'),
('Athletics Shoes', 'Athletics', 103399, '2024-03-30 10:25:00', 1, 'Not Returned'), 
('Cricket Bat', 'Cricket', 100540, '2024-04-01 11:30:00', 1, 'Not Returned'),
('Football', 'Football', 100653, '2024-04-02 13:20:00', 1, 'Not Returned'),
('Basketball', 'Basketball', 100854, '2024-04-03 09:15:00', 1, 'Not Returned'),
('Volleyball', 'Volleyball', 101055, '2024-04-04 12:45:00', 1, 'Not Returned'),
('Tennis Racket', 'Tennis', 101256, '2024-04-05 14:00:00', 1, 'Not Returned'),
('Badminton Racket', 'Badminton', 101457, '2024-04-06 09:30:00', 1, 'Not Returned'),
('Hockey Stick', 'Hockey', 101545, '2024-04-07 08:10:00', 1, 'Not Returned'),
('Baseball Bat', 'Baseball', 101644, '2024-04-08 15:20:00', 1, 'Not Returned'),
('Golf Club', 'Golf', 101949, '2024-04-09 10:45:00', 1, 'Not Returned'),
('Swimming Goggles', 'Swimming', 102043, '2024-04-10 12:00:00', 1, 'Not Returned'), 
('Cycling Helmet', 'Cycling', 102141, '2024-04-11 11:30:00', 1, 'Not Returned'),
('Boxing Gloves', 'Boxing', 102444, '2024-04-12 09:15:00', 1, 'Not Returned'),
('Wrestling Mat', 'Wrestling', 102537, '2024-04-13 08:20:00', 1, 'Not Returned'),
('Gymnastics Mat', 'Gymnastics', 102839, '2024-04-14 16:40:00', 1, 'Not Returned'),
('Athletics Shoes', 'Athletics', 102932, '2024-04-15 10:25:00', 1, 'Not Returned'),
('Cricket Bat', 'Cricket', 103033, '2024-04-16 11:30:00', 1, 'Not Returned'),
('Football', 'Football', 103200, '2024-04-17 13:20:00', 1, 'Not Returned'),
('Basketball', 'Basketball', 103399, '2024-04-18 09:15:00', 1, 'Not Returned'),
('Volleyball', 'Volleyball', 100151, '2024-04-19 12:45:00', 1, 'Not Returned'),
('Tennis Racket', 'Tennis', 100521, '2024-04-20 14:00:00', 1, 'Not Returned'),
('Badminton Racket', 'Badminton', 100540, '2024-04-21 09:30:00', 1, 'Not Returned'),
('Hockey Stick', 'Hockey', 100653, '2024-04-22 08:10:00', 1, 'Not Returned'),
('Baseball Bat', 'Baseball', 100854, '2024-04-23 15:20:00', 1, 'Not Returned'),
('Golf Club', 'Golf', 101055, '2024-04-24 10:45:00', 1, 'Not Returned'),
('Swimming Goggles', 'Swimming', 101256, '2024-04-25 12:00:00', 1, 'Not Returned'),
('Cycling Helmet', 'Cycling', 101457, '2024-04-26 11:30:00', 1, 'Not Returned'),
('Boxing Gloves', 'Boxing', 101545, '2024-04-27 09:15:00', 1, 'Not Returned'),
('Wrestling Mat', 'Wrestling', 101644, '2024-04-28 08:20:00', 1, 'Not Returned'),
('Gymnastics Mat', 'Gymnastics', 101949, '2024-04-29 16:40:00', 1, 'Not Returned'),
('Athletics Shoes', 'Athletics', 102043, '2024-04-30 10:25:00', 1, 'Not Returned'),
('Cricket Bat', 'Cricket', 102141, '2024-05-01 11:30:00', 1, 'Not Returned'),
('Football', 'Football', 102444, '2024-05-02 13:20:00', 1, 'Not Returned'),
('Basketball', 'Basketball', 102537, '2024-05-03 09:15:00', 1, 'Not Returned'),
('Volleyball', 'Volleyball', 102839, '2024-05-04 12:45:00', 1, 'Not Returned'),
('Tennis Racket', 'Tennis', 102932, '2024-05-05 14:00:00', 1, 'Not Returned'),
('Badminton Racket', 'Badminton', 103033, '2024-05-06 09:30:00', 1, 'Not Returned'),
('Hockey Stick', 'Hockey', 103200, '2024-05-07 08:10:00', 1, 'Not Returned'),
('Baseball Bat', 'Baseball', 103399, '2024-05-08 15:20:00', 1, 'Not Returned'),
('Golf Club', 'Golf', 100151, '2024-05-09 10:45:00', 1, 'Not Returned'),
('Swimming Goggles', 'Swimming', 100540, '2024-05-10 12:00:00', 1, 'Not Returned'),
('Cycling Helmet', 'Cycling', 100653, '2024-05-11 11:30:00', 1, 'Not Returned'),
('Boxing Gloves', 'Boxing', 100854, '2024-05-12 09:15:00', 1, 'Not Returned'),
('Wrestling Mat', 'Wrestling', 101055, '2024-05-13 08:20:00', 1, 'Not Returned'),
('Gymnastics Mat', 'Gymnastics', 101256, '2024-05-14 16:40:00', 1, 'Not Returned'),
('Athletics Shoes', 'Athletics', 101457, '2024-05-15 10:25:00', 1, 'Not Returned'),
('Cricket Bat', 'Cricket', 101545, '2024-05-16 11:30:00', 1, 'Not Returned'),
('Football', 'Football', 101644, '2024-05-17 13:20:00', 1, 'Not Returned'),
('Basketball', 'Basketball', 101949, '2024-05-18 09:15:00', 1, 'Not Returned'),
('Volleyball', 'Volleyball', 102043, '2024-05-19 12:45:00', 1, 'Not Returned'),
('Tennis Racket', 'Tennis', 102141, '2024-05-20 14:00:00', 1, 'Not Returned'),
('Badminton Racket', 'Badminton', 102444, '2024-05-21 09:30:00', 1, 'Not Returned'),
('Hockey Stick', 'Hockey', 102537, '2024-05-22 08:10:00', 1, 'Not Returned'),
('Baseball Bat', 'Baseball', 102839, '2024-05-23 15:20:00', 1, 'Not Returned'),
('Golf Club', 'Golf', 102932, '2024-05-24 10:45:00', 1, 'Not Returned'),
('Swimming Goggles', 'Swimming', 103033, '2024-05-25 12:00:00', 1, 'Not Returned'),
('Cycling Helmet', 'Cycling', 103200, '2024-05-26 11:30:00', 1, 'Not Returned'),
('Boxing Gloves', 'Boxing', 103399, '2024-05-27 09:15:00', 1, 'Not Returned'),
('Wrestling Mat', 'Wrestling', 100151, '2024-05-28 08:20:00', 1, 'Not Returned'),
('Gymnastics Mat', 'Gymnastics', 100540, '2024-05-29 16:40:00', 1, 'Not Returned'),
('Athletics Shoes', 'Athletics', 100653, '2024-05-30 10:25:00', 1, 'Not Returned'),
('Cricket Bat', 'Cricket', 100854, '2024-06-01 11:30:00', 1, 'Not Returned'),
('Football', 'Football', 101055, '2024-06-02 13:20:00', 1, 'Not Returned'),
('Basketball', 'Basketball', 101256, '2024-06-03 09:15:00', 1, 'Not Returned'),
('Volleyball', 'Volleyball', 101457, '2024-06-04 12:45:00', 1, 'Not Returned'),
('Tennis Racket', 'Tennis', 101545, '2024-06-05 14:00:00', 1, 'Not Returned'),
('Badminton Racket', 'Badminton', 101644, '2024-06-06 09:30:00', 1, 'Not Returned'),
('Hockey Stick', 'Hockey', 101949, '2024-06-07 08:10:00', 1, 'Not Returned'),
('Baseball Bat', 'Baseball', 102043, '2024-06-08 15:20:00', 1, 'Not Returned'),
('Golf Club', 'Golf', 102141, '2024-06-09 10:45:00', 1, 'Not Returned'),
('Swimming Goggles', 'Swimming', 102444, '2024-06-10 12:00:00', 1, 'Not Returned');

Select * from Issue ;


