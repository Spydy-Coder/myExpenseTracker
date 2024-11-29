import React from 'react';
import { Paper } from '@mui/material';
import HeroSection from '../Components/HeroSection';
import UseSection from '../Components/UseSection';

const HomePage = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: '#fff',
        padding: '1rem 2rem',
        minHeight: '100vh',
        borderRadius: 0,
      }}
    >
      <HeroSection />
      <UseSection />
    </Paper>
  );
};

export default HomePage;
