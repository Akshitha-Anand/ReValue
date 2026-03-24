import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Recycle } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [role, setRole] = useState('individual');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note: Currently backend login uses just email/password, 
            // but we collect role here for UX clarity.
            const res = await login(email, password);
            if (res.success) {
                // If the backend returned a different role than selected, we could show a warning, 
                // but for now we just log them in.
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Invalid credentials or network error.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-pane animate-fade-in">
                <div className="auth-header">
                    <div className="auth-logo">
                        <Recycle size={40} color="var(--accent-primary)" />
                        <h1 className="text-gradient">ReValue</h1>
                    </div>
                    <p>Welcome back! Let's build a greener future.</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">

                    <div className="role-selection" style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', justifyContent: 'center' }}>
                        <button type="button" className={`role-btn ${role === 'individual' ? 'active' : ''}`} onClick={() => setRole('individual')}>
                            Individual
                        </button>
                        <button type="button" className={`role-btn ${role === 'collector' ? 'active' : ''}`} onClick={() => setRole('collector')}>
                            Collector
                        </button>
                        <button type="button" className={`role-btn ${role === 'industry' ? 'active' : ''}`} onClick={() => setRole('industry')}>
                            Industry
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Ex: user@revalue.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary auth-btn">Login as {role.charAt(0).toUpperCase() + role.slice(1)}</button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/register">Create one</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
