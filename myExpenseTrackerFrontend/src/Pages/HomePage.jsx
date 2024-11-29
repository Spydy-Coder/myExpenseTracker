import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/login');  // Navigate to the login page
  };

  return (
    <Box 
      sx={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
        }}
      >
        <source src="/animation.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <Typography 
          variant="h3"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },  // Responsive font size
          }}
        >
          Let's Start Your Trip with Us
        </Typography>
        <Button
          variant="outlined"
          size="large"
          onClick={handleStartClick}
          sx={{
            marginTop: '20px',
            padding: { xs: '8px 20px', sm: '10px 30px' },  // Responsive padding
            fontSize: { xs: '1rem', sm: '1.2rem' },  // Responsive font size
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: '#E64A19',
              color: '#E64A19',
            },
          }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
};

export default HomePage;
