import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="navbar glass-pane">
            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search for items, categories..." />
            </div>

            <div className="nav-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>
                <div className="user-greeting">
                    <p>Hello, <span className="highlight text-gradient">{user?.name.split(' ')[0]}</span>!</p>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
