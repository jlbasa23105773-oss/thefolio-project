import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        skillLevel: '',
        agreeTerms: false
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        let newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";

        if (!formData.email) {
            newErrors.email = "Email is required.";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (!formData.password) {
            newErrors.password = "Password is required.";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }

        if (!formData.skillLevel) newErrors.skillLevel = "Please select a skill level.";
        if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;  // BUG FIX 1: was missing the return, kept going even if validation failed

        setLoading(true);
        try {
            const payload = {
                name: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            };

            const { data } = await API.post('/auth/register', payload);

            localStorage.setItem('token', data.token);
            setUser(data.user);

            navigate('/home');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content">
            <div className="registration-container contact-box" style={{ marginTop: '50px' }}>
                <form id="registrationForm" className="registration-form" onSubmit={handleSubmit}>
                    <h2>Join the Community</h2>
                    <p className="form-subtitle">Register to unlock exclusive guitar tabs and tutorials.</p>

                    {serverError && <p style={{ color: '#ff4d4d', textAlign: 'center' }}>{serverError}</p>}

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="e.g., John Doe"
                            value={formData.fullName}
                            onChange={handleChange}
                            className={errors.fullName ? 'invalid' : ''}
                        />
                        {errors.fullName && <span className="error" style={{ color: 'red', fontSize: '12px' }}>{errors.fullName}</span>}
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="e.g., john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'invalid' : ''}
                        />
                        {errors.email && <span className="error" style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'invalid' : ''}
                        />
                        {errors.password && <span className="error" style={{ color: 'red', fontSize: '12px' }}>{errors.password}</span>}
                    </div>

                    <div className="form-group">
                        <label>Skill Level</label>
                        <div className="radio-group" style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                            {['Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                                <label key={lvl} className="radio-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <input
                                        type="radio"
                                        name="skillLevel"
                                        value={lvl}
                                        checked={formData.skillLevel === lvl}
                                        onChange={handleChange}
                                    />
                                    <span>{lvl}</span>
                                </label>
                            ))}
                        </div>
                        {errors.skillLevel && <span className="error" style={{ color: 'red', fontSize: '12px' }}>{errors.skillLevel}</span>}
                    </div>

                    <div className="form-group">
                        <label className="terms-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                            />
                            <span>I agree to the Terms & Conditions</span>
                        </label>
                        {errors.agreeTerms && <span className="error" style={{ color: 'red', fontSize: '12px', display: 'block' }}>{errors.agreeTerms}</span>}
                    </div>

                    <button type="submit" id="newcolor" disabled={loading}>
                        {loading ? 'Processing...' : 'Complete Registration'}
                    </button>

                    <p className="login-link">
                        Already have an account? <Link to="/login">Log In Here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;