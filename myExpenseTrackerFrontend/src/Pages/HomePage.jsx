import React from 'react';
import { Box } from '@mui/material';
import HeroSection from '../Components/HeroSection';
import UseSection from '../Components/UseSection';

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fbff 0%, #eef7ff 45%, #f7fcff 100%)',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          borderRadius: { xs: 0, md: 4 },
          boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
          bgcolor: 'rgba(255,255,255,0.9)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
        }}
      >
        <HeroSection />
        <UseSection />
      </Box>
    </Box>
  );
};

export default HomePage;
