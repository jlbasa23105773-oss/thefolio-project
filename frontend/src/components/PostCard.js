import React, { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './PostCard.css';

const PostCard = ({ post }) => {
    const { user } = useAuth();
    const [reactions, setReactions] = useState(post.reactions || []);
    const [showPicker, setShowPicker] = useState(false);

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

    const isPostAuthor = user && post.author && user._id?.toString() === post.author._id?.toString();
    const isAdmin = user?.role === 'admin';
    const canShare = !isPostAuthor && !isAdmin;

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

    const handleReactButtonClick = (e) => {
        if (!user) {
            alert('Please login to react to posts');
            return;
        }
        setShowPicker(!showPicker);
    };

    const getTotalReactions = () => reactionSummary.reduce((sum, r) => sum + r.count, 0);

    const getReactionNames = () => {
        return reactions.map(r => r.user?.name || 'Unknown').filter(Boolean).join(', ');
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-header-top">
                    <img src={post.author?.profilePic ? `${process.env.REACT_APP_BACKEND_URL}/uploads/${post.author.profilePic}` : 'https://via.placeholder.com/40'} alt="profile" className="author-avatar" />
                    <div className="post-header-info">
                        <h4>{post.author?.name}</h4>
                        <small>{new Date(post.createdAt).toLocaleDateString()}</small>
                    </div>
                </div>
                <h3 className="post-title">{post.title}</h3>
            </div>

            <div className="post-body">
                <p>{post.body}</p>
                {post.image && <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`} alt="post" className="post-image" />}
            </div>

            {getTotalReactions() > 0 && (
                <div className="post-reactions-bar">
                    <span className="reaction-emoji-group">
                        {reactionSummary.map(r => (
                            <span key={r.value} className="reaction-emoji">{r.label}</span>
                        ))}
                    </span>
                    <span className="reaction-count-text" title={getReactionNames()}>
                        {getTotalReactions()} {getTotalReactions() === 1 ? 'person' : 'people'}
                    </span>
                </div>
            )}

            <div className="post-actions">
                <div className="reaction-container">
                    {showPicker && (
                        <div className="reaction-picker" onMouseLeave={() => setShowPicker(false)}>
                            {reactTypes.map((r) => (
                                <button
                                    key={r.value}
                                    className="reaction-option"
                                    onClick={() => handleReact(r.value)}
                                    title={r.name}
                                >
                                    <span className="reaction-emoji-large">{r.label}</span>
                                    <span className="reaction-name">{r.name}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    <button
                        className={`react-btn ${userReaction ? 'active' : ''}`}
                        onClick={handleReactButtonClick}
                        onMouseEnter={() => user && setShowPicker(true)}
                        title="React to this post"
                    >
                        {userReaction ? (
                            <>
                                <span className="reaction-emoji">{reactTypes.find(r => r.value === userReaction.type)?.label}</span>
                                <span>{reactTypes.find(r => r.value === userReaction.type)?.name}</span>
                            </>
                        ) : (
                            <>
                                <span className="like-icon">👍</span>
                                <span>Like</span>
                            </>
                        )}
                    </button>
                </div>

                <button 
                    className="comment-btn" 
                    onClick={() => {
                        // Navigate to post page where comments are shown
                        window.location.href = `/posts/${post._id}`;
                    }}
                    title="View and comment on this post"
                >
                    <span>💬</span>
                    <span>Comment</span>
                </button>

                <button
                    className="share-btn"
                    title={canShare ? 'Share this post' : 'Post author and admin cannot share'}
                    onClick={handleShare}
                    disabled={!canShare}
                >
                    <span>↗️</span>
                    <span>Share</span>
                </button>
            </div>
        </div>
    );
};

export default PostCard;