const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Collector = require("../models/Collector");
const Industry = require("../models/Industry");


// REGISTER API
router.post("/", async (req, res) => {

    try {

        const { role } = req.body;

        if (role === "individual") {

            const newUser = new User(req.body);
            await newUser.save();

            res.json({ message: "Individual registered successfully" });

        }

        else if (role === "collector") {

            const newCollector = new Collector(req.body);
            await newCollector.save();

            res.json({ message: "Collector registered successfully" });

        }

        else if (role === "industry") {

            const newIndustry = new Industry(req.body);
            await newIndustry.save();

            res.json({ message: "Industry registered successfully" });

        }

        else {

            res.status(400).json({ message: "Invalid role" });

        }

    }

    catch (error) {

        console.log(error);
        res.status(500).json({ message: "Error registering user" });

    }

});

module.exports = router;