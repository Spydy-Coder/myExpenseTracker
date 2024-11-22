import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { useTheme } from '@mui/material/styles';
import { Box, TextField, Button, Typography, Card, Link } from '@mui/material'; // Import Link component

const SignUp = () => {
  const [message, setMessage] = React.useState('');  // State to hold success or error message
  const [formData, setFormData] = React.useState({
    username: '',
    email: '',
    password: '',
  });  // State to hold form data

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { username, email, password } = formData;

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account created successfully!');  // Show success message
        setFormData({ username: '', email: '', password: '' });  // Clear form
      } else {
        // If the error message indicates that the email is already in use
        if (data.error && data.error.includes('Email already in use')) {
          setMessage('Account already exists. Please log in or use a different email.');
        } else {
          setMessage(`Error: ${data.error}`);
        }
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');  // Show generic error message
    }
  };

  const theme = useTheme();

  return (
    <AppProvider theme={theme}>
      <Card
        sx={{
          maxWidth: 400,
          margin: 'auto',
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up
          </Typography>
          <TextField
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="username"
            label="Username"
            type="text"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>

          {/* Display success or error message */}
          {message && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: message.includes('Error') || message.includes('already') ? 'red' : 'green',
              }}
            >
              {message}
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Go to login
            </Link>
          </Typography>
        </Box>
      </Card>
    </AppProvider>
  );
};

export default SignUp;
