import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./database.db");

db.run(`
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT,
    filepath TEXT,
    filesize INTEGER,
    created_at TEXT
  )
`);

export default db;
