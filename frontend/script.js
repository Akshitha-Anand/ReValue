const chatModal = document.getElementById("chatModal");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
let currentChatId = null;
let chatWithUser = null;

// Open chat modal
document.querySelectorAll(".chatBtn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
        const card = e.target.closest(".card");
        const postUserId = card.dataset.userId;
        chatWithUser = postUserId;

        // Create or fetch chat between current user and post owner
        const res = await fetch("http://localhost:5000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user1: localStorage.getItem("userId"), user2: postUserId })
        });
        const chat = await res.json();
        currentChatId = chat._id;

        document.getElementById("chatWith").textContent = `Chat with ${postUserId}`;
        chatModal.style.display = "block";
        loadChatMessages();
    });
});

async function loadChatMessages() {
    if (!currentChatId) return;
    const res = await fetch(`http://localhost:5000/api/chat/${localStorage.getItem("userId")}`);
    const chats = await res.json();
    const chat = chats.find(c => c._id === currentChatId);
    chatMessages.innerHTML = "";
    chat.messages.forEach(msg => {
        const div = document.createElement("div");
        div.className = "message" + (msg.sender === localStorage.getItem("userId") ? " self" : "");
        div.textContent = msg.text;
        chatMessages.appendChild(div);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message" + (msg.sender === localStorage.getItem("userId") ? " self" : "");

    if (msg.text) div.textContent = msg.text;
    if (msg.image) {
        const img = document.createElement("img");
        img.src = `http://localhost:5000/uploads/${msg.image}`;
        img.style.maxWidth = "150px";
        img.style.display = "block";
        div.appendChild(img);
    }
    document.getElementById("chatMessages").appendChild(div);
});
}

// Send message
document.getElementById("sendChatBtn").addEventListener("click", async () => {
    const text = chatInput.value;
    if (!text || !currentChatId) return;
    await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chatId: currentChatId,
            senderId: localStorage.getItem("userId"),
            text
        })
    });
    chatInput.value = "";
    loadChatMessages();
});
document.getElementById("sendChatBtn").addEventListener("click", async () => {
    const text = document.getElementById("chatInput").value;
    const imageFile = document.getElementById("chatImage").files[0];

    if (!text && !imageFile) return;

    const formData = new FormData();
    formData.append("chatId", currentChatId); // currentChatId should be defined when user opens a chat
    formData.append("senderId", localStorage.getItem("userId"));
    if (text) formData.append("text", text);
    if (imageFile) formData.append("image", imageFile);

    await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        body: formData
    });

    document.getElementById("chatInput").value = "";
    document.getElementById("chatImage").value = null;
    loadChatMessages(); // function to reload chat messages
});
// Close chat
function closeChat() {
    chatModal.style.display = "none";
}
setInterval(async () => {
    const res = await fetch("http://localhost:5000/api/posts/latest");
    const latestPosts = await res.json();
    // Here you can show a toast/alert/notification for new posts
}, 30000);
function startChat(userId){

localStorage.setItem("chatUserId", userId);

window.location.href = "chat.html";

}
localStorage.setItem("userId", data.user._id);