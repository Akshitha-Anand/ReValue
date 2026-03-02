const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: String,

    role: {
        type: String,
        enum: ["individual", "collector", "industry"],
        required: true
    },

    address: String,

    // collector fields
    collectorType: {
        type: String,
        enum: ["independent", "industryEmployee"]
    },

    industryName: String,

    hubLocation: String,

    // AI verification
    verified: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("User", userSchema);