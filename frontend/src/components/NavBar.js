import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; // Import mo ang Auth context

const NavBar = () => {
    const { user, logout } = useAuth(); // Kunin ang user data at logout function
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        const htmlElement = document.documentElement;
        if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
        } else {
            htmlElement.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="horizontal-nav">
            <div className="nav-container">
                <div className="nav-left">
                    <img src="/assets/logo.jpg" className="logo" alt="Logo" />
                    <span className="site-title">Guitar Portfolio</span>
                </div>

                <ul className="nav-links">
                    <li><NavLink to="/home">Home</NavLink></li>
                    
                    {/* Public Links (Laging nakikita) */}
                    <li><NavLink to="/about">About</NavLink></li>
                    {user?.role !== 'admin' && <li><NavLink to="/contact">Contact</NavLink></li>}

                    {/* Links para sa Naka-Login na Users */}
                    {user ? (
                        <>
                            <li><NavLink to="/create-post">Add Lesson</NavLink></li>
                            <li><NavLink to="/profile">Profile</NavLink></li>
                            
                            {/* Admin Link - Lalabas lang kung admin si user */}
                            {user.role === 'admin' && (
                                <li><NavLink to="/admin" style={{ color: 'var(--accent)' }}>Dashboard</NavLink></li>
                            )}

                            <li>
                                <button 
                                    onClick={handleLogout}
                                    style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: '600', opacity: '0.7' }}
                                >
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        /* Links para sa Guest / Hindi naka-login */
                        <>
                            <li><NavLink to="/login">Login</NavLink></li>
                            <li><NavLink to="/register">Register</NavLink></li>
                        </>
                    )}

                    {/* Theme Toggle Button */}
                    <li>
                        <button id="theme-toggle" aria-label="Toggle Dark Mode" onClick={toggleTheme}>
                            <img 
                                id="theme-icon" 
                                src={theme === 'light' ? '/assets/dark.jpg' : '/assets/light.jpg'} 
                                alt="Theme Toggle" 
                            />
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;