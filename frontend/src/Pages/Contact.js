import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Contact = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState({ success: '', error: '' });
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const fetchHistory = useCallback(async () => {
        if (!user) return;

        setHistoryLoading(true);
        try {
            const { data } = await API.get('/contact');
            setHistory(data);
        } catch (err) {
            console.error('Unable to load contact history', err);
        } finally {
            setHistoryLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin');
            return;
        }

        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
            }));
            fetchHistory();
        }
    }, [user, navigate, fetchHistory]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ success: '', error: '' });

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setStatus({ success: '', error: 'Please complete all fields before sending.' });
            return;
        }

        setLoading(true);
        try {
            await API.post('/contact', {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                message: formData.message.trim(),
            });
            setStatus({ success: 'Message sent successfully! I will reply soon.', error: '' });
            setFormData(prev => ({ ...prev, message: '' }));
            fetchHistory();
        } catch (err) {
            setStatus({ success: '', error: err.response?.data?.message || 'Failed to send message. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content">
            <header className="header">
                <span className="eyebrow">Get in Touch</span>
                <h1>CONTACT ME</h1>
            </header>

            <section className="card">
                <h3>Contact Information</h3>
                <p className="form-subtitle">Feel free to reach out for collaborations or gear questions.</p>
                <p className="form-subtitle" style={{ marginTop: '15px', fontWeight: 'bold' }}>
                    📍 Lipit Tomeeng San Fabian Pangasinan
                </p>
                <div className="map-container">
                    <iframe
                        title="My Location"
                        className="map-iframe"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27265.783525559378!2d120.43934724999998!3d16.14936680000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33916dd24c7ab93f%3A0x4e3135d81da1f07c!2sLipit-Tomeeng%2C%20San%20Fabian%2C%20Pangasinan!5e1!3m2!1sen!2sph!4v1773072826678!5m2!1sen!2sph"
                    ></iframe>
                </div>
            </section>

            <section className="registration-container contact-box">
                <form className="registration-form" id="contactForm" onSubmit={handleSubmit}>
                    <h3>Send me a Message</h3>
                    <p className="form-subtitle">Have a question about gear? Drop a line below!</p>

                    {status.error && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{status.error}</p>}
                    {status.success && <p style={{ color: '#6bd26b', textAlign: 'center' }}>{status.success}</p>}

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            readOnly={!!user}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            readOnly={!!user}
                        />
                    </div>

                    <div className="form-group">
                        <label>Your Message</label>
                        <textarea
                            name="message"
                            rows="5"
                            placeholder="How can I help you today?"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" id="newcolor" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                {user && (
                    <section className="contact-history">
                        <h3>Your message history</h3>
                        {historyLoading ? (
                            <p>Loading your replies...</p>
                        ) : history.length === 0 ? (
                            <p>No previous messages yet. Your replies will appear here once the admin responds.</p>
                        ) : (
                            history.map((item) => (
                                <div key={item._id} className="message-card">
                                    <div className="message-meta">Sent {new Date(item.createdAt).toLocaleString()}</div>
                                    <p>{item.message}</p>

                                    {item.replies && item.replies.length > 0 ? (
                                        <div className="reply-list">
                                            {item.replies.map((reply, idx) => (
                                                <div key={idx} className="reply-card">
                                                    <div className="reply-meta">
                                                        Reply from {reply.repliedBy?.name || 'Admin'} on {new Date(reply.createdAt).toLocaleString()}
                                                    </div>
                                                    <p>{reply.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="reply-empty">No admin reply yet.</div>
                                    )}
                                </div>
                            ))
                        )}
                    </section>
                )}
            </section>
        </div>
    );
};

export default Contact;