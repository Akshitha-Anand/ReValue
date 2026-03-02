const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    points: {
        type: Number,
        required: true
    },

    description: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Reward", rewardSchema);