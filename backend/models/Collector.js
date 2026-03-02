const mongoose = require("mongoose");

const collectorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    phone: {
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

    collectorType: {
        type: String,
        enum: ["individual", "industry_employee"],
        required: true
    },

    industryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
        default: null
    },

    location: {
        type: String,
        required: true
    },

    available: {
        type: Boolean,
        default: true
    },

    totalPickups: {
        type: Number,
        default: 0
    },

    earnings: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Collector", collectorSchema);