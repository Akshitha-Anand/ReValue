const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");


// Create Post
router.post("/", authMiddleware, upload.single("image"), postController.createPost);

// Get all posts
router.get("/", postController.getAllPosts);

// Get single post
router.get("/:id", postController.getPostById);


module.exports = router;