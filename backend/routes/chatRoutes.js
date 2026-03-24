const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const User = require("../models/User");

// Get all conversations for a user
router.get("/conversations/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all unique senders/receivers this user has interacted with
    const messages = await Chat.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    const contactsMap = {};

    for (const msg of messages) {
      const otherId = msg.sender.toString() === userId ? msg.receiver.toString() : msg.sender.toString();
      if (!contactsMap[otherId]) {
        const otherUser = await User.findById(otherId).select("name role");
        if (otherUser) {
          contactsMap[otherId] = {
            id: otherId,
            name: otherUser.name,
            role: otherUser.role,
            lastMsg: msg.message,
            time: msg.createdAt,
            avatar: otherUser.name.charAt(0)
          };
        }
      }
    }

    res.json(Object.values(contactsMap));
  } catch (err) {
    res.status(500).json({ message: "Error fetching conversations", error: err.message });
  }
});

// Get message history between two users
router.get("/messages/:userId/:contactId", async (req, res) => {
  try {
    const { userId, contactId } = req.params;
    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err.message });
  }
});

module.exports = router;