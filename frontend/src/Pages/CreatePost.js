import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        const fd = new FormData();
        fd.append('title', title);
        fd.append('body', body);
        if (image) fd.append('image', image);

        try {
            const { data } = await API.post('/posts', fd);
            // Pagkatapos ma-publish, dadalhin ang user sa mismong post
            navigate(`/posts/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to publish post');
        }
    };

    return (
        <div className="content">
            {/* Header section para sa consistency */}
            <div style={{ textAlign: 'center', marginTop: '100px', marginBottom: '30px' }}>
                <span className="eyebrow">Community Knowledge</span>
                <h1 style={{ fontSize: '3rem' }}>CREATE NEW LESSON</h1>
                <p className="form-subtitle">Share your guitar tabs, techniques, or gear reviews.</p>
            </div>

            <div className="registration-container contact-box">
                {error && <p className="error" style={{ textAlign: 'center', marginBottom: '20px' }}>{error}</p>}

                <form className="registration-form" onSubmit={handleSubmit}>
                    
                    {/* Input para sa Title */}
                    <div className="form-group">
                        <label>Lesson / Post Title</label>
                        <input 
                            type="text"
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g., Mastering the G Major Scale" 
                            required 
                        />
                    </div>

                    {/* Textarea para sa Body Content */}
                    <div className="form-group">
                        <label>Content & Tabs</label>
                        <textarea 
                            value={body} 
                            onChange={e => setBody(e.target.value)}
                            placeholder="Write your tutorial or paste your guitar tabs here..." 
                            rows={12} 
                            required 
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    {/* Image Upload - Admin Only base sa logic mo */}
                    {user?.role === 'admin' && (
                        <div className="form-group">
                            <label>Featured Cover Image</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={e => setImage(e.target.files[0])} 
                                style={{ padding: '10px' }}
                            />
                            <p className="form-subtitle" style={{ fontSize: '0.7rem', marginTop: '5px' }}>
                                * Admin privilege: You can add a cover photo to this post.
                            </p>
                        </div>
                    )}

                    {/* Submit Button gamit ang gold accent class mo */}
                    <button type="submit" id="newcolor">
                        Publish Lesson
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;