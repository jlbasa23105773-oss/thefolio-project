import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoadingScreen.css';

const LoadingScreen = () => {
    const [dotCount, setDotCount] = useState(0);
    const [showEnter, setShowEnter] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const dotInterval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 500);

        const buttonTimer = setTimeout(() => {
            setShowEnter(true);
        }, 2500);

        return () => {
            clearInterval(dotInterval);
            clearTimeout(buttonTimer);
        };
    }, []);

    const handleEnter = () => {
        navigate('/home');
    };

    return (
        <div className="loader-page" style={{ transition: 'opacity 0.6s ease' }}>
            <div className="loader-container">
                <div className="logo">
                    <img className="mlogo" src="/assets/logo.jpg" alt="Logo" />
                </div>
                <h1>GUITAR PORTFOLIO</h1>
                <div className="spinner"></div>
                <div className="loading-text">
                    Loading{'.'.repeat(dotCount)}
                </div>
                {showEnter && (
                    <button className="enter-button" onClick={handleEnter}>
                        Enter Site
                    </button>
                )}
            </div>
        </div>
    );
};

export default LoadingScreen;