import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, CheckCircle, Clock, MapPin, Search, Bell } from 'lucide-react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './Chat.css';

const socket = io('http://localhost:5000');

const Chat = () => {
    const { user } = useAuth();
    const location = useLocation();

    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeContactId, setActiveContactId] = useState(location.state?.contactId || null);
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [notification, setNotification] = useState(null);

    const messagesEndRef = useRef(null);

    // Initial Load: Register with Socket and fetch Conversations
    useEffect(() => {
        if (!user) return;

        socket.emit('registerUser', user._id);

        const fetchConversations = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/chat/conversations/${user._id}`);
                setContacts(res.data);

                // If we navigated here with a contact, ensure they are in the list
                if (location.state?.contactId) {
                    const existing = res.data.find(c => c.id === location.state.contactId);
                    if (!existing) {
                        const newContact = {
                            id: location.state.contactId,
                            name: location.state.contactName || 'New Contact',
                            role: 'unknown',
                            lastMsg: '',
                            time: 'Just now',
                            avatar: (location.state.contactName || 'N').charAt(0)
                        };
                        setContacts(prev => [newContact, ...prev]);
                    }
                    setActiveContactId(location.state.contactId);
                } else if (res.data.length > 0 && !activeContactId) {
                    setActiveContactId(res.data[0].id);
                }
            } catch (err) {
                console.error("Error fetching conversations:", err);
            }
        };

        fetchConversations();

        // Socket Listeners
        socket.on('receiveMessage', (msg) => {
            // If message is from current active contact, add to messages
            if (msg.sender === activeContactId || msg.receiver === activeContactId) {
                setMessages(prev => [...prev, msg]);
            } else {
                // Otherwise show notification
                setNotification(`New message from user!`);
                setTimeout(() => setNotification(null), 3000);
            }
            // Refresh conversation list to show last message
            fetchConversations();
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, [user, activeContactId, location.state]);

    // Fetch Messages when active contact changes
    useEffect(() => {
        if (!user || !activeContactId) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/chat/messages/${user._id}/${activeContactId}`);
                setMessages(res.data);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        fetchMessages();
    }, [user, activeContactId]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const activeContact = contacts.find(c => c.id === activeContactId);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !activeContactId) return;

        const msgData = {
            senderId: user._id,
            receiverId: activeContactId,
            message: inputText.trim()
        };

        // Emit via socket (backend saves it)
        socket.emit('sendMessage', msgData);

        // Optimistically add to UI
        const tempMsg = {
            _id: Date.now(),
            sender: user._id,
            receiver: activeContactId,
            message: inputText.trim(),
            createdAt: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);
        setInputText('');
    };

    const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="chat-page animate-fade-in">
            {notification && (
                <div className="chat-notification glass-pane animate-slide-in">
                    <Bell size={18} />
                    <p>{notification}</p>
                </div>
            )}

            <div className="section-header chat-header-title">
                <h1>Messages</h1>
                <p className="subtitle">Negotiate with collectors, organizations, and individuals securely.</p>
            </div>

            <div className="chat-container glass-pane">
                {/* --- CHAT SIDEBAR --- */}
                <div className="chat-sidebar">
                    <div className="chat-search">
                        <Search size={16} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search conversations..."
                        />
                    </div>

                    <div className="chat-contact-list">
                        {filteredContacts.map(c => (
                            <div
                                key={c.id}
                                className={`chat-contact-item ${activeContactId === c.id ? 'active' : ''}`}
                                onClick={() => setActiveContactId(c.id)}
                            >
                                <div className="cc-avatar-wrap">
                                    <div className="cc-avatar">{c.avatar}</div>
                                </div>
                                <div className="cc-info">
                                    <div className="cc-top-row">
                                        <h4>{c.name}</h4>
                                        <span className="cc-time">{new Date(c.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="cc-last-msg">{c.lastMsg || 'No messages yet'}</p>
                                </div>
                            </div>
                        ))}
                        {filteredContacts.length === 0 && (
                            <div className="chat-empty-sidebar">No conversations found.</div>
                        )}
                    </div>
                </div>

                {/* --- MAIN CHAT WINDOW --- */}
                <div className="chat-main">
                    {!activeContactId ? (
                        <div className="empty-chat-state">
                            <MessageSquare size={48} />
                            <h3>Select a conversation</h3>
                            <p>Pick a contact from the left to start chatting.</p>
                        </div>
                    ) : (
                        <>
                            <div className="chat-window-header">
                                <div className="cw-profile">
                                    <div className="cc-avatar-wrap">
                                        <div className="cc-avatar">{activeContact?.avatar}</div>
                                    </div>
                                    <div>
                                        <h2>{activeContact?.name}</h2>
                                        <p className="cw-status">
                                            <span className={`badge badge-${activeContact?.role}`}>{activeContact?.role}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="chat-messages-area">
                                <div className="sys-notice">
                                    You are chatting with {activeContact?.name}. ReValue monitors chats for security.
                                </div>

                                {messages.map(msg => {
                                    const isMe = msg.sender === user._id;
                                    return (
                                        <div key={msg._id} className={`chat-bubble-wrap ${isMe ? 'mine' : 'theirs'}`}>
                                            <div className="chat-bubble">
                                                <p>{msg.message}</p>
                                                <div className="cb-meta">
                                                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {isMe && <CheckCircle size={10} style={{ marginLeft: '4px' }} />}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="chat-input-area" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type your message here..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                                <button type="submit" disabled={!inputText.trim()} className="btn btn-primary btn-icon-only">
                                    <Send size={18} />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
