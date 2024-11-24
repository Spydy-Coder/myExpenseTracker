import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/signup');  // Change to '/login' if you prefer
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
        <source src="https://www.vecteezy.com/video/2017828-animated-car-with-luggage-travels-go-to-around-the-world" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Optional overlay for readability
          color: 'white',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Let's Start Your Trip with Us
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleStartClick}
          sx={{
            marginTop: '20px',
            padding: '10px 30px',
            fontSize: '1.2rem',
            backgroundColor: '#FF5722',  // Custom button color
            '&:hover': {
              backgroundColor: '#E64A19',
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
