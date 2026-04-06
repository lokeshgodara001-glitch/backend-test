const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 🔥 upload with user + save to data.json
app.post("/upload", upload.single("file"), (req, res) => {
  const user = req.body.user;
  const filename = req.file.filename;

  const data = JSON.parse(fs.readFileSync("data.json"));
  data.push({ user, filename });

  fs.writeFileSync("data.json", JSON.stringify(data));

  console.log("Saved:", user, filename);

  res.send("File uploaded successfully");
});

// 🔥 user-wise files
app.get("/files", (req, res) => {
  const user = req.query.user;

  const data = JSON.parse(fs.readFileSync("data.json"));
  const userFiles = data
    .filter(item => item.user === user)
    .map(item => item.filename);

  res.json(userFiles);
});

// delete file
app.delete("/delete/:filename", (req, res) => {
  const filePath = "uploads/" + req.params.filename;

  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send("Delete failed");

    let data = JSON.parse(fs.readFileSync("data.json"));
    data = data.filter(item => item.filename !== req.params.filename);
    fs.writeFileSync("data.json", JSON.stringify(data));

    res.send("File deleted successfully");
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
