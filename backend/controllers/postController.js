const Post = require("../models/Post");


// CREATE POST
exports.createPost = async (req, res) => {
    try {
        const { title, description, category, condition, location, weight, unit, priceMin, priceMax, pincode } = req.body;

        const image = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

        const post = new Post({
            createdBy: req.user.id,
            title, description, category, condition, location,
            weight, unit, priceMin, priceMax, pincode, image
        });

        await post.save();

        res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating post",
            error: error.message
        });
    }
};



// GET ALL POSTS (FEED)
exports.getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find()
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });

        res.json(posts);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching posts",
            error: error.message
        });
    }
};



// GET SINGLE POST
exports.getPostById = async (req, res) => {
    try {

        const post = await Post.findById(req.params.id)
            .populate("createdBy", "name email role");

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        res.json(post);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};