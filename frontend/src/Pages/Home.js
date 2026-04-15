import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch posts from your backend
        API.get('/posts')
            .then(res => setPosts(res.data))
            .catch(err => console.error("Error fetching posts:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="home-page">
            {/* ─── HEADER SECTION (Original) ─── */}
            <header className="header">
                <div className="header-overlay">
                    <span className="eyebrow">Professional Guitarist Portfolio</span>
                    <h1>STRUMMING THROUGH LIFE</h1>
                    <p className="subtitle">Crafting melodies through discipline and passion.</p>
                </div>
            </header>

            <div className="content">
                {/* ─── HERO SECTION (Original) ─── */}
                <section className="hero">
                    <div className="hero-text">
                        <h2>Welcome to My Journey</h2>
                        <p>
                            Explore the evolution of a self-taught guitarist, from mastering 
                            basic scales to performing rock anthems on stage.
                        </p>
                    </div>
                    <div className="hero-image-wrapper">
                        <img src="/assets/img.jpeg" alt="Electric guitar on stand" className="hero-img" />
                    </div>
                </section>

                {/* ─── MILESTONES SECTION (Original) ─── */}
                <section className="highlights">
                    <div className="section-title">
                        <h3>Musical Milestones</h3>
                        <p>Key moments that defined my rhythm</p>
                    </div>

                    <div className="highlight-grid">
                        <div className="card">
                            <div className="card-glow"></div>
                            <div className="card-content">
                                <h4>Church Worship</h4>
                                <p>Active guitar player for the local worship band, bringing spirit through sound.</p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-glow"></div>
                            <div className="card-content">
                                <h4>Competitions</h4>
                                <p>Tested skills and stage presence through various local guitar competitions.</p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-glow"></div>
                            <div className="card-content">
                                <h4>Technical Mastery</h4>
                                <p>Full mastery of Major scales; currently exploring Minor Pentatonic and Blues.</p>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-glow"></div>
                            <div className="card-content">
                                <h4>TV Performance</h4>
                                <p>Showcased acoustic guitar skills in an angklung band on national television.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── DYNAMIC LATEST POSTS SECTION (New) ─── */}
                <section className="highlights" style={{ marginTop: '60px' }}>
                    <div className="section-title">
                        <h3>Latest Lessons & Tabs</h3>
                        <p>Shared insights from my practice room</p>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center' }}>Tuning the strings... (Loading)</p>
                    ) : (
                        <div className="highlight-grid">
                            {posts.length === 0 ? (
                                <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>No posts yet.</p>
                            ) : (
                                posts.map(post => (
                                    <div key={post._id} className="card">
                                        <div className="card-glow"></div>
                                        <div className="card-content">
                                            {post.image && (
                                                <img 
                                                    src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`} 
                                                    alt={post.title} 
                                                    style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
                                                />
                                            )}
                                            <h4>{post.title}</h4>
                                            <p>{post.body.substring(0, 80)}...</p>
                                            <Link to={`/posts/${post._id}`} style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 'bold', textDecoration: 'none' }}>
                                                READ MORE →
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Home;