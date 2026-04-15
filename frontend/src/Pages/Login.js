import React, { useState } from 'react'; // Added useState
import { useNavigate, Link } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '../context/AuthContext'; // Added useAuth

const Login = () => {
    // ─── NEW LOGIC STATE ───────────────────────────────────────
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Normalize email before sending to the backend
            const user = await login(email.trim().toLowerCase(), password);
            
            // Redirect based on the role returned from backend
            navigate(user.role === 'admin' ? '/admin' : '/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content">
            <div className="registration-container" style={{ marginTop: '80px' }}>
                <form className="registration-form" onSubmit={handleLogin}>
                    <h2>Welcome Back</h2>
                    <p className="form-subtitle">Log in to access your saved guitar tabs and lessons.</p>

                    {/* Display error message if login fails */}
                    {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>

                    <button type="submit" id="newcolor" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                    
                    <p className="login-link">
                        Don't have an account? <Link to="/register">Register Here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;