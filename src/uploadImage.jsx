import React, { useState } from "react";
import axios from "axios";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error uploading image:", error);
      setResult({ error: "Failed to get prediction" });
    }
    setLoading(false);
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload an Image for Prediction</h2>
      <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Upload & Predict"}
      </button>
      <button onClick={handleClear} style={{ marginLeft: "10px" }}>
        Clear
      </button>

      {file && (
        <div style={{ marginTop: "20px" }}>
          <h3>Uploaded Image:</h3>
          <img 
            src={URL.createObjectURL(file)} 
            alt="Uploaded Preview" 
            style={{ width: "400px", borderRadius: "10px", marginTop: "10px" }} 
          />
        </div>
      )}

      {result && result.predictions && (
        <div style={{ marginTop: "20px" }}>
          <h3>Prediction Result:</h3>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {result.predictions.map((prediction, index) => (
              <li key={index} style={{ fontSize: "18px", marginBottom: "5px" }}>
                <strong>{prediction.tagName}:</strong> {(prediction.probability * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
