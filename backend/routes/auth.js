const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "revalue_secret_2025";

// ─── REGISTER ─────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
    try {
        const {
            // Common
            name, email, password, phone, role, address,
            // Collector
            collectorType, hubLocation, areasServed, materialsAccepted, vehicleType, operatingHours,
            // Industry
            industryType, gstin, companyWebsite, materialsRequired, monthlyDemand, businessAddress, contactPerson,
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            // Common
            name, email, password: hashedPassword, phone, role, address,
            // Collector-specific
            collectorType: role === "collector" ? collectorType : undefined,
            hubLocation: role === "collector" ? hubLocation : undefined,
            areasServed: role === "collector" ? (Array.isArray(areasServed) ? areasServed : (areasServed || "").split(",").map(s => s.trim()).filter(Boolean)) : [],
            materialsAccepted: role === "collector" ? (Array.isArray(materialsAccepted) ? materialsAccepted : []) : [],
            vehicleType: role === "collector" ? vehicleType : undefined,
            operatingHours: role === "collector" ? operatingHours : undefined,
            // Industry-specific
            industryType: role === "industry" ? industryType : undefined,
            gstin: role === "industry" ? gstin : undefined,
            companyWebsite: role === "industry" ? companyWebsite : undefined,
            materialsRequired: role === "industry" ? (Array.isArray(materialsRequired) ? materialsRequired : []) : [],
            monthlyDemand: role === "industry" ? monthlyDemand : undefined,
            businessAddress: role === "industry" ? businessAddress : undefined,
            contactPerson: role === "industry" ? contactPerson : undefined,
            // Auto-verify individuals (only collectors/industry need manual/AI check)
            verified: role === "individual",
        });

        await newUser.save();

        // Issue token immediately so user lands on dashboard
        const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: "7d" });

        res.status(201).json({
            message: "Account created successfully.",
            token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                phone: newUser.phone,
                verified: newUser.verified,
                hubLocation: newUser.hubLocation,
                industryType: newUser.industryType,
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ─── LOGIN ─────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "No account found with this email." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password." });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

        res.json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                verified: user.verified,
                hubLocation: user.hubLocation,
                industryType: user.industryType,
                materialsAccepted: user.materialsAccepted,
                materialsRequired: user.materialsRequired,
                monthlyDemand: user.monthlyDemand,
                collectorType: user.collectorType,
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;