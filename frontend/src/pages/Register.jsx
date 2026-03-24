import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
    Recycle, User, ChevronRight, ChevronLeft,
    CheckCircle, Phone, Mail, Lock, MapPin, Package, Globe, Calendar, Truck
} from 'lucide-react';
import './Auth.css';
import './Register.css';

// ─── CONSTANTS (outside component — never redefined) ─────────────────────────
const ROLES = [
    {
        id: 'individual', icon: '🧑', title: 'Individual', subtitle: 'Sell your recyclable waste',
        desc: 'Post waste items and connect with local collectors who will pick them up and pay you.',
        color: '#10b981'
    },
    {
        id: 'collector', icon: '🚛', title: 'Collector', subtitle: 'Collect & aggregate waste',
        desc: 'Buy waste from individuals, store it in your hub, and sell bulk quantities to recycling industries.',
        color: '#0ea5e9'
    },
    {
        id: 'industry', icon: '🏭', title: 'Organization', subtitle: 'Recycling company / buyer',
        desc: 'Browse collectors, purchase bulk materials and manage your supply chain of recyclables.',
        color: '#a855f7'
    },
];

const MATERIALS = ['Plastic', 'Paper', 'Metal', 'E-Waste', 'Glass', 'Organic', 'Rubber', 'Textile'];
const INDUSTRY_TYPES = ['Plastic Recycling', 'Paper Recycling', 'Metal Smelting', 'E-Waste Processing', 'Glass Recycling', 'Textile Recycling', 'Organic / Compost', 'Multi-material Facility'];
const VEHICLE_TYPES = ['Two-Wheeler', 'Auto Rickshaw', 'Mini Truck (1T)', 'Truck (5T)', 'Large Truck (10T+)', 'Multiple Vehicles'];

// ─── PURE PRESENTATIONAL COMPONENTS (outside — stable references) ────────────
const StepBar = ({ steps, current }) => (
    <div className="step-bar">
        {steps.map((step, i) => (
            <React.Fragment key={i}>
                <div className={`step-dot ${i < current ? 'done' : i === current ? 'active' : ''}`}>
                    {i < current
                        ? <CheckCircle size={16} />
                        : <span>{i + 1}</span>
                    }
                    <p className="step-label">{step}</p>
                </div>
                {i < steps.length - 1 && <div className={`step-line ${i < current ? 'done' : ''}`} />}
            </React.Fragment>
        ))}
    </div>
);

const MaterialChips = ({ selected, onToggle, label }) => (
    <div className="form-group">
        <label>{label}</label>
        <div className="chip-grid">
            {MATERIALS.map(m => (
                <button
                    key={m} type="button"
                    className={`material-chip ${selected.includes(m.toLowerCase()) ? 'selected' : ''}`}
                    onClick={() => onToggle(m.toLowerCase())}
                >
                    {m}
                </button>
            ))}
        </div>
    </div>
);

// ─── MAIN REGISTER ────────────────────────────────────────────────────────────
const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [role, setRole] = useState(null);
    const [step, setStep] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Step 1 — common account fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Step 2 — collector fields
    const [collectorType, setCollectorType] = useState('individual');
    const [hubLocation, setHubLocation] = useState('');
    const [areasServed, setAreasServed] = useState('');
    const [materialsAccepted, setMaterialsAccepted] = useState([]);
    const [vehicleType, setVehicleType] = useState('');
    const [operatingHours, setOperatingHours] = useState('');

    // Step 2 — industry fields
    const [industryType, setIndustryType] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [gstin, setGstin] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [businessAddress, setBusinessAddress] = useState('');
    const [monthlyDemand, setMonthlyDemand] = useState('');
    const [materialsRequired, setMaterialsRequired] = useState([]);

    const steps = role === 'individual'
        ? ['Choose Role', 'Account Info', 'Done']
        : ['Choose Role', 'Account Info', 'Profile Details', 'Done'];

    const toggleMaterial = (list, setFn, mat) =>
        setFn(prev => prev.includes(mat) ? prev.filter(m => m !== mat) : [...prev, mat]);

    const validateStep1 = () => {
        if (!name.trim()) return 'Full name is required.';
        if (!email.trim()) return 'Email is required.';
        if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email.';
        if (!phone.trim()) return 'Phone number is required.';
        if (password.length < 6) return 'Password must be at least 6 characters.';
        if (password !== confirmPassword) return 'Passwords do not match.';
        return null;
    };

    const handleStep1Next = () => {
        const err = validateStep1();
        if (err) { setError(err); return; }
        setError('');
        if (role === 'individual') {
            doSubmit();
        } else {
            setStep(2);
        }
    };

    const doSubmit = async () => {
        setLoading(true);
        setError('');
        try {
            const payload = {
                name, email, phone, password, role,
                ...(role === 'collector' ? {
                    collectorType, hubLocation, vehicleType, operatingHours,
                    areasServed: areasServed.split(',').map(s => s.trim()).filter(Boolean),
                    materialsAccepted,
                } : {}),
                ...(role === 'industry' ? {
                    industryType, contactPerson, gstin, companyWebsite,
                    businessAddress, monthlyDemand, materialsRequired,
                } : {}),
            };
            const res = await register(payload);
            if (res.success) {
                setStep(steps.length - 1);
                setTimeout(() => navigate('/dashboard'), 2000);
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDetailsSubmit = (e) => {
        e.preventDefault();
        doSubmit();
    };

    const currentRole = ROLES.find(r => r.id === role);

    return (
        <div className="register-container">
            <div className={`register-card glass-pane animate-fade-in ${step === 0 ? 'wide' : ''}`}>

                {/* ── Step progress bar (steps 1–2 only) ── */}
                {step > 0 && step < steps.length - 1 && (
                    <StepBar steps={steps} current={step} />
                )}

                {/* ════════ STEP 0 — ROLE SELECTION ════════ */}
                {step === 0 && (
                    <div className="role-step">
                        <div className="auth-header">
                            <div className="auth-logo">
                                <Recycle size={32} color="var(--accent-primary)" />
                                <h2 className="text-gradient">Join ReValue</h2>
                            </div>
                            <p>India's Circular Economy Marketplace. Choose the role that best describes you.</p>
                        </div>

                        <div className="role-cards">
                            {ROLES.map(r => (
                                <div
                                    key={r.id}
                                    className={`role-card ${role === r.id ? 'selected' : ''}`}
                                    style={{ '--role-color': r.color }}
                                    onClick={() => setRole(r.id)}
                                >
                                    <div className="role-card-icon">{r.icon}</div>
                                    <h3>{r.title}</h3>
                                    <p className="role-subtitle">{r.subtitle}</p>
                                    <p className="role-desc">{r.desc}</p>
                                    {role === r.id && (
                                        <div className="role-selected-check">
                                            <CheckCircle size={20} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            className="btn btn-primary next-btn"
                            disabled={!role}
                            onClick={() => setStep(1)}
                        >
                            Continue as {currentRole?.title ?? '...'} <ChevronRight size={18} />
                        </button>
                        <p className="auth-footer-text">
                            Already have an account? <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                )}

                {/* ════════ STEP 1 — ACCOUNT INFO ════════ */}
                {step === 1 && (
                    <div>
                        <h2 className="step-title">Account Information</h2>
                        <p className="step-sub">Basic details for your ReValue account.</p>
                        {error && <div className="auth-error">{error}</div>}

                        <div className="form-row-2">
                            <div className="form-group">
                                <label><User size={14} /> {role === 'industry' ? 'Organization Name' : 'Full Name'} *</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder={role === 'industry' ? 'EcoCycle Industries Pvt Ltd' : 'Your full name'}
                                />
                            </div>
                            <div className="form-group">
                                <label><Phone size={14} /> Phone Number *</label>
                                <input
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="+91 98765 43210"
                                    type="tel"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><Mail size={14} /> Email Address *</label>
                            <input
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                type="email"
                            />
                        </div>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label><Lock size={14} /> Password *</label>
                                <input
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    type="password"
                                />
                            </div>
                            <div className="form-group">
                                <label><Lock size={14} /> Confirm Password *</label>
                                <input
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat password"
                                    type="password"
                                />
                            </div>
                        </div>

                        <div className="step-nav">
                            <button type="button" className="btn btn-secondary" onClick={() => setStep(0)}>
                                <ChevronLeft size={18} /> Back
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleStep1Next}>
                                {role === 'individual' ? (loading ? 'Creating...' : 'Create Account') : 'Continue'}
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ════════ STEP 2a — COLLECTOR PROFILE ════════ */}
                {step === 2 && role === 'collector' && (
                    <form onSubmit={handleDetailsSubmit}>
                        <h2 className="step-title">Collector Profile</h2>
                        <p className="step-sub">Tell us about your collection setup so individuals can find you.</p>
                        {error && <div className="auth-error">{error}</div>}

                        <div className="form-group">
                            <label>Collector Type *</label>
                            <div className="collector-type-row">
                                {['individual', 'organization'].map(t => (
                                    <div
                                        key={t}
                                        onClick={() => setCollectorType(t)}
                                        className={`type-chip ${collectorType === t ? 'selected' : ''}`}
                                    >
                                        {t === 'individual' ? '👤 Individual Collector' : '🏢 Organization Collector'}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label><MapPin size={14} /> Hub Location / Base City *</label>
                                <input
                                    value={hubLocation}
                                    onChange={e => setHubLocation(e.target.value)}
                                    placeholder="Ex: Peenya Industrial Area, Bengaluru"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label><Truck size={14} /> Vehicle Type</label>
                                <select value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
                                    <option value="">Select vehicle</option>
                                    {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label><MapPin size={14} /> Areas You Collect From *</label>
                            <input
                                value={areasServed}
                                onChange={e => setAreasServed(e.target.value)}
                                placeholder="Ex: Koramangala, HSR Layout, Indiranagar (comma-separated)"
                                required
                            />
                            <p className="field-hint">Separate multiple areas with commas</p>
                        </div>

                        <div className="form-group">
                            <label><Calendar size={14} /> Operating Hours</label>
                            <input
                                value={operatingHours}
                                onChange={e => setOperatingHours(e.target.value)}
                                placeholder="Ex: 9am - 6pm, Monday to Saturday"
                            />
                        </div>

                        <MaterialChips
                            label="Materials You Collect *"
                            selected={materialsAccepted}
                            onToggle={mat => toggleMaterial(materialsAccepted, setMaterialsAccepted, mat)}
                        />

                        <div className="step-nav">
                            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                                <ChevronLeft size={18} /> Back
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'} <ChevronRight size={18} />
                            </button>
                        </div>
                    </form>
                )}

                {/* ════════ STEP 2b — INDUSTRY / ORGANIZATION PROFILE ════════ */}
                {step === 2 && role === 'industry' && (
                    <form onSubmit={handleDetailsSubmit}>
                        <h2 className="step-title">Organization Profile</h2>
                        <p className="step-sub">Provide your company details for verification and to find the right collectors.</p>
                        {error && <div className="auth-error">{error}</div>}

                        <div className="form-row-2">
                            <div className="form-group">
                                <label>Industry / Business Type *</label>
                                <select value={industryType} onChange={e => setIndustryType(e.target.value)} required>
                                    <option value="">Select industry type</option>
                                    {INDUSTRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Contact Person Name *</label>
                                <input
                                    value={contactPerson}
                                    onChange={e => setContactPerson(e.target.value)}
                                    placeholder="Name of primary contact"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row-2">
                            <div className="form-group">
                                <label>GSTIN Number *</label>
                                <input
                                    value={gstin}
                                    onChange={e => setGstin(e.target.value.toUpperCase())}
                                    placeholder="22AAAAA0000A1Z5"
                                    maxLength={15}
                                    required
                                    style={{ letterSpacing: '1px' }}
                                />
                                <p className="field-hint">Used for AI business verification</p>
                            </div>
                            <div className="form-group">
                                <label><Globe size={14} /> Company Website</label>
                                <input
                                    value={companyWebsite}
                                    onChange={e => setCompanyWebsite(e.target.value)}
                                    placeholder="https://yourcompany.com"
                                    type="url"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><MapPin size={14} /> Business / Plant Address *</label>
                            <input
                                value={businessAddress}
                                onChange={e => setBusinessAddress(e.target.value)}
                                placeholder="Full address of your facility"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label><Package size={14} /> Monthly Demand *</label>
                            <input
                                value={monthlyDemand}
                                onChange={e => setMonthlyDemand(e.target.value)}
                                placeholder="Ex: 50 Tons/month"
                                required
                            />
                        </div>

                        <MaterialChips
                            label="Materials Required *"
                            selected={materialsRequired}
                            onToggle={mat => toggleMaterial(materialsRequired, setMaterialsRequired, mat)}
                        />

                        <div className="verify-notice">
                            <span>🤖</span>
                            <p>Your GSTIN and company name will be verified using our AI system after registration. You'll be notified within 24 hours.</p>
                        </div>

                        <div className="step-nav">
                            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>
                                <ChevronLeft size={18} /> Back
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'} <ChevronRight size={18} />
                            </button>
                        </div>
                    </form>
                )}

                {/* ════════ DONE ════════ */}
                {step === steps.length - 1 && (
                    <div className="done-screen">
                        <div className="done-icon">🎉</div>
                        <h2>Welcome to ReValue!</h2>
                        <p>
                            Your account has been created successfully.<br />
                            {role === 'industry'
                                ? 'Our AI will verify your company details within 24 hours.'
                                : 'You can now start posting or browsing listings.'}
                        </p>
                        <div className="done-role-badge" style={{ '--role-color': currentRole?.color }}>
                            {currentRole?.icon} {currentRole?.title}
                        </div>
                        <p className="redirect-msg">Redirecting to your dashboard...</p>
                        <div className="loader-bar"><div className="loader-fill"></div></div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Register;
