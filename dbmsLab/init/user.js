const mysql      = require('mysql');
const passport = require('passport');
const controllerUser = require('./controllers/user');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Rahul12345@',
  database : 'travell'
});
 
connection.connect();