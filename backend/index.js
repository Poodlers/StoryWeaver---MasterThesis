// app.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cron = require("node-cron");
const cleanupFiles = require("./cleanup-files");

const app = express();
// Enable CORS
app.use(cors());

const PORT = process.env.PORT || 8080;

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Initialize multer middleware
const upload = multer({ storage: storage });

// Serve static files from the uploads directory
app.use("/files", express.static(path.join(__dirname, "files")));

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.originalname });
});

// Define a route to handle DELETE requests for files by name
app.delete("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "files", filename);

  // Delete the file
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      res.status(404).send("File not found");
    } else {
      console.log("File deleted successfully.");
      res.send("File deleted successfully.");
    }
  });
});

// Define a route to handle GET requests for files by name
app.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;

  // Set the appropriate content type based on the file extension
  const contentType = getContentType(filename);
  res.setHeader("Content-Type", contentType);

  // Serve the file from the 'uploads' directory
  res.sendFile(path.join(__dirname, "files", filename), (err) => {
    if (err) {
      console.error("Error serving file:", err);
      res.status(404).send("File not found");
    }
  });
});

// Function to determine content type based on file extension
function getContentType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".gif":
      return "image/gif";
    case ".mp4":
      return "video/mp4";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

// Start the server
app.listen(PORT, () => {
  // Schedule a cron job to run every day at midnight
  cron.schedule("0 0 * * *", () => {
    console.log("Running file cleanup task...");
    cleanupFiles(path.join(__dirname, "files"));
  });
  console.log(`Server is running on http://localhost:${PORT}`);
});
