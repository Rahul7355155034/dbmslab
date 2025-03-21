-- Create Users Table (if not already created)

let query3={
    USE travell;
    CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);}
module.export=query3;
