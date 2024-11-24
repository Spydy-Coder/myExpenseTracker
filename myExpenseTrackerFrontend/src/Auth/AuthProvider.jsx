import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Check for token in localStorage

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false); // Set loading to false once the check is complete
  }, []);

  // Function to log in
  const login = (token, userId) => {
    localStorage.setItem("token", token); // Save token to localStorage
    localStorage.setItem("userId", userId);
    setIsAuthenticated(true);
  };

  // Function to log out
  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("userId"); // Remove userId from localStorage
    setIsAuthenticated(false);
    navigate("/login"); // Redirect to login page
  };

  // Show a loading spinner while determining authentication status
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #2196f3, #21cbf3)',
          color: '#fff',
        }}
      >
        <CircularProgress
          size={80}
          thickness={5}
          sx={{
            color: '#fff',
            mb: 2, // Add some margin below the spinner
          }}
        />
        <Box
          component="h1"
          sx={{
            fontSize: '1.5rem',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '1px 1px 5px rgba(0, 0, 0, 0.3)',
          }}
        >
          Loading, please wait...
        </Box>
      </Box>
    );
  }
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);
