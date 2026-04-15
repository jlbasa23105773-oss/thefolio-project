import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const Profile = () => {
    const { user, setUser } = useAuth();
    
    // States para sa Profile Info
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [pic, setPic] = useState(null);
    
    // States para sa Password
    const [curPw, setCurPw] = useState('');
    const [newPw, setNewPw] = useState('');
    
    const [msg, setMsg] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const fd = new FormData();
        fd.append('name', name);
        fd.append('bio', bio);
        if (pic) fd.append('profilePic', pic);

        try {
            const { data } = await API.put('/auth/profile', fd);
            setUser(data);
            setMsg({ text: 'Profile updated successfully!', type: 'success' });
        } catch (err) {
            setMsg({ text: err.response?.data?.message || 'Error updating profile', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await API.put('/auth/change-password', { currentPassword: curPw, newPassword: newPw });
            setMsg({ text: 'Password changed successfully!', type: 'success' });
            setCurPw('');
            setNewPw('');
        } catch (err) {
            setMsg({ text: err.response?.data?.message || 'Error', type: 'error' });
        }
    };

    const picSrc = user?.profilePic
        ? `http://localhost:5000/uploads/${user.profilePic}`
        : '/assets/default-avatar.png';

    return (
        <div className="content">
            {/* Main Header para sa Profile Page */}
            <div style={{ textAlign: 'center', marginTop: '100px', marginBottom: '30px' }}>
                <span className="eyebrow">User Settings</span>
                <h1 style={{ fontSize: '3rem' }}>MY PROFILE</h1>
            </div>

            <div className="registration-container contact-box">
                {/* Profile Picture Preview Area */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                            src={picSrc} 
                            alt="Profile" 
                            className="logo" 
                            style={{ width: '120px', height: '120px', border: '2px solid var(--accent)' }} 
                        />
                    </div>
                    <p className="location-text" style={{ color: 'var(--accent)' }}>{user?.email}</p>
                </div>

                {/* Status Message */}
                {msg.text && (
                    <p className={msg.type === 'error' ? 'error' : 'answer-hint'} style={{ textAlign: 'center', marginBottom: '20px' }}>
                        {msg.text}
                    </p>
                )}

                {/* EDIT PROFILE FORM */}
                <form className="registration-form" onSubmit={handleProfileUpdate}>
                    <div className="form-group">
                        <label>Display Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="Full Name" 
                        />
                    </div>

                    <div className="form-group">
                        <label>Short Bio</label>
                        <textarea 
                            value={bio} 
                            onChange={e => setBio(e.target.value)} 
                            placeholder="About your guitar skills..." 
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label>Update Avatar</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => setPic(e.target.files[0])} 
                        />
                    </div>

                    <button type="submit" id="newcolor" disabled={loading}>
                        {loading ? 'Saving...' : 'Update Info'}
                    </button>
                </form>

                <hr style={{ border: '0', borderTop: '1px solid var(--glass-border)', margin: '40px 0' }} />

                {/* CHANGE PASSWORD FORM */}
                <form className="registration-form" onSubmit={handlePasswordUpdate}>
                    <div className="section-title">
                        <h3 style={{ color: 'var(--accent)', marginBottom: '20px' }}>Security</h3>
                    </div>

                    <div className="form-group">
                        <label>Current Password</label>
                        <input 
                            type="password" 
                            value={curPw} 
                            onChange={e => setCurPw(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password</label>
                        <input 
                            type="password" 
                            value={newPw} 
                            onChange={e => setNewPw(e.target.value)} 
                            required 
                            minLength={6} 
                        />
                    </div>

                    <button type="submit" className="btn-secondary">
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;