const User = require("../models/User");
const bcrypt = require("bcryptjs");
const verifyIndustry = require("../utils/verifyIndustry");

exports.registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            role,
            address,
            collectorType,
            industryName,
            hubLocation
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        let verified = false;

        if (role === "industry") {

            verified = verifyIndustry(industryName);

            if (!verified) {
                return res.status(400).json({
                    message: "Industry verification failed"
                });
            }
        }

        const user = new User({

            name,
            email,
            password: hashedPassword,
            phone,
            role,
            address,
            collectorType,
            industryName,
            hubLocation,
            verified
        });

        await user.save();

        res.json({
            message: "User registered successfully",
            user
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};