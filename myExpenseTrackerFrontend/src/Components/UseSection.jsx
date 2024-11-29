import React from 'react';
import { Typography, Box, Paper, Divider } from '@mui/material';

const UseSection = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: '#f9f9f9',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        marginTop: '3rem',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#0a6a9b',
          mb: 3,
          backgroundImage: 'linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)',
          WebkitBackgroundClip: 'text',
          textAlign: 'center',
        }}
      >
        HOW TO USE THE APP
      </Typography>

      <Divider sx={{ backgroundColor: '#0a6a9b', marginBottom: '1.5rem' }} />

      <Box component="ol" sx={{ fontSize: '1.25rem', color: '#444', lineHeight: 2, paddingLeft: '1.5rem' }}>
        {[
          'Log in if you have an account; otherwise, sign up.',
          'Create a trip and share the code with friends to join.',
          'Join an existing trip using a shared code.',
          'Create the expenses.',
          'Send the request to pay.',
          "You can also share the expenses by copying it"
        ].map((step, index) => (
          <li key={index} style={{ marginBottom: '0.8rem' }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                color: 'black',
                '&::marker': {
                  color: '#44b5ad',
                  fontSize: '1.5rem',
                },
              }}
            >
              {step}
            </Typography>
          </li>
        ))}
      </Box>
    </Paper>
  );
};

export default UseSection;
