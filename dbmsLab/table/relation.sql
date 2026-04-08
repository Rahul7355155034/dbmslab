let query1={
    CREATE DATABASE IF NOT EXISTS travell;
USE travell;

CREATE TABLE IF NOT EXISTS listings (
     id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(50),
    image VARCHAR(1000),
    price INT,
    location VARCHAR(1000),
    country VARCHAR(50),
  description VARCHAR(1000),
    owner_id INT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
   
    CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE

);}
module.export=query1;
