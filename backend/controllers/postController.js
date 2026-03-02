const Post = require("../models/Post");

const createPost = async (req, res) => {
    try {
        const { title, description, category, condition, quantity } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!title || !category || !condition || !quantity) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const post = new Post({
            title,
            description,
            category,
            condition,
            quantity,
            image,
            user: req.body.userId // get userId from frontend after login
        });

        await post.save();
        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        res.status(500).json({ message: "Error creating post", error });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "name email");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching posts", error });
    }
};

module.exports = { createPost, getAllPosts };
const Post = require("../models/Post");

exports.getPosts = async (req, res) => {

    try {

        const posts = await Post.find()
        .populate("userId", "name role location");

        res.json(posts);

    } catch (err) {

        res.status(500).json(err);

    }

};
const Post = require("../models/Post");


exports.acceptPost = async (req, res) => {

try {

const { postId, collectorId } = req.body;

const post = await Post.findById(postId);

if (!post)
return res.status(404).json({message:"Post not found"});


post.status = "accepted";

post.collectorId = collectorId;

await post.save();


res.json({
message:"Post accepted successfully",
post
});

} catch(err){

res.status(500).json(err);

}

};