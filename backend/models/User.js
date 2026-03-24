const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    // ─── Common Fields ──────────────────────────────
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    role: {
        type: String,
        enum: ["individual", "collector", "industry"],
        required: true
    },
    address: String,
    profilePicture: String,

    // ─── Individual User Fields ──────────────────────
    // (plain individuals only need common fields above)

    // ─── Collector Fields ────────────────────────────
    collectorType: {
        type: String,
        enum: ["individual", "organization"],  // individual collector vs org-affiliated
        default: null
    },
    hubLocation: { type: String, trim: true },         // physical hub address / city
    areasServed: { type: [String], default: [] },       // areas/zones covered
    materialsAccepted: { type: [String], default: [] }, // plastic, paper, metal, ewaste, glass
    vehicleType: String,                                // bike / truck / auto
    operatingHours: String,                             // e.g. "9am-6pm Mon-Sat"

    // ─── Industry / Organization Fields ─────────────
    industryType: { type: String, trim: true },         // Plastic Recycling, E-Waste, etc.
    gstin: { type: String, trim: true },                // GSTIN number for verification
    companyWebsite: String,
    materialsRequired: { type: [String], default: [] }, // what they want to buy
    monthlyDemand: String,                              // e.g. "50 Tons/month"
    businessAddress: String,
    contactPerson: String,                              // point-of-contact name

    // ─── Verification & Status ───────────────────────
    verified: { type: Boolean, default: false },        // AI / admin verified
    verificationScore: { type: Number, default: 0 },    // 0-100 trust score
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model("User", userSchema);