
const express = require('express');
const mysql = require('mysql');
const path = require('path');

// Koneksi Database
const db = mysql.createConnection({
    host: 'localhost',     // ✅ perbaikan
    user: 'root',
    password: '',
    database: 'gohub'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

const app = express();

// Melayani file static seperti HTML, CSS, JS
app.use(express.static(__dirname));

// Route utama (halaman index)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});
// tes dana
// Jalankan server
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});

app.get('/api/menu', (req, res) => {
  const sql = 'SELECT * FROM menu';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Database error');
      return;
    }
    res.json(results);
  });
});
