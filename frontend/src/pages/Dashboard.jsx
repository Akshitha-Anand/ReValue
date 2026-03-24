import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate as useNav } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Leaf, Recycle, Users, Building, Activity, TrendingUp, Wind, PlusCircle, ArrowRight, Package, ShoppingCart } from 'lucide-react';
import { dashboardStats } from '../data/demoData';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Title, Tooltip, Legend);

const chartDefaults = {
    scales: {
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    },
    plugins: { legend: { labels: { color: '#f1f5f9', font: { size: 13 } } } }
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNav();

    const stats = [
        { title: 'Total Waste Listed', value: dashboardStats.totalWasteListed, icon: <Leaf size={26} />, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
        { title: 'Waste Recycled', value: dashboardStats.totalWasteRecycled, icon: <Recycle size={26} />, color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
        { title: 'Active Collectors', value: dashboardStats.activeCollectors.toLocaleString(), icon: <Users size={26} />, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
        { title: 'Partner Industries', value: dashboardStats.partnerIndustries, icon: <Building size={26} />, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
        { title: 'Total Members', value: dashboardStats.totalUsers.toLocaleString(), icon: <Users size={26} />, color: '#ec4899', bg: 'rgba(236,72,153,0.12)' },
        { title: 'CO₂ Offset', value: dashboardStats.co2Saved, icon: <Wind size={26} />, color: '#22d3ee', bg: 'rgba(34,211,238,0.12)' },
    ];

    const trendsData = {
        labels: dashboardStats.trends.labels,
        datasets: [
            {
                label: 'Waste Listed (Tons)',
                data: dashboardStats.trends.listed,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.08)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#10b981',
            },
            {
                label: 'Waste Recycled (Tons)',
                data: dashboardStats.trends.recycled,
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14,165,233,0.08)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#0ea5e9',
            }
        ]
    };

    const categoryData = {
        labels: dashboardStats.categoryShare.labels,
        datasets: [{
            data: dashboardStats.categoryShare.data,
            backgroundColor: ['#3b82f6', '#f59e0b', '#6b7280', '#ef4444', '#10b981', '#a855f7'],
            borderWidth: 2,
            borderColor: '#1e293b',
            hoverOffset: 8,
        }]
    };

    const revenueData = {
        labels: dashboardStats.trends.labels,
        datasets: [{
            label: 'Platform Revenue (₹)',
            data: dashboardStats.monthlyRevenue,
            backgroundColor: 'rgba(168,85,247,0.8)',
            borderRadius: 6,
        }]
    };

    return (
        <div className="dashboard-page animate-fade-in">

            {/* Hero Banner */}
            <div className="hero-banner glass-pane">
                <div className="hero-text">
                    <h1 className="hero-title">Welcome to <span className="text-gradient">ReValue</span></h1>
                    <p className="hero-sub">India's Circular Economy Marketplace — Turning Waste into Value, one transaction at a time.</p>
                    <div className="hero-actions">
                        {user?.role === 'individual' && (
                            <button className="btn btn-primary" onClick={() => navigate('/create-post')}>
                                <PlusCircle size={18} /> Post Your Waste
                            </button>
                        )}
                        <button className="btn btn-outline" onClick={() => navigate('/marketplace')}>
                            Browse Marketplace <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="orbit-ring">
                        <span className="orbit-icon" style={{ '--deg': '0deg' }}>♻️</span>
                        <span className="orbit-icon" style={{ '--deg': '72deg' }}>🌿</span>
                        <span className="orbit-icon" style={{ '--deg': '144deg' }}>🏭</span>
                        <span className="orbit-icon" style={{ '--deg': '216deg' }}>📦</span>
                        <span className="orbit-icon" style={{ '--deg': '288deg' }}>🔋</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid dash-stats">
                {stats.map((stat, idx) => (
                    <div key={idx} className="stat-card glass-pane">
                        <div className="stat-icon" style={{ backgroundColor: stat.bg, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <h3 style={{ color: stat.color }}>{stat.value}</h3>
                            <p>{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="charts-grid">
                <div className="chart-card glass-pane span-2">
                    <h2><TrendingUp size={20} className="inline-icon" /> Waste Listing vs Recycling Trends</h2>
                    <div className="chart-container">
                        <Line data={trendsData} options={{ ...chartDefaults, responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="chart-card glass-pane">
                    <h2><Recycle size={20} className="inline-icon" /> Material Share</h2>
                    <div className="chart-container donut-container">
                        <Doughnut
                            data={categoryData}
                            options={{
                                responsive: true, maintainAspectRatio: false,
                                cutout: '65%',
                                plugins: { legend: { position: 'right', labels: { color: '#f1f5f9', padding: 16, font: { size: 12 } } } }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="charts-grid single">
                <div className="chart-card glass-pane">
                    <h2><Activity size={20} className="inline-icon" /> Platform Revenue Growth (₹)</h2>
                    <div className="chart-container">
                        <Bar data={revenueData} options={{ ...chartDefaults, responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            {/* Role-based Quick Access */}
            {user?.role === 'individual' && (
                <div className="quick-actions-row">
                    <div className="quick-card glass-pane" onClick={() => navigate('/create-post')}>
                        <PlusCircle size={32} color="#10b981" />
                        <h3>Post Waste</h3>
                        <p>List your recyclables & get offers from collectors.</p>
                    </div>
                    <div className="quick-card glass-pane" onClick={() => navigate('/marketplace')}>
                        <ShoppingCart size={32} color="#0ea5e9" />
                        <h3>Browse Listings</h3>
                        <p>See what's posted across your region.</p>
                    </div>
                    <div className="quick-card glass-pane" onClick={() => navigate('/profile')}>
                        <Package size={32} color="#a855f7" />
                        <h3>My Posts & History</h3>
                        <p>Track your listed waste and past deals.</p>
                    </div>
                </div>
            )}

            {user?.role === 'collector' && (
                <div className="quick-actions-row">
                    <div className="quick-card glass-pane" onClick={() => navigate('/marketplace')}>
                        <ShoppingCart size={32} color="#10b981" />
                        <h3>Find Waste</h3>
                        <p>Browse individual posts to pick up.</p>
                    </div>
                    <div className="quick-card glass-pane" onClick={() => navigate('/hub')}>
                        <Package size={32} color="#f59e0b" />
                        <h3>My Hub Inventory</h3>
                        <p>View collected waste ready to sell to industries.</p>
                    </div>
                    <div className="quick-card glass-pane" onClick={() => navigate('/organizations')}>
                        <Building size={32} color="#a855f7" />
                        <h3>Contact Industries</h3>
                        <p>Offer bulk materials to recycling organizations.</p>
                    </div>
                </div>
            )}

            {user?.role === 'industry' && (
                <div className="quick-actions-row">
                    <div className="quick-card glass-pane" onClick={() => navigate('/collectors')}>
                        <Users size={32} color="#10b981" />
                        <h3>Find Collectors</h3>
                        <p>Browse collectors who supply your required materials.</p>
                    </div>
                    <div className="quick-card glass-pane" onClick={() => navigate('/tracking')}>
                        <Activity size={32} color="#0ea5e9" />
                        <h3>Track Deliveries</h3>
                        <p>Monitor your ongoing material purchases.</p>
                    </div>
                    <div className="quick-card glass-pane" onClick={() => navigate('/profile')}>
                        <Building size={32} color="#a855f7" />
                        <h3>Company Profile</h3>
                        <p>Manage your industry profile and requirements.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
