const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Send message (text or image)
router.post("/message", upload.single("image"), async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    const image = req.file ? req.file.filename : null;

    const chat = await Chat.findById(chatId);
    chat.messages.push({ sender: senderId, text, image });
    await chat.save();
    res.json({ success: true, chat });
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err });
  }
});

module.exports = router;