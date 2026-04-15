import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar'; // Siguraduhin na tama ang path papunta sa NavBar.js

const Layout = () => {
    return (
        <div className="layout-container">
            {/* Lalabas ang NavBar sa itaas ng bawat page */}
            <NavBar />

            {/* Dito sa Outlet lilitaw ang Home, Profile, Admin, etc. */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Pwede kang mag-add ng Footer dito sa baba ng Outlet */}
        </div>
    );
};

export default Layout;