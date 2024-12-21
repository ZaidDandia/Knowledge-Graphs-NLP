import React, { useState } from "react";
import { Box, Typography, Button, Paper, LinearProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

const DatasetUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const navigate = useNavigate(); // React Router's useNavigate hook

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus(""); // Reset upload status
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    setIsUploading(true); // Start the upload process
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Extracted text:", data.extracted_text); // Log extracted text
        setUploadStatus("File uploaded successfully!");

        // Cleanup: Clear file state
        setSelectedFile(null);

        // Redirect to the Knowledge Graph display page
        setTimeout(() => {
          navigate("/kg-display"); // Redirect to the desired route
        }, 2000); // Add a delay for better UX
      } else {
        setUploadStatus("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred during file upload.");
    } finally {
      setIsUploading(false); // Stop the upload process
    }
  };

  return (
    <Box sx={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Upload Dataset
      </Typography>
      <Paper elevation={3} sx={{ padding: "20px", textAlign: "center" }}>
        <Typography variant="body1" gutterBottom>
          Select a text file (.txt, .pdf, or .docx) to upload.
        </Typography>
        <input
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={handleFileChange}
          style={{ marginBottom: "20px" }}
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
        {isUploading && <LinearProgress sx={{ marginTop: "10px" }} />}
        {uploadStatus && (
          <Typography
            variant="body2"
            color={uploadStatus.includes("success") ? "green" : "red"}
            sx={{ marginTop: "10px" }}
          >
            {uploadStatus}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default DatasetUpload;
