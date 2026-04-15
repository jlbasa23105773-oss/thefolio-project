import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './LoadingScreen'; 
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Siguraduhin na tama ang filename (kung .js o .jsx)
import Home from './Pages/Home'; 
import Contact from './Pages/Contact'; 
import About from './Pages/About';
import Register from './Pages/Register';
import Login from './Pages/Login';

// New Pages (Inupdate natin base sa design)
import PostPage from './Pages/PostPage'; // Yung page para sa full lesson/tabs
import Profile from './Pages/Profile';   // Inupdate natin kanina
import CreatePost from './Pages/CreatePost'; // Inupdate natin kanina
import EditPost from './Pages/EditPost'; 
import Admin from './Pages/Admin';       // Inupdate natin kanina

function App() {
  return (
    <Router>
      <Routes>
        {/* Full screen loading screen */}
        <Route path="/" element={<LoadingScreen />} />

        {/* Lahat ng nasa loob ng Layout ay may Navbar at Footer */}
        <Route element={<Layout />}>
          
          {/* ─── PUBLIC ROUTES ─── */}
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts/:id" element={<PostPage />} />

          {/* ─── PROTECTED ROUTES (Logged in only) ─── */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/create-post" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          
          <Route path="/edit-post/:id" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          } />

          {/* ─── ADMIN ONLY ROUTE ─── */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          } />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;