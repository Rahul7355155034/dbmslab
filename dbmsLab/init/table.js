
const mysql = require('mysql');
const fs = require('fs');
require('dotenv').config();
// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'Rahul12345@',
//   database : 'travell'
// });
const connection = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
ion.connect();
const insertlisting1=()=>{

    const query = fs.readFileSync('C:\Users\acer\Desktop\dbmsLab\table\relation.sql', 'utf8');
  // Execute the query with the appropriate values
  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
    } else {
    //   console.log("Inserted listing:", title);
    }
  });
}
const insertlisting2=()=>{

    const query = fs.readFileSync('C:\Users\acer\Desktop\dbmsLab\table\review.sql', 'utf8');
  // Execute the query with the appropriate values
  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
    } else {
    //   console.log("Inserted listing:", title);
    }
  });
}
const insertlisting3=()=>{

    const query = fs.readFileSync('C:\Users\acer\Desktop\dbmsLab\table\user.sql', 'utf8');
  // Execute the query with the appropriate values
  connection.query(query, (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
    } else {
    //   console.log("Inserted listing:", title);
    }
  });
}
