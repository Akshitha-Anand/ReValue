import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Recycle, Droplets, Zap, ShieldCheck, ArrowRight, TrendingUp, BarChart3, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    return (
        <div className="landing-page animate-fade-in">
            {/* Header / Navbar */}
            <nav className="landing-nav glass-pane">
                <div className="nav-brand text-gradient">
                    <Recycle size={28} color="var(--accent-primary)" style={{ marginRight: '8px' }} />
                    ReValue
                </div>
                <div className="nav-actions">
                    <button className="btn btn-outline" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn btn-primary" onClick={() => navigate('/register')}>Register</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Your Trash is <span className="text-gradient">Someone's Treasure</span>
                    </h1>
                    <p className="hero-subtitle">
                        Connect with recyclers, find reusable items, and make money from waste while saving the planet.
                    </p>

                    <div className="hero-stats">
                        <div className="stat-block">
                            <span className="sc-val">1,250+</span>
                            <span className="sc-lbl">Waste Posts</span>
                        </div>
                        <div className="stat-block">
                            <span className="sc-val">560+</span>
                            <span className="sc-lbl">Verified Recyclers</span>
                        </div>
                        <div className="stat-block">
                            <span className="sc-val">12.5K kg</span>
                            <span className="sc-lbl">Waste Diverted</span>
                        </div>
                    </div>

                    <div className="hero-cta-group">
                        <button className="btn btn-primary hero-btn" onClick={() => navigate('/register')}>
                            <TrendingUp size={18} /> Start Selling Waste
                        </button>
                        <button className="btn btn-outline hero-btn" onClick={() => navigate('/login')}>
                            <Search size={18} /> Explore Marketplace
                        </button>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="materials-grid">
                        <div className="m-card plastic"><img src="https://cdn-icons-png.flaticon.com/512/3062/3062060.png" alt="Plastic" /> <span>Plastic</span></div>
                        <div className="m-card ewaste"><img src="https://cdn-icons-png.flaticon.com/512/3063/3063821.png" alt="E-Waste" /> <span>E-Waste</span></div>
                        <div className="m-card paper"><img src="https://cdn-icons-png.flaticon.com/512/2965/2965707.png" alt="Paper" /> <span>Paper</span></div>
                        <div className="m-card metal"><img src="https://cdn-icons-png.flaticon.com/512/2965/2965751.png" alt="Metal" /> <span>Metal</span></div>
                        <div className="m-card organic"><img src="https://cdn-icons-png.flaticon.com/512/3063/3063822.png" alt="Organic" /> <span>Organic</span></div>
                    </div>
                </div>
            </header>

            {/* Environmental Impact Section */}
            <section className="impact-section">
                <div className="section-head">
                    <Leaf size={32} color="var(--accent-primary)" />
                    <h2>Your Environmental Impact</h2>
                    <p>Track how you're making a difference</p>
                </div>

                <div className="impact-cards">
                    <div className="impact-card glass-pane">
                        <div className="ic-icon cloud"><Globe size={24} /></div>
                        <h3>Carbon Saved</h3>
                        <p className="ic-val text-gradient">125 kg CO₂</p>
                        <p className="ic-desc">Equivalent to planting 6 trees</p>
                    </div>
                    <div className="impact-card glass-pane">
                        <div className="ic-icon water"><Droplets size={24} /></div>
                        <h3>Water Saved</h3>
                        <p className="ic-val text-gradient">2,800 L</p>
                        <p className="ic-desc">6 months of drinking water</p>
                    </div>
                    <div className="impact-card glass-pane">
                        <div className="ic-icon land"><ShieldCheck size={24} /></div>
                        <h3>Landfill Reduced</h3>
                        <p className="ic-val text-gradient">85 kg</p>
                        <p className="ic-desc">Saved from landfills</p>
                    </div>
                    <div className="impact-card glass-pane">
                        <div className="ic-icon energy"><Zap size={24} /></div>
                        <h3>Energy Saved</h3>
                        <p className="ic-val text-gradient">350 kWh</p>
                        <p className="ic-desc">Power for 1 month</p>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="mission-section">
                <div className="mission-grid">
                    <div className="mission-card glass-pane">
                        <div className="mc-icon"><BarChart3 size={24} /></div>
                        <h3>Our Vision</h3>
                        <p>Create a world where 100% of recyclable materials are recovered and reused, reducing landfill waste by 70%.</p>
                    </div>
                    <div className="mission-card glass-pane">
                        <div className="mc-icon"><Globe size={24} /></div>
                        <h3>Our Impact</h3>
                        <p>Partnering with 500+ recyclers and 10,000+ households to divert waste responsibly.</p>
                    </div>
                    <div className="mission-card glass-pane">
                        <div className="mc-icon"><TrendingUp size={24} /></div>
                        <h3>Community Driven</h3>
                        <p>Empowering local communities, waste pickers, and small recyclers with technology and fair pricing.</p>
                    </div>
                </div>

                <div className="sdg-banner">
                    <p className="sdg-title">Aligning with UN Sustainable Development Goals</p>
                    <div className="sdg-badges">
                        <span>SDG 12: Responsible Consumption</span>
                        <span>SDG 11: Sustainable Cities</span>
                        <span>SDG 13: Climate Action</span>
                        <span>SDG 8: Decent Work</span>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer">
                <p>&copy; 2026 ReValue Platform. Building a Circular Economy.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

// Polyfill missing icons for the mockup
const Search = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
