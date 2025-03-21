require('dotenv').config();
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const mysql = require("mysql2");

const bcrypt = require("bcrypt"); 
const insertlisting=require("./init/index.js");
const app = express();
const port = 3000;
//image uplaoad
const {storage}=require("./cloudconfig.js");
const multer=require("multer");
// const upload = multer({dest:"upload/"});
const upload=multer({storage});
require('dotenv').config();

// Middleware
const { isLoggedIn, savedRedirectUrl } = require("./middleware.js");
const { listingschema } = require("./schema.js");
const expreserror = require("./expresserror.js");

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rahul12345@",
  database: "travell",
});
connection.connect();

// Session Configuration
const sessionOption = {
  secret: "mysupersecrete",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOption));


// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(
  new LocalStrategy((username, password, done) => {
    const query = "SELECT * FROM users WHERE username = ?";
    connection.query(query, [username], async (err, results) => {
      if (err) return done(err);

      if (results.length === 0) {
        return done(null, false, { message: "Incorrect username." });
      }

      const user = results[0];
      const isValid = await bcrypt.compare(password, user.password); // Use bcrypt for comparison

      if (!isValid) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const query = "SELECT * FROM users WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) return done(err);
    if (results.length === 0) return done(null, false);
    const user = JSON.parse(JSON.stringify(results[0])); // Convert RowDataPacket to plain object
    done(null, user);
  });
});

//validate using middleware
const validate=(req,res,next)=>{
  let{error}=listingschema.validate(req.body);
  if(error){
    throw new expreserror(440,error.message);
  }
  else{
    next();
  }
}



// Express Configurations
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Flash Messages Middleware
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user || null;
  res.locals.results = req.listing || null;
  res.locals.results1 = req.review || null;
  console.log("hi user",req.user);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("./includes/flash.ejs", { name: req.session.username });
});

app.get("/listings", isLoggedIn, (req, res, next) => {
  // let q=`DELETE FROM listings`;
  const q = "SELECT * FROM listings";
  //  insertlisting();
  connection.query(q, (error, results) => {
    if (error) return next(error);

     // Parse 
     results.forEach((listings)=>{
      listings.image = JSON.parse(listings.image); 
    });

    res.render("./listings/index.ejs", { results });
  });
});

//new route
app.get("/listings/new",isLoggedIn,(req,res)=>{
  req.flash("success","new list is updated");
  res.render("./listings/new.ejs");
})
app.get("/listings/register",(req,res)=>{
  res.render("./listings/register.ejs");
})
// Registration Route
app.post("/listings/register", async (req, res, next) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const query = "INSERT INTO users (username, password) VALUES (?, ?)";
  connection.query(query, [username, hashedPassword], (error, result) => {
    if (error) return next(error);
    req.flash("success", "Registration successful!");
    res.redirect("/listings/login");
  });
});
app.get("/listings/login",(req,res)=>{
  res.render("./listings/login.ejs");
})
//edit
app.get("/listings/:id/edit",isLoggedIn,(req,res)=>{
  let {id}=req.params;
  let q = `SELECT * FROM listings WHERE id = ?`; 
  try{
   connection.query(q,[id],async(error,results)=>{
     if(error) throw error;
   
     res.render("./listings/edit.ejs",{results});
   });}
   catch(err){
     console.log(err);
   }
  
 });
 //review get form
 app.get("/listings/:id/review",isLoggedIn,(req,res)=>{
   let {id}=req.params;
  res.render("./reviews/review.ejs",{id});
 })
 //review post
 app.post("/listings/:id/post",isLoggedIn,(req,res,next)=>{
   let {id}=req.params;
   console.log("id",id);
   let listing_id=id;
 let {rating,comment}=req.body
 
 
   const q1 = `
   Select user_id from users 
     where username = ?`
   ; let user_id=req.user.id;
   
   
   
 const q =  `
 INSERT INTO  review (rating, comment, user_id,listing_id)
   VALUES (?,?,?,?)`
   ;
 
   try{
 
   connection.query(q1,[req.session.username],(error,results)=>{
     if(error){
       console.log(error);
     }
 
try{
 
 
   connection.query(q,[rating, comment,user_id,listing_id],(error,results)=>{
     
   
     if (error) {
       console.error("Error executing query:", error); // Log the error
       return res.status(500).send("Error inserting data into the database.");
   }
 
     res.redirect("/listings");
     
 
     })}
     catch(err){
   next(err);
       
   
     }})}
     catch(err){
       next(err);
       
   
     }
 })
 //update
 app.put("/listings/:id",isLoggedIn,(req,res)=>{
  let{id}=req.params;
  let {title,description,image,price,location,country}=req.body.listing;
  console.log(title,description,image,price,location,country);
  console.log(image);
  const q = 
  `UPDATE listings 
  SET title = ?, description = ?, image = ?, price = ?, location = ?, country = ? 
  WHERE id = ?`
;
   
  try{

connection.query(q,[title,description,image,price,location,country,id],(error,results)=>{
  if(error) throw error;

  req.flash("success","new list is updated");

  // req.flash("error","new list is updated");
  res.redirect("/listings");
  
})
  }catch(err){
    console.log(err);
  }
 });
 
  //delete
  app.delete("/listings/:id",isLoggedIn,(req,res)=>{
   let{id}=req.params;
 
  
   const q = `
  Delete from listings where id=?`
 ;
    
   try{
 
 connection.query(q,[id],(error,results)=>{
   if(error) throw error;
   res.redirect("/listings");
   
 })
   }catch(err){
     console.log(err);
   }
  });
//show 
app.get("/listings/:id",isLoggedIn,(req,res)=>{
 let {id}=req.params;
 let q = `SELECT * FROM listings WHERE id = ?`; 
 let q2 = `SELECT * FROM review where listing_id=?`; 
 try{
  connection.query(q,[id],async(error,results)=>{
    if(error) throw error;

   console.log(results);

  connection.query(q2,[id],async(error,results1)=>{
    if(error) throw error;
    console.log(results1);
      // Parse the 'image' JSON string before sending the data to the view
      results.forEach((listings)=>{
        listings.image = JSON.parse(listings.image); // Parse the image field
      });
  
    res.render("./listings/show.ejs",{results,results1})});  });
  }
  catch(err){
    console.log(err);
  }
 
});
// Login Route
app.post(
  "/listings/login",
  savedRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/listings/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.session.username = req.user.username;
    req.flash("success", "User logged in successfully");
    res.redirect("/listings");
  }
);


// new route

 app.post("/listings/new",isLoggedIn,upload.single("listing[image]"),(req,res,next)=>{
  let owner_id=req.session.username

 console.log("hi",req.session.username);

  let {title,description,price,country,location,}=req.body.listing;
    // Ensure req.file exists
    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).send("No file uploaded");
    }
  
  const imageUrl = req.file.path;
  const imageData = JSON.stringify({ url: imageUrl });
console.log("image link",imageUrl);
  const q1 = `
  Select id from users 
    where username = ?`
  ;
  // created_at,updated_at
     
    try{
  
  connection.query(q1,[req.session.username],(error,results)=>{
    
  owner_id=results[0];
  
    const q = 
   ` INSERT INTO listings ( title, description, image, price, country, location,owner_id) 
      VALUES ( ?,  ?, ?, ?, ?  , ?,?)`    ;
       
      try{
    
    connection.query(q,[title,description,imageData,price,country,location,owner_id.id],(error,results)=>{
      if (error){
        console.log(error);
      } 
      console.log(results);
      
      res.redirect("/listings");
      
    })
      }catch(err){
    next(err);
        
    
      }
  
    
  })
    }catch(err){
  next(err);
      
  
    }


 });



// Error Handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("./users/error.ejs", { message });
});

// Server Start
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
 //review
 // GET Route to Render the Edit Form
app.get("/review/:id/edit", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const query = "SELECT * FROM review WHERE id = ?";
  connection.query(query, [id], (error, results) => {
    if (error) return next(error);
    if (results.length === 0) {
      req.flash("error", "Review not found.");
      return res.redirect("/listing");
    }
    res.render("./reviews/reviewedit.ejs", { review: results[0] ,id});
  });
});

// POST for review
app.post("/review/:id/edit", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const q = "UPDATE review SET rating = ?, comment = ? WHERE id = ?";
  connection.query(q, [rating, comment, id], (error) => {
    if (error) return next(error);
    req.flash("success", "Review updated successfully.");
    res.redirect( "/listings");
    
  });
});
// DELETE reviw
app.delete("/review/:id", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  const query = "DELETE FROM review WHERE id = ?";
  connection.query(query, [id], (error) => {
    if (error) return next(error);
    req.flash("success", "Review deleted successfully.");
    res.redirect("back");
  });
});


//availalbe room
// route to display listings
app.get("/available/:id", (req, res) => {
  const query = "SELECT * FROM listings where id=?";
  let {id}=req.params;
  connection.query(query,[id], (err, listings) => {
    if (err) {
      console.error(err);
      console.log(listings);
      return res.status(500).send("Error fetching listings");
    }
    res.render("./reviews/available.ejs", { listings });
  });
});
//bookin
// route to handle booking
app.post("/book/:listing_id", isLoggedIn, (req, res) => {
  const listing_id = req.params.listing_id;
  const { room_count } = req.body;

  // First, check if there are enough available rooms
  const checkAvailabilityQuery = "SELECT available_rooms FROM listings WHERE id = ?";
  connection.query(checkAvailabilityQuery, [listing_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error checking availability");
    }

    const available_rooms = results[0].available_rooms;

    if (available_rooms < room_count) {
      return res.status(400).send("Not enough rooms available");
    }

    // Create a booking entry
    const bookingQuery = "INSERT INTO bookings (listing_id, user_id, room_count) VALUES (?, ?, ?)";
    connection.query(bookingQuery, [listing_id, req.user.id, room_count], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error booking room");
      }

      // Update the available rooms in the listings table
      const updateRoomsQuery = "UPDATE listings SET available_rooms = available_rooms - ? WHERE id = ?";
      connection.query(updateRoomsQuery, [room_count, listing_id], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error updating available rooms");
        }
        req.flash("success","booking successful");
        res.redirect("/listings");
      });
    });
  });
});
//see booking

// route to view bookings
app.get("/my-bookings", isLoggedIn, (req, res) => {
  const query = "SELECT b.id, l.title, b.room_count, b.booking_date FROM bookings b JOIN listings l ON b.listing_id = l.id WHERE b.user_id = ?";
  connection.query(query, [req.user.id], (err, bookings) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching bookings");
    }
    res.render("./reviews/my-bookings.ejs", { bookings });
  });
});


//availble in particular location
app.get("/filter", isLoggedIn, (req, res, next) => {
 
  const locationFilter = req.query.filter;

  if (!locationFilter) {
    return res.status(400).send("Location filter is required.");
  }

  let query = "SELECT * FROM listings WHERE location = ?";


  connection.query(query, [locationFilter], (error, results) => {
    if (error) return next(error);
    console.log(results);
    results.forEach(listing => {
      try {
       
        const image = JSON.parse(listing.image);
        listing.imageUrl = image.url; 
      } catch (err) {
     
        listing.imageUrl = null;
      }
    });
    res.render("./listings/index1.ejs", { results });
  });
});
