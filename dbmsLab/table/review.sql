
let query1={
  -- Create Review Table
  USE travell;
CREATE TABLE IF NOT EXISTS review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL,
    comment VARCHAR(1000),
    user_id INT,
     listing_id INT NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
     CONSTRAINT fk_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE ON UPDATE CASCADE
);
}
module.export=query2;
DROP TABLE IF EXISTS user;
