import React from 'react';
import { Typography, Button, Box, Grid, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handleGetStarted = () => {
    navigate('/signup'); // Navigate to the Sign Up page
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexDirection={isSmallScreen ? 'column' : 'row'}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            fontFamily: '"Great Vibes", cursive',
            backgroundImage: 'linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
        >
          myExpense
        </Typography>
        <Box mt={isSmallScreen ? 2 : 0}>
          <Button
            variant="contained"
            sx={{
              backgroundImage: 'linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)',
              color: '#fff',
              marginRight: '1rem',
              '&:hover': {
                backgroundImage: 'linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)',
                mb: 6,
              },
            }}
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
          <Button
            variant="outlined"
            sx={{
              border: '2px solid #0a6a9b',
              color: '#0a6a9b',
              '&:hover': {
                backgroundColor: '#0a6a9b',
                color: '#fff',
              },
            }}
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </Box>
      </Box>

      {/* Slogan and Get Started */}
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={7}>
          <Typography
            variant="h3"
            sx={{
              color: '#333',
              mb: 6,
            }}
          >
            Track your trip expenses effortlessly with us!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              mb: 6,
            }}
          >
            Easily manage shared expenses, keep track of individual contributions, and ensure fair splits among friends and family. Our app simplifies the process of budgeting, tracking payments, and settling up after your trip, so you can focus more on enjoying your adventures and less on financial hassles!
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundImage: 'linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)',
              color: '#fff',
              '&:hover': {
                backgroundImage: 'linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)',
              },
            }}
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </Grid>
        <Grid item xs={12} md={5}>
          <img
            src="https://img.freepik.com/premium-vector/cartoon-happy-couple-vintage-car-suitcases-tropical-road_18591-17655.jpg?w=740"
            alt="Trip Illustration"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HeroSection;
