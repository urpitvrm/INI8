# Patient Document Portal — Design Document

This document follows the assignment instructions and covers architecture, stack choices, API specifications, data flow, and assumptions.

---

## 1. Tech Stack Choices

### Q1. Frontend Framework
**React (Vite)**  
- Component-based architecture for reusable UI elements  
- Easy to manage state and form inputs  
- Integrates easily with Axios for API calls  
- Fast development using Vite

### Q2. Backend Framework
**Node.js + Express**  
- Lightweight and simple REST API development  
- Multer middleware simplifies PDF upload handling  
- Works seamlessly with SQLite  
- Minimal boilerplate code

### Q3. Database
**SQLite3**  
- File-based database with zero setup  
- Perfect for a single-user, local environment  
- Easy to read/write metadata  
- Can scale to PostgreSQL if needed

### Q4. Supporting 1,000 Users
- Move database from SQLite → PostgreSQL or MySQL  
- Store files in cloud storage (AWS S3 / GCS)  
- Add authentication (JWT/OAuth)  
- Implement pagination for document list  
- Use caching (Redis) for frequently accessed data  
- Deploy backend with a reverse proxy (Nginx)  

---

## 2. Architecture Overview

### System Flow
[React Frontend]
|
v
[Express Backend] -----> [uploads/ Folder] (stores actual PDFs)
|
v
[SQLite Database] (stores metadata: id, filename, filepath, filesize, created_at)



### Flow Description
1. User selects a PDF in frontend.  
2. Frontend sends POST request to backend `/documents/upload`.  
3. Backend stores file in `uploads/` folder.  
4. Metadata is recorded in SQLite.  
5. Frontend lists all documents, allows view/download/delete actions.

---

## 3. API Specification

### 1. Upload PDF
- **URL:** `/documents/upload`  
- **Method:** POST  
- **Request:** multipart/form-data, field: `file`  
- **Response:**
```json
{
  "message": "File uploaded",
  "id": 3
}
