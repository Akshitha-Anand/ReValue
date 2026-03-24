const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const {
            name, email, password, role, phone,
            // Collector fields
            collectorType, hubLocation, areasServed, materialsAccepted, vehicleType, operatingHours,
            // Industry fields
            industryType, contactPerson, gstin, companyWebsite, businessAddress, monthlyDemand, materialsRequired
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name, email, phone, role,
            password: hashedPassword,
            // Collector fields
            ...(role === 'collector' ? { collectorType, hubLocation, areasServed, materialsAccepted, vehicleType, operatingHours } : {}),
            // Industry fields
            ...(role === 'industry' ? { industryType, contactPerson, gstin, companyWebsite, businessAddress, monthlyDemand, materialsRequired } : {}),
        });

        await user.save();

        // Generate token (same as login)
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "revalue_secret_2025",
            { expiresIn: "1d" }
        );

        res.status(201).json({
            token,
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};