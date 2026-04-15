import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/posts/${id}`)
            .then(res => {
                setTitle(res.data.title);
                setBody(res.data.body);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                navigate('/home');
            });
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/posts/${id}`, { title, body });
            navigate(`/posts/${id}`);
        } catch (err) {
            alert("Update failed!");
        }
    };

    if (loading) return <div className="content" style={{marginTop: '150px', textAlign: 'center'}}><p className="eyebrow">Fetching data...</p></div>;

    return (
        <div className="content">
            <div className="registration-container" style={{ marginTop: '100px' }}>
                <span className="eyebrow">Editor Mode</span>
                <h2 style={{ marginBottom: '20px' }}>Edit Your Lesson</h2>
                
                <form className="registration-form" onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Update Title</label>
                        <input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Lesson Content / Tabs</label>
                        <textarea 
                            value={body} 
                            onChange={(e) => setBody(e.target.value)} 
                            rows={15} 
                            required 
                        />
                    </div>

                    <button type="submit" id="newcolor">
                        Save Changes
                    </button>
                    
                    <button 
                        type="button" 
                        onClick={() => navigate(-1)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', marginTop: '15px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditPost;