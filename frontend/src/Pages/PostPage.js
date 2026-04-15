import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Comments from '../components/Comments';

const PostPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [reactions, setReactions] = useState([]);
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        API.get(`/posts/${id}`)
            .then(res => {
                setPost(res.data);
                setReactions(res.data.reactions || []);
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!post) return <div className="content" style={{marginTop: '150px', textAlign: 'center'}}><p className="eyebrow">Tuning strings...</p></div>;

    const isPostAuthor = user && post.author && user._id?.toString() === post.author._id?.toString();
    const isAdmin = user?.role === 'admin';
    const canShare = !isPostAuthor && !isAdmin;
    const canEdit = user && (isPostAuthor || user.role === 'admin');

    const reactTypes = [
        { label: '👍', value: 'like', name: 'Like' },
        { label: '❤️', value: 'heart', name: 'Love' },
        { label: '😮', value: 'wow', name: 'Wow' },
        { label: '😢', value: 'sad', name: 'Sad' },
        { label: '😡', value: 'angry', name: 'Angry' }
    ];

    const reactionSummary = reactTypes
        .map(r => ({ ...r, count: reactions.filter(rx => rx.type === r.value).length }))
        .filter(r => r.count > 0);

    const userReaction = reactions.find(r => r.user?._id === user?._id);
    const totalReactions = reactionSummary.reduce((sum, r) => sum + r.count, 0);

    const handleReact = async (type) => {
        if (!user) {
            alert('Please login to react to posts');
            return;
        }
        try {
            const { data } = await API.put(`/posts/${post._id}/react`, { type });
            setReactions(data);
            setShowPicker(false);
        } catch (err) {
            console.error("Reaction error:", err);
        }
    };

    const handleShare = async () => {
        if (!canShare) {
            alert('Post authors and admins cannot share this post.');
            return;
        }

        const shareUrl = `${window.location.origin}/posts/${post._id}`;
        const shareData = {
            title: post.title,
            text: `Check out this post by ${post.author?.name || 'the author'}`,
            url: shareUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Native share cancelled or failed:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareUrl);
                alert('Post link copied to clipboard!');
            } catch (err) {
                alert('Unable to copy link. Please copy the URL manually.');
            }
        }
    };

    return (
        <div className="content">
            <div className="registration-container" style={{ marginTop: '100px', maxWidth: '900px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <span className="eyebrow">Guitar Lesson & Tabs</span>
                        <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{post.title}</h1>
                        <p className="form-subtitle">
                            Shared by <strong style={{color: 'var(--accent)'}}>{post.author?.name}</strong> • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    {canEdit && (
                        <Link to={`/edit-post/${post._id}`} id="newcolor" style={{ width: 'auto', padding: '10px 20px', textDecoration: 'none', fontSize: '0.8rem' }}>
                            Edit Lesson
                        </Link>
                    )}
                </div>

                {post.image && (
                    <div className="map-container" style={{ margin: '30px 0', padding: '0' }}>
                        <img 
                            src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`} 
                            alt={post.title} 
                            style={{ width: '100%', display: 'block' }} 
                        />
                    </div>
                )}

                <div className="modern-quote" style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontFamily: post.body.includes('|') ? 'monospace' : 'inherit',
                    lineHeight: '1.8',
                    fontSize: '1.1rem',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    {post.body}
                </div>

                {/* ===== REACTION BAR ===== */}
                {totalReactions > 0 && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 0',
                        marginTop: '30px',
                        borderTop: '1px solid #333',
                        borderBottom: '1px solid #333',
                        color: '#888',
                        fontSize: '0.9rem'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                            {reactionSummary.map(r => (
                                <span key={r.value} style={{ fontSize: '1.1rem' }}>{r.label}</span>
                            ))}
                        </span>
                        <span style={{ cursor: 'pointer' }}>
                            {totalReactions} {totalReactions === 1 ? 'person' : 'people'}
                        </span>
                    </div>
                )}

                {/* ===== REACTION BUTTONS ===== */}
                <div style={{
                    display: 'flex',
                    gap: '0',
                    padding: '12px 0',
                    marginTop: totalReactions > 0 ? '0' : '30px'
                }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        {showPicker && (
                            <div style={{
                                position: 'absolute',
                                bottom: 'calc(100% + 8px)',
                                left: '0',
                                background: '#1a1a1a',
                                border: '1px solid #333',
                                padding: '8px',
                                borderRadius: '12px',
                                display: 'flex',
                                gap: '4px',
                                zIndex: 100,
                                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)'
                            }} onMouseLeave={() => setShowPicker(false)}>
                                {reactTypes.map((r) => (
                                    <button
                                        key={r.value}
                                        onClick={() => handleReact(r.value)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '4px',
                                            color: '#ddd',
                                            fontSize: '0.7rem',
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = 'rgba(241, 196, 15, 0.2)';
                                            e.target.style.borderColor = '#f1c40f';
                                            e.target.style.color = '#f1c40f';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                                            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                            e.target.style.color = '#ddd';
                                            e.target.style.transform = 'none';
                                        }}
                                    >
                                        <span style={{ fontSize: '1.8rem', lineHeight: '1' }}>{r.label}</span>
                                        <span>{r.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={() => {
                                if (!user) {
                                    alert('Please login to react to posts');
                                    return;
                                }
                                setShowPicker(!showPicker);
                            }}
                            onMouseEnter={() => user && setShowPicker(true)}
                            style={{
                                width: '100%',
                                background: 'none',
                                border: 'none',
                                color: userReaction ? '#f1c40f' : '#888',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: userReaction ? '600' : '500',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.2s ease',
                                backgroundColor: userReaction ? 'rgba(241, 196, 15, 0.15)' : 'transparent'
                            }}
                        >
                            {userReaction ? (
                                <>
                                    <span style={{ fontSize: '1.2rem' }}>{reactTypes.find(r => r.value === userReaction.type)?.label}</span>
                                    <span>{reactTypes.find(r => r.value === userReaction.type)?.name}</span>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '1.2rem' }}>👍</span>
                                    <span>Like</span>
                                </>
                            )}
                        </button>
                    </div>

                    <button style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: '#888',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => { e.target.style.backgroundColor = 'rgba(241, 196, 15, 0.1)'; e.target.style.color = '#f1c40f'; }}
                    onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#888'; }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>💬</span>
                        <span>Comment</span>
                    </button>

                    <button style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: canShare ? '#888' : '#777',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        cursor: canShare ? 'pointer' : 'not-allowed',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        opacity: canShare ? 1 : 0.5,
                    }}
                    onClick={handleShare}
                    onMouseEnter={(e) => {
                        if (canShare) {
                            e.target.style.backgroundColor = 'rgba(241, 196, 15, 0.1)';
                            e.target.style.color = '#f1c40f';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (canShare) {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#888';
                        }
                    }}
                    title={canShare ? 'Share this post' : 'Post author and admin cannot share'}
                    disabled={!canShare}
                    >
                        <span style={{ fontSize: '1.1rem' }}>↗️</span>
                        <span>Share</span>
                    </button>
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text)', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>
                        ← Back to Feed
                    </button>
                </div>

                {/* ===== COMMENTS SECTION ===== */}
                <Comments postId={post._id} />
            </div>
        </div>
    );
};

export default PostPage;