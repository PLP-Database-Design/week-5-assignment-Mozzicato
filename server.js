/** @format */

const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const dotenv = require("dotenv");
const { Console } = require("console");

app.use(express.json());
app.use(cors());
dotenv.config();

app.use(express.json());
app.use(cors());
dotenv.config();

// Set up the MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.log("Error connecting to MySQL: ", err);
    return;
  }
  console.log("Connected to MySQL as id: ", db.threadId);
});

// Setting EJS as the view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// API Routes

// 1. Retrieve all patients
app.get("/patients", (req, res) => {
  const query = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send("Database query error: " + err.message);
    }
    res.render('data', { result: result }); // Send the result as DATA
  });
});

// 2. Retrieve all providers
app.get("/providers", (req, res) => {
  const query = "SELECT first_name, last_name, provider_specialty FROM providers";
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).send("Database query error: " + err.message);
    }
    res.render('data', { result: result }); // Send the result as DATA
  });
});

// 3. Filter patients by First Name
app.get("/patients/search", (req, res) => {
  const { first_name } = req.query;
  
  if (!first_name) {
    return res.status(400).json({ error: "First name is required" });
  }

  const query = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?";
  
  db.query(query, [first_name], (err, result) => {
    if (err) {
      return res.status(500).send("Database query error: " + err.message);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No patients found with the given first name" });
    }

    res.render('data', { result: result }); // Send the result as DATA
  });
});

// 4. Retrieve all providers by their specialty
app.get("/providers/search", (req, res) => {
  const { specialty } = req.query;

  if (!specialty) {
    return res.status(400).json({ error: "Specialty is required" });
  }

  const query = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?";

  db.query(query, [specialty], (err, result) => {
    if (err) {
      return res.status(500).send("Database query error: " + err.message);
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No providers found with the given specialty" });
    }

    res.render('data', { result: result }); // Send the result as DATA
  });
});





// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);

  console.log("Sending message to browser...");
  app.get("/", (req, res) => {
    res.send("Server Started Succesfully!");
  });
});
