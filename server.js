// --- Import module ---
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

// --- Setup express app ---
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// --- Koneksi ke database ---
const db = mysql.createConnection({
  host: "localhost", // biasanya localhost
  user: "root", // username default phpMyAdmin
  password: "", // kalau di XAMPP biasanya kosong
  database: "gohub_db", // nama database kamu
});

// --- Cek koneksi ---
db.connect((err) => {
  if (err) {
    console.error("❌ Gagal konek ke database:", err);
  } else {
    console.log("✅ Berhasil konek ke database MySQL");
  }
});

// --- API GET menu makanan ---
app.get("/api/food", (req, res) => {
  const sql = "SELECT * FROM food_menu";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// --- API GET menu minuman ---
app.get("/api/drink", (req, res) => {
  const sql = "SELECT * FROM drink_menu";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// --- Jalankan server ---
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
