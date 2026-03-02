const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const verifyIndustry = require("../middleware/verifyIndustry");

router.post("/register", verifyIndustry, registerUser);
router.post("/login", loginUser);

module.exports = router;