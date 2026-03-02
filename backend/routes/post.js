const express = require("express");
const router = express.Router();
const multer = require("multer");

const Post = require("../models/Post");


// STORAGE CONFIG
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({ storage });


// CREATE POST WITH IMAGE
router.post("/create", upload.single("image"), async (req, res) => {

    try {

        const newPost = new Post({

            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            quantity: req.body.quantity,
            price: req.body.price,
            condition: req.body.condition,
            location: req.body.location,
            image: req.file ? req.file.filename : null

        });

        await newPost.save();

        res.json({
            message: "Post created with image",
            post: newPost
        });

    } catch (error) {

        res.status(500).json({
            message: "Error creating post",
            error
        });

    }

});


// GET ALL POSTS
router.get("/all", async (req, res) => {

    try {

        const posts = await Post.find();

        res.json(posts);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching posts"
        });

    }

});

module.exports = router;