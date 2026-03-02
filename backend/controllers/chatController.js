const Chat = require("../models/Chat");
const User = require("../models/User");

exports.sendMessage = async (req, res) => {

    const { senderId, receiverId, message } = req.body;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (
        sender.role === "individual" &&
        receiver.role !== "collector"
    ) {
        return res.status(403).json({
            message: "Individuals can only chat with collectors"
        });
    }

    if (
        sender.role === "industry" &&
        receiver.role !== "collector"
    ) {
        return res.status(403).json({
            message: "Industry can only chat with collectors"
        });
    }

    const chat = new Chat({

        sender: senderId,
        receiver: receiverId,
        message
    });

    await chat.save();

    res.json(chat);

};