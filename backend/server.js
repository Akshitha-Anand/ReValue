require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const feedRoutes = require("./routes/feedRoutes");
const chatRoutes = require("./routes/chatRoutes");

const Chat = require("./models/Chat");
const User = require("./models/User");

const app = express();

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/feed", feedRoutes);
app.use("/api/chat", chatRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});


// store online users
let onlineUsers = {};

io.on("connection", socket => {

    console.log("User connected:", socket.id);

    socket.on("registerUser", userId => {

        onlineUsers[userId] = socket.id;

    });


    socket.on("sendMessage", async data => {

        const { senderId, receiverId, message } = data;

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        // role restriction
        if (
            sender.role === "individual" &&
            receiver.role !== "collector"
        ) return;

        if (
            sender.role === "industry" &&
            receiver.role !== "collector"
        ) return;


        const chat = new Chat({
            sender: senderId,
            receiver: receiverId,
            message
        });

        await chat.save();


        const receiverSocket = onlineUsers[receiverId];

        if (receiverSocket) {

            io.to(receiverSocket).emit("receiveMessage", chat);

        }

    });


    socket.on("disconnect", () => {

        for (let userId in onlineUsers) {

            if (onlineUsers[userId] === socket.id) {

                delete onlineUsers[userId];

                break;
            }

        }

    });

});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
