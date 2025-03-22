
const {data}=require("./data.js");

const mysql      = require('mysql2');

// const connection = mysql.createConnection({
//   host     : 'dpg-cvertq3qf0us73fj7330-a',
//   user     : 'root',
//   password : 'W6IjEYuzQYS0wx7utOsefUzT1xloXBoz',
//   database : 'travell',
//   port :3306

// });
const connection = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect();
const insertlisting=()=>{
data.forEach((listing) => {
    const { title, description,image, price, location, country ,owner_id} = listing;
    // Create the image JSON object
    const imageJson = JSON.stringify({
      filename: image.filename, // assuming image has filename property
      url: image.url            // assuming image has url property
  });

    // Define the SQL query
    const query = `
      INSERT INTO listings (title, description, image, price, location, country,owner_id) 
      VALUES (?, ?, ?,?,  ?, ?,?)
    `;

  // Execute the query with the appropriate values
  connection.query(query, [title, description, imageJson, price, location, country,owner_id], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
    } else {
    //   console.log("Inserted listing:", title);
    }
  });
});

console.log("All listings inserted.");}
module.exports=insertlisting;
