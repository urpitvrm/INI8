import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadFolder = "./uploads";
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  }
});

// ---------------------- APIs --------------------------

// Upload PDF
app.post("/documents/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  db.run(
    "INSERT INTO documents (filename, filepath, filesize, created_at) VALUES (?, ?, ?, ?)",
    [file.originalname, file.path, file.size, new Date().toISOString()],
    function () {
      res.json({ message: "File uploaded", id: this.lastID });
    }
  );
});

// List all documents
app.get("/documents", (req, res) => {
  db.all("SELECT * FROM documents", (err, rows) => {
    res.json(rows);
  });
});

// Download OR View file
app.get("/documents/:id", (req, res) => {
  db.get("SELECT * FROM documents WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ error: "Not found" });

    const filePath = row.filepath;
    const fileName = row.filename;

    if (req.query.view === "1") {
      // Inline view
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=" + fileName);
      fs.createReadStream(filePath).pipe(res);
    } else {
      // Download
      res.download(filePath, fileName);
    }
  });
});


// Delete a document
app.delete("/documents/:id", (req, res) => {
  db.get("SELECT * FROM documents WHERE id = ?", [req.params.id], (err, row) => {
    if (!row) return res.status(404).json({ error: "Not found" });

    fs.unlinkSync(row.filepath);
    db.run("DELETE FROM documents WHERE id = ?", [req.params.id]);
    res.json({ message: "File deleted" });
  });
});

// Start server
app.listen(5000, () => console.log("Backend running on port 5000"));
