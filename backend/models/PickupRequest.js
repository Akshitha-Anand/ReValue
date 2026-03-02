const mongoose = require("mongoose");

const pickupRequestSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    collectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collector",
        default: null
    },

    industryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry",
        default: null
    },

    wasteType: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "picked",
            "delivered",
            "completed"
        ],
        default: "pending"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("PickupRequest", pickupRequestSchema);