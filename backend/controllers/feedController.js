const Post = require("../models/Post");

exports.getFeed = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 5;

        const posts = await Post.find()
            .populate("user", "name role")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json(posts);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};