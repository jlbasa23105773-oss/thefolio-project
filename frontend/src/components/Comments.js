import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import './Comments.css';

const Comments = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const { data } = await API.get(`/comments/${postId}`);
                setComments(data);
            } catch (err) {
                console.error("Error fetching comments:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) {
            alert('Please write a comment');
            return;
        }

        if (!user) {
            alert('Please login to comment');
            return;
        }

        setSubmitting(true);
        try {
            const { data } = await API.post(`/comments/${postId}`, {
                body: commentText
            });
            setComments([...comments, data]);
            setCommentText('');
        } catch (err) {
            console.error("Error posting comment:", err);
            alert(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;

        try {
            await API.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
        } catch (err) {
            console.error("Error deleting comment:", err);
            alert('Failed to delete comment');
        }
    };

    const canDelete = (comment) => {
        return user && (user._id === comment.author?._id?.toString() || user.role === 'admin');
    };

    return (
        <div className="comments-section">
            <h3 className="comments-title">
                💬 Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            {user ? (
                <form className="comment-form" onSubmit={handleSubmitComment}>
                    <div className="comment-input-group">
                        <img
                            src={user.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : 'https://via.placeholder.com/40'}
                            alt={user.name}
                            className="comment-avatar"
                        />
                        <div className="comment-input-wrapper">
                            <textarea
                                className="comment-textarea"
                                placeholder="Share your thoughts..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                rows="3"
                            />
                            <button
                                type="submit"
                                className="comment-submit-btn"
                                disabled={submitting || !commentText.trim()}
                            >
                                {submitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="login-prompt">
                    <p>💭 <a href="/login">Login</a> to share your thoughts!</p>
                </div>
            )}

            {/* Comments List */}
            <div className="comments-list">
                {loading ? (
                    <p className="loading-text">Loading comments...</p>
                ) : comments.length === 0 ? (
                    <p className="no-comments">
                        No comments yet. Be the first to share your thoughts! 💭
                    </p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                            <div className="comment-header">
                                <img
                                    src={comment.author?.profilePic ? `http://localhost:5000/uploads/${comment.author.profilePic}` : 'https://via.placeholder.com/40'}
                                    alt={comment.author?.name}
                                    className="comment-avatar-small"
                                />
                                <div className="comment-meta">
                                    <strong className="comment-author">{comment.author?.name}</strong>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString()} at{' '}
                                        {new Date(comment.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                {canDelete(comment) && (
                                    <button
                                        className="comment-delete-btn"
                                        onClick={() => handleDeleteComment(comment._id)}
                                        title="Delete comment"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                            <div className="comment-body">
                                <p>{comment.body}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Comments;
