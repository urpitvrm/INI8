# Patient Document Portal

A full-stack application for uploading, viewing, downloading, and deleting PDF medical documents. Designed for the Full Stack Developer Assessment.

---

## Project Overview
This portal allows a single user to manage their medical PDFs. Files are stored locally in the `uploads/` folder, and metadata is stored in SQLite.

### Features
- Upload PDF files (with validation)  
- View PDF in browser  
- Download PDF  
- Delete PDF  
- List all uploaded documents  
- Clean, responsive UI  

---

## How to Run Locally

### Backend
```bash
cd backend
npm install
node server.js

### Frontend
```bash
cd frontend
npm install
npm run dev
