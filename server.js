const express = require("express");
const app = express();
const port = 8000;
const cors=require('cors');
app.use(cors());
const { Client } = require("pg");

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

// Database Connection
const connectionString = "postgresql://postgres:Aditya@localhost:5432/form_data";
const client = new Client({ connectionString });

client.connect((err) => {
  if (err) {
    console.error("Failed to connect to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});

// Serve HTML Form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

// Handle Form Submission
app.post("/user", (req, res) => {
  const { name, roll_no, gender, internship_type, company_name } = req.body;

  console.log("Received Data:", req.body);

  client.query(
    "INSERT INTO registrations (name, roll_no, gender, internship_type, company_name) VALUES ($1, $2, $3, $4, $5)",
    [name, roll_no, gender, internship_type, company_name],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err.stack);
        res.status(500).send("Error inserting data into database");
      } else {
        console.log("Data inserted successfully");
        res.sendFile(__dirname + "/success.html");
      }
    }
  );
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
