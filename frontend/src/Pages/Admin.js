import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Admin.css'; 

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [tab, setTab] = useState('users');
    const [postFilter, setPostFilter] = useState('published'); // 'published' or 'removed' (Bin)
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replySending, setReplySending] = useState(false);

    // 1. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, postRes, messageRes] = await Promise.all([
                    API.get('/admin/users'),
                    API.get('/admin/posts'),
                    API.get('/admin/messages'),
                ]);
                setUsers(userRes.data);
                setPosts(postRes.data);
                setMessages(messageRes.data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Action: Toggle User Status (Activate/Deactivate)
    const handleToggleStatus = async (userId) => {
        try {
            const { data } = await API.put(`/admin/users/${userId}/status`);
            setUsers(prev => prev.map(u => 
                u._id === userId ? { ...u, status: data.user.status } : u
            ));
        } catch (err) {
            alert(err.response?.data?.message || "Error updating status");
        }
    };

    // 3. Action: Move Post to Bin
    const handleRemovePost = async (postId) => {
        if (!window.confirm("Move this post to Bin?")) return;
        try {
            await API.put(`/admin/posts/${postId}/remove`);
            setPosts(prev => prev.map(p => 
                p._id === postId ? { ...p, status: 'removed' } : p
            ));
        } catch (err) {
            alert(err.response?.data?.message || "Error removing post");
        }
    };

    // 4. Action: Restore Post from Bin
    const handleRestorePost = async (postId) => {
        try {
            await API.put(`/admin/posts/${postId}/restore`);
            setPosts(prev => prev.map(p => 
                p._id === postId ? { ...p, status: 'published' } : p
            ));
            alert("Post restored to active list!");
        } catch (err) {
            alert("Error restoring post");
        }
    };

    // 5. Open Message Detail Modal
    const handleViewMessage = async (message) => {
        try {
            const { data } = await API.get(`/admin/messages/${message._id}`);
            setSelectedMessage(data);
        } catch (err) {
            alert("Error loading message details");
        }
    };

    // 6. Close Message Detail Modal
    const handleCloseModal = () => {
        setSelectedMessage(null);
        setReplyText('');
    };

    // 7. Send Reply to Message
    const handleSendReply = async () => {
        if (!replyText.trim()) {
            alert("Please enter a reply message");
            return;
        }

        setReplySending(true);
        try {
            const { data } = await API.post(`/admin/messages/${selectedMessage._id}/reply`, {
                text: replyText
            });
            setSelectedMessage(data.data);
            setReplyText('');
            
            // Update messages list
            setMessages(prev => prev.map(m => 
                m._id === selectedMessage._id ? data.data : m
            ));
        } catch (err) {
            alert(err.response?.data?.message || "Error sending reply");
        } finally {
            setReplySending(false);
        }
    };

    if (loading) return <div className="loader-page"><h1>Loading Dashboard...</h1></div>;

    // Filtered posts base sa piniling view (Active o Bin)
    const filteredPosts = posts.filter(p => p.status === postFilter);

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <span className="eyebrow">Control Panel</span>
                <h1>Admin Dashboard</h1>
            </header>

            <div className="stats-grid">
                <div className="stat-card"><h3>{users.length}</h3><p>Users</p></div>
                <div className="stat-card"><h3>{posts.filter(p => p.status === 'published').length}</h3><p>Active Posts</p></div>
                <div className="stat-card"><h3>{messages.length}</h3><p>Messages</p></div>
            </div>

            <div className="admin-tabs">
                <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Manage Users</button>
                <button className={tab === 'posts' ? 'active' : ''} onClick={() => setTab('posts')}>Manage Posts</button>
                <button className={tab === 'messages' ? 'active' : ''} onClick={() => setTab('messages')}>View Messages</button>
            </div>

            <div className="admin-table-container">
                {tab === 'users' ? (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className={`badge ${u.status}`}>{u.status}</span></td>
                                    <td>
                                        <button 
                                            className={`btn-action ${u.status === 'active' ? 'deactivate' : 'activate'}`} 
                                            onClick={() => handleToggleStatus(u._id)}
                                        >
                                            {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : tab === 'posts' ? (
                    <>
                        <div className="post-filter-nav">
                            <button className={postFilter === 'published' ? 'selected' : ''} onClick={() => setPostFilter('published')}>Active</button>
                            <button className={postFilter === 'removed' ? 'selected' : ''} onClick={() => setPostFilter('removed')}>🗑️ Bin</button>
                        </div>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.map(p => (
                                    <tr key={p._id}>
                                        <td>{p.title}</td>
                                        <td><span className={`badge ${p.status}`}>{p.status}</span></td>
                                        <td>
                                            {p.status === 'published' ? (
                                                <button className="btn-danger" onClick={() => handleRemovePost(p._id)}>Move to Bin</button>
                                            ) : (
                                                <button className="btn-action activate" onClick={() => handleRestorePost(p._id)}>Restore</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredPosts.length === 0 && <tr><td colSpan="3" style={{textAlign: 'center', padding: '20px'}}>No posts found here.</td></tr>}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Sender</th>
                                <th>Email</th>
                                <th>Account</th>
                                <th>Message</th>
                                <th>Sent</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map(m => (
                                <tr key={m._id}>
                                    <td>{m.user ? m.user.name : m.name}</td>
                                    <td>{m.user ? m.user.email : m.email}</td>
                                    <td>
                                        {m.user ? (
                                            <>
                                                Registered<br />
                                                <small>{m.user.role} / {m.user.status}</small><br />
                                                <small>ID: {m.user._id}</small>
                                            </>
                                        ) : (
                                            <>Guest</>
                                        )}
                                    </td>
                                    <td><div className="message-content">{m.message}</div></td>
                                    <td>{new Date(m.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button 
                                            className="btn-action activate"
                                            onClick={() => handleViewMessage(m)}
                                        >
                                            View & Reply
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {messages.length === 0 && <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No messages yet.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Message Details</h2>
                            <button className="modal-close" onClick={handleCloseModal}>&times;</button>
                        </div>
                        
                        <div className="modal-body">
                            {/* Original Message */}
                            <div className="message-section">
                                <div className="message-info">
                                    <p><strong>From:</strong> {selectedMessage.user ? selectedMessage.user.name : selectedMessage.name}</p>
                                    <p><strong>Email:</strong> {selectedMessage.user ? selectedMessage.user.email : selectedMessage.email}</p>
                                    <p><strong>Account:</strong> {selectedMessage.user ? `Registered (${selectedMessage.user.role})` : 'Guest'}</p>
                                    <p><strong>Sent:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="message-text">
                                    <strong>Message:</strong>
                                    <p>{selectedMessage.message}</p>
                                </div>
                            </div>

                            {/* Replies Section */}
                            {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                                <div className="replies-section">
                                    <h3>Replies ({selectedMessage.replies.length})</h3>
                                    {selectedMessage.replies.map((reply, idx) => (
                                        <div key={idx} className="reply-item">
                                            <div className="reply-header">
                                                <strong>{reply.repliedBy.name}</strong>
                                                <span className="reply-date">{new Date(reply.createdAt).toLocaleString()}</span>
                                            </div>
                                            <p>{reply.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply Form */}
                            <div className="reply-form-section">
                                <h3>Send a Reply</h3>
                                <textarea
                                    className="reply-textarea"
                                    placeholder="Type your reply here..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    rows="4"
                                />
                                <button 
                                    className="btn-send-reply"
                                    onClick={handleSendReply}
                                    disabled={replySending || !replyText.trim()}
                                >
                                    {replySending ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;