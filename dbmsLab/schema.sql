CREATE DATABASE IF NOT EXISTS  travell;
USE travell;
 CREATE TABLE IF NOT EXISTS listings
   (
    title VARCHAR(50),
    image VARCHAR(1000),
    price INT,
    location VARCHAR(50),
    country VARCHAR(50)
   );
 INSERT INTO listings
 VALUES 
 ( "Cozy Beachfront Cottage","https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",70,"paniyara","India");
