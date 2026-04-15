import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      API.get('/auth/me')
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          // BUG FIX: token is invalid/expired — clear it so user is treated as guest
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // BUG FIX: trim whitespace from email — copy-pasting emails often adds spaces
    const { data } = await API.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
    // NOTE: we removed the try/catch here intentionally.
    // Errors bubble up to Login.js which shows them to the user.
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // BUG FIX: don't render children until we know if the user is logged in.
  // Without this, ProtectedRoute flashes the login redirect before the token check finishes.
  if (loading) {
    return null; // or return <div>Loading...</div> if you want a splash screen
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);