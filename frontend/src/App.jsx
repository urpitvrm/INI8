import { useState, useEffect } from "react";
import { API } from "./api.jsx";
import "./style.css"; // custom styles

export default function App() {
  const [file, setFile] = useState(null);
  const [docs, setDocs] = useState([]);

  const fetchDocs = async () => {
    const res = await API.get("/documents");
    setDocs(res.data);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const uploadFile = async () => {
    if (!file) return alert("Please select a PDF file.");

    const form = new FormData();
    form.append("file", file);

    await API.post("/documents/upload", form);
    fetchDocs();
    setFile(null);
  };

  const deleteDoc = async (id) => {
    await API.delete(`/documents/${id}`);
    fetchDocs();
  };

  return (
    <div className="container">
      <h1 className="title">📄 Patient Document Portal</h1>

      <div className="upload-box">
        <input
          className="file-input"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button className="upload-btn" onClick={uploadFile}>
          Upload
        </button>
      </div>

      <h2 className="subtitle">Documents</h2>

      <div className="doc-list">
        {docs.map((doc) => (
          <div className="doc-card" key={doc.id}>
            <div className="doc-info">
              <p className="doc-name">{doc.filename}</p>
            </div>

            <div className="doc-actions">
              <button
                className="view-btn"
                onClick={() =>
                  window.open(
                    `http://localhost:5000/documents/${doc.id}?view=1`,
                    "_blank"
                  )
                }
              >
                View
              </button>

              <button
                className="download-btn"
                onClick={() =>
                  window.open(`http://localhost:5000/documents/${doc.id}`)
                }
              >
                Download
              </button>

              <button className="delete-btn" onClick={() => deleteDoc(doc.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {docs.length === 0 && <p className="empty">No documents uploaded yet</p>}
    </div>
  );
}
