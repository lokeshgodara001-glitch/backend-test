const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// file storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// upload API
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    message: "File uploaded successfully",
    file: req.file,
  });
});

// get files API
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.json([]);
    }
    res.json(files);
  });
});

// delete file API
app.delete("/delete/:name", (req, res) => {
  const fileName = req.params.name;

  fs.unlink("uploads/" + fileName, (err) => {
    if (err) {
      return res.json({ message: "Error deleting file" });
    }
    res.json({ message: "File deleted" });
  });
});

// IMPORTANT: PORT FIX (Render ke liye)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
