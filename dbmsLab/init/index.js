
const {data}=require("./data.js");

const mysql      = require('mysql2');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Rahul12345@',
  database : 'travell'
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
