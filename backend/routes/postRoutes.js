const express = require("express");
const router = express.Router();
const { createPost, getAllPosts, getLatestPosts } = require("../controllers/postController");
const multer = require("multer");

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // make sure uploads folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });
router.get("/latest", async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
    res.json(posts);
});
// Routes
router.post("/", upload.single("image"), createPost);
router.get("/", getAllPosts);
router.get("/latest", getLatestPosts);
module.exports = router;
