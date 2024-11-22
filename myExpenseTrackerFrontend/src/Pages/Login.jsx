import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const SignIn = () => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();  // Initialize useNavigate hook

  const signIn = async (formData) => {
    const { email, password } = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Login successful!');
        setMessageType('success');

        // Store userId in localStorage
        localStorage.setItem('userId', data.userId);

        // Redirect to the user's dashboard with their ID
        navigate(`/dashboard/${data.userId}`);
      } else {
        setMessage(`Error: ${data.error}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      setMessageType('error');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    signIn(formData);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', padding: 3, marginTop: 10 }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Sign In
        </Typography>
        
        <TextField
          name="email"
          label="Email"
          type="email"
          fullWidth
          required
        />
        
        <TextField
          name="password"
          label="Password"
          type="password"
          fullWidth
          required
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign In
        </Button>

        {/* Display message */}
        {message && (
          <div
            style={{
              padding: '10px',
              backgroundColor: messageType === 'success' ? 'green' : 'red',
              color: 'white',
              marginTop: '10px',
              borderRadius: '5px',
            }}
          >
            {message}
          </div>
        )}

        {/* Link to sign up if no account */}
        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ textDecoration: 'none', color: 'blue' }}>
            Sign Up
          </a>
        </Typography>
      </Box>
    </Card>
  );
};

export default SignIn;
