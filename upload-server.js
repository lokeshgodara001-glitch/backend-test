const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();

// uploads folder auto create
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use(cors());
app.use(express.json());

// storage setup
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
  res.json({ message: "File uploaded successfully" });
});

// files list API
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) return res.json([]);
    res.json(files);
  });
});

// delete API
app.delete("/delete/:name", (req, res) => {
  fs.unlink("uploads/" + req.params.name, () => {
    res.json({ message: "Deleted" });
  });
});

// PORT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
