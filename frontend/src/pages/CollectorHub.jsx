import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, TrendingUp, DollarSign, ArrowRight, Building, Plus, Trash2, MessageSquare } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import './CollectorHub.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const demoInventory = [
    { _id: 'h1', material: 'Plastic (PET)', quantity: 340, unit: 'kg', avgCostPaid: 12, marketRate: 18, buyer: null },
    { _id: 'h2', material: 'Paper / Cardboard', quantity: 520, unit: 'kg', avgCostPaid: 8, marketRate: 11, buyer: null },
    { _id: 'h3', material: 'Metal (Aluminum)', quantity: 95, unit: 'kg', avgCostPaid: 89, marketRate: 120, buyer: 'EcoCycle Industries' },
    { _id: 'h4', material: 'E-Waste', quantity: 22, unit: 'kg', avgCostPaid: 110, marketRate: 180, buyer: null },
];

const demoPurchases = [
    { date: '2025-03-09', seller: 'Priya Sharma', material: 'Plastic (PET)', weight: '50 kg', paid: '₹600', status: 'received' },
    { date: '2025-03-08', seller: 'Rajan Mehta', material: 'Paper', weight: '120 kg', paid: '₹960', status: 'received' },
    { date: '2025-03-06', seller: 'Amit Kumar', material: 'E-Waste', weight: '9 kg', paid: '₹990', status: 'in-transit' },
];

const CollectorHub = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [inventory, setInventory] = useState(demoInventory);

    const totalCollected = inventory.reduce((s, i) => s + i.quantity, 0);
    const totalSpent = demoPurchases.reduce((s, p) => s + parseInt(p.paid.replace(/[₹,]/g, '')), 0);
    const potentialRevenue = inventory.reduce((s, i) => s + (i.quantity * i.marketRate), 0);
    const profit = potentialRevenue - totalSpent;

    const inventoryChartData = {
        labels: inventory.map(i => i.material),
        datasets: [{
            data: inventory.map(i => i.quantity),
            backgroundColor: ['#3b82f6', '#f59e0b', '#6b7280', '#ef4444'],
            borderWidth: 2, borderColor: '#1e293b',
        }]
    };

    const revenueChartData = {
        labels: inventory.map(i => i.material.split(' ')[0]),
        datasets: [
            { label: 'Cost Paid (₹/kg)', data: inventory.map(i => i.avgCostPaid), backgroundColor: 'rgba(239,68,68,0.7)', borderRadius: 4 },
            { label: 'Market Rate (₹/kg)', data: inventory.map(i => i.marketRate), backgroundColor: 'rgba(16,185,129,0.7)', borderRadius: 4 },
        ]
    };

    return (
        <div className="hub-page animate-fade-in">
            <div className="section-header">
                <h1>My Collection Hub</h1>
                <p className="subtitle">Manage your collected inventory, track purchases, and sell bulk to industries.</p>
            </div>

            {/* Stats Row */}
            <div className="hub-stats-row">
                <div className="hub-stat glass-pane">
                    <Package size={28} color="#10b981" />
                    <div><h3>{totalCollected} kg</h3><p>Total Collected</p></div>
                </div>
                <div className="hub-stat glass-pane">
                    <DollarSign size={28} color="#ef4444" />
                    <div><h3>₹{totalSpent.toLocaleString()}</h3><p>Total Spent on Purchases</p></div>
                </div>
                <div className="hub-stat glass-pane">
                    <TrendingUp size={28} color="#0ea5e9" />
                    <div><h3>₹{potentialRevenue.toLocaleString()}</h3><p>Potential Revenue</p></div>
                </div>
                <div className="hub-stat glass-pane" style={{ borderColor: profit > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)' }}>
                    <TrendingUp size={28} color={profit > 0 ? '#10b981' : '#ef4444'} />
                    <div><h3 style={{ color: profit > 0 ? '#10b981' : '#ef4444' }}>₹{profit.toLocaleString()}</h3><p>Estimated Profit</p></div>
                </div>
            </div>

            {/* Charts */}
            <div className="hub-charts-row">
                <div className="chart-card glass-pane">
                    <h2>Inventory Distribution</h2>
                    <div style={{ height: 240 }}>
                        <Doughnut data={inventoryChartData}
                            options={{ responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right', labels: { color: '#f1f5f9' } } } }} />
                    </div>
                </div>
                <div className="chart-card glass-pane span-2">
                    <h2>Buy Price vs Market Rate (₹/kg)</h2>
                    <div style={{ height: 240 }}>
                        <Bar data={revenueChartData}
                            options={{
                                responsive: true, maintainAspectRatio: false,
                                scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8' } } },
                                plugins: { legend: { labels: { color: '#f1f5f9' } } }
                            }} />
                    </div>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="glass-pane hub-table-card">
                <div className="hub-table-header">
                    <h2>Hub Inventory</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/marketplace')}>
                        <Plus size={16} /> Buy More
                    </button>
                </div>
                <div className="table-wrapper">
                    <table className="hub-table">
                        <thead>
                            <tr><th>Material</th><th>Quantity</th><th>Avg Cost Paid</th><th>Market Rate</th><th>Profit Margin</th><th>Buyer</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => {
                                const margin = (((item.marketRate - item.avgCostPaid) / item.avgCostPaid) * 100).toFixed(0);
                                return (
                                    <tr key={item._id}>
                                        <td><strong>{item.material}</strong></td>
                                        <td>{item.quantity} {item.unit}</td>
                                        <td>₹{item.avgCostPaid}/kg</td>
                                        <td className="positive">₹{item.marketRate}/kg</td>
                                        <td><span className="margin-badge positive">+{margin}%</span></td>
                                        <td>{item.buyer ? <span className="buyer-chip">{item.buyer}</span> : <span className="no-buyer">—</span>}</td>
                                        <td>
                                            <button className="btn btn-outline icon-btn-sm" onClick={() => navigate('/organizations')}>
                                                <MessageSquare size={14} /> Sell
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Purchases */}
            <div className="glass-pane hub-table-card">
                <h2>Recent Purchases from Individuals</h2>
                <div className="table-wrapper">
                    <table className="hub-table">
                        <thead><tr><th>Date</th><th>Seller</th><th>Material</th><th>Weight</th><th>Amount Paid</th><th>Status</th></tr></thead>
                        <tbody>
                            {demoPurchases.map((p, i) => (
                                <tr key={i}>
                                    <td>{p.date}</td>
                                    <td>{p.seller}</td>
                                    <td>{p.material}</td>
                                    <td>{p.weight}</td>
                                    <td className="positive">{p.paid}</td>
                                    <td><span className={`status-chip ${p.status}`}>{p.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CollectorHub;
