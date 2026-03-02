const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

title: String,

description: String,

category: String,

condition: String,

quantity: String,

image: String,

createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

status: {
    type: String,
    enum: ["available", "requested", "accepted", "completed"],
    default: "available"
},

collectorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
},

createdAt: {
    type: Date,
    default: Date.now
}

});

module.exports = mongoose.model("Post", postSchema);