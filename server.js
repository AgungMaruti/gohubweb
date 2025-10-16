const express = require('express');
const mysql = require('mysql');
const path = require('path');
const multer = require("multer");

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

app.use(express.json());

// === GET ALL ===
app.get('/api/menu', (req, res) => {
  const sql = 'SELECT * FROM menu';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// === GET ONE ===
app.get('/api/menu/:id', (req, res) => {
  const sql = 'SELECT * FROM menu WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

// === CREATE ===
app.post('/api/menu', (req, res) => {
  const { name, price, description, image, category } = req.body;
  const sql = 'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, price, description, image, category], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Produk ditambahkan', id: result.insertId });
  });
});

// === UPDATE ===
app.put('/api/menu/:id', (req, res) => {
  const { name, price, description, image, category } = req.body;
  const sql = 'UPDATE menu SET name=?, price=?, description=?, image=?, category=? WHERE id=?';
  db.query(sql, [name, price, description, image, category, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Produk diperbarui' });
  });
});

// === DELETE ===
app.delete('/api/menu/:id', (req, res) => {
  const sql = 'DELETE FROM menu WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Produk dihapus' });
  });
});

// --- Konfigurasi tempat simpan file ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'img')); // folder img
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nama unik
  }
});

const upload = multer({ storage });

// --- Endpoint upload file ---
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Tidak ada file diupload' });
  }
  const filePath = 'img/' + req.file.filename; // path disimpan di DB nanti
  res.json({ path: filePath });
});

