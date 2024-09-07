// backend/index.js

const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(8080, () => {
  console.log("Server running on http://localhost:8080");
});

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // replace with your MySQL user
  password: "Mohit@6659", // replace with your MySQL password
  database: "blog_platform",
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

// EJS Views
app.get("/", (req, res) => {
  db.query("SELECT * FROM posts", (err, rows) => {
    if (err) throw err;
    res.render("index", { posts: rows });
  });
});

app.get("/post/:id", (req, res) => {
  db.query("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
    if (err) throw err;
    res.render("post", { post: row[0] });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", (req, res) => {
  const { title, content } = req.body;
  const id = uuidv4();
  db.query(
    "INSERT INTO posts (id, title, content) VALUES (?, ?,?)",
    [id, title, content],
    function (err) {
      if (err) throw err;
      res.redirect("/");
    }
  );
});

app.post("/delete/:id", (req, res) => {
  db.query("DELETE FROM posts WHERE id = ?", [req.params.id], function (err) {
    if (err) throw err;
    res.redirect("/");
  });
});

// Route to display the edit form
app.get("/edit/:id", (req, res) => {
  db.query("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, row) => {
    if (err) throw err;
    res.render("edit", { post: row[0] });
  });
});

// Route to handle the form submission for editing
app.post("/edit/:id", (req, res) => {
  const { title, content } = req.body;
  db.query(
    "UPDATE posts SET title = ?, content = ? WHERE id = ?",
    [title, content, req.params.id],
    function (err) {
      if (err) throw err;
      res.redirect("/");
    }
  );
});
