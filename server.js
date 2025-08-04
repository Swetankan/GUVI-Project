const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',           
  password: 'ambu2004',           
  database: 'student_registration'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to MySQL Database');
});
// Route to handle registration
app.post("/register", (req, res) => {
  const {
    fullName, // sent from HTML form
    dob,
    email,
    phone,
    address,
    course,
    password,
  } = req.body;

  const name = fullName; // map fullName to DB's `name` column

  const sql = `
    INSERT INTO students (name, dob, email, phone, address, course, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, dob, email, phone, address, course, password],
    (err, result) => {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ message: "Error inserting data" });
      }
      console.log("Student registered:", result.insertId);
      res.json({ message: "Registration successful" });
    }
  );
});

// Default route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
