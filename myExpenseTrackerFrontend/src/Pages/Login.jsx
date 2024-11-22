import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import Card from '@mui/material/Card';

const SignIn = () => {
  const [message, setMessage] = useState('');  // State to hold the message
  const [messageType, setMessageType] = useState('');  // State for message type (success/error)

  // Handle login logic
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
        // Login successful
        setMessage('Login successful!');  // Set the success message
        setMessageType('success');  // Set message type to success

        // Store userId in localStorage
        localStorage.setItem('userId', data.userId);

        // Redirect to dashboard
        window.location.href = '/dashboard';  // Redirect to your actual dashboard route
      } else {
        setMessage(`Error: ${data.error}`);  // Set the error message
        setMessageType('error');  // Set message type to error
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');  // General error message
      setMessageType('error');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    signIn(formData);
  };

  return (
    <Card sx={{ maxWidth: 400, margin: 'auto', padding: 3,marginTop:'10' }}>
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
