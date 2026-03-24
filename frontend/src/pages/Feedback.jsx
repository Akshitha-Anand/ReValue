import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { demoFeedback, demoCollectors, demoPosts } from '../data/demoData';
import { useAuth } from '../context/AuthContext';
import './Feedback.css';

const StarPicker = ({ value, onChange, size = 28 }) => (
    <div className="star-picker">
        {[1, 2, 3, 4, 5].map(s => (
            <Star
                key={s} size={size}
                fill={s <= value ? '#f59e0b' : 'none'}
                color={s <= value ? '#f59e0b' : '#4b5563'}
                style={{ cursor: 'pointer', transition: 'transform 0.15s' }}
                onClick={() => onChange(s)}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
        ))}
    </div>
);

const FeedbackCard = ({ fb }) => (
    <div className="feedback-card glass-pane">
        <div className="fb-header">
            <div className="fb-avatar">{fb.reviewer.charAt(0)}</div>
            <div className="fb-meta">
                <p className="fb-reviewer">{fb.reviewer}</p>
                <p className="fb-date">{fb.date}</p>
            </div>
            <div className="fb-stars">
                {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} fill={s <= fb.rating ? '#f59e0b' : 'none'} color={s <= fb.rating ? '#f59e0b' : '#4b5563'} />
                ))}
            </div>
        </div>
        <p className="fb-comment">"{fb.comment}"</p>
    </div>
);

const Feedback = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState(demoFeedback);
    const [form, setForm] = useState({ targetType: 'seller', targetName: '', rating: 0, comment: '' });
    const [submitted, setSubmitted] = useState(false);

    const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.rating === 0 || !form.comment.trim()) return;
        const newReview = {
            _id: `f${Date.now()}`, reviewer: user?.name || 'Anonymous',
            target: 'new', rating: form.rating, comment: form.comment, date: new Date().toLocaleDateString('en-IN')
        };
        setReviews(prev => [newReview, ...prev]);
        setForm({ targetType: 'seller', targetName: '', rating: 0, comment: '' });
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <div className="feedback-page animate-fade-in">
            <div className="section-header">
                <h1>Ratings & Feedback</h1>
                <p className="subtitle">Build trust in the ReValue community through transparent reviews.</p>
            </div>

            {/* Overview */}
            <div className="fb-overview glass-pane">
                <div className="fb-score-block">
                    <div className="fb-big-score">{avgRating}</div>
                    <div className="fb-score-stars">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={22} fill={s <= Math.round(+avgRating) ? '#f59e0b' : 'none'} color="#f59e0b" />
                        ))}
                    </div>
                    <p>{reviews.length} total reviews</p>
                </div>
                <div className="fb-bars">
                    {[5, 4, 3, 2, 1].map(n => {
                        const count = reviews.filter(r => r.rating === n).length;
                        const pct = reviews.length ? (count / reviews.length * 100) : 0;
                        return (
                            <div className="fb-bar-row" key={n}>
                                <span className="fb-bar-label">{n} ⭐</span>
                                <div className="fb-bar-track"><div className="fb-bar-fill" style={{ width: `${pct}%` }}></div></div>
                                <span className="fb-bar-count">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="fb-content-row">
                {/* Leave a Review */}
                <div className="leave-review glass-pane">
                    <h2>Leave a Review</h2>
                    {submitted && <div className="fb-success">✅ Review posted! Thank you.</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Reviewing a</label>
                            <select value={form.targetType} onChange={e => setForm(p => ({ ...p, targetType: e.target.value }))}>
                                <option value="seller">Individual Seller</option>
                                <option value="collector">Collector</option>
                                <option value="organization">Organization</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Name of {form.targetType}</label>
                            <input type="text" value={form.targetName} onChange={e => setForm(p => ({ ...p, targetName: e.target.value }))} placeholder={`Enter ${form.targetType} name...`} />
                        </div>

                        <div className="form-group">
                            <label>Your Rating</label>
                            <StarPicker value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
                            <p className="rating-labels">
                                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating] || 'Click to rate'}
                            </p>
                        </div>

                        <div className="form-group">
                            <label>Your Review</label>
                            <textarea value={form.comment} onChange={e => setForm(p => ({ ...p, comment: e.target.value }))}
                                placeholder="Describe your experience — quality, reliability, communication..." rows="4" required />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            <Send size={16} /> Submit Review
                        </button>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="reviews-list">
                    <h2>{reviews.length} Community Reviews</h2>
                    {reviews.map(fb => <FeedbackCard key={fb._id} fb={fb} />)}
                </div>
            </div>
        </div>
    );
};

export default Feedback;
