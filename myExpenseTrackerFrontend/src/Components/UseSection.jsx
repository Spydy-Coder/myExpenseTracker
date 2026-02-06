import React, { useState } from 'react';
import { Typography, Box, Paper, IconButton } from '@mui/material';

const UseSection = () => {
  const [active, setActive] = useState(1);

  const imageSrc = encodeURI(
    '/images/cartoon-road-vector-illustration_851674-46353 (1).avif'
  );

  const hotspots = [
    { id: 1, top: '18%', left: '22%', mobileTop: '20%', mobileLeft: '25%', title: 'Sign Up / Login', desc: 'Log in or sign up to get started.' },
    { id: 2, top: '34%', left: '44%', mobileTop: '36%', mobileLeft: '50%', title: 'Create Trip', desc: 'Create a trip and share the code.' },
    { id: 3, top: '50%', left: '62%', mobileTop: '52%', mobileLeft: '65%', title: 'Join Trip', desc: 'Join an existing trip using a code.' },
    { id: 4, top: '66%', left: '40%', mobileTop: '70%', mobileLeft: '38%', title: 'Add Expense', desc: 'Add expenses and split between members.' },
    { id: 5, top: '80%', left: '75%', mobileTop: '85%', mobileLeft: '75%', title: 'Request Payment', desc: 'Send payment requests to participants.' },
  ];

  // 🔥 Mobile tooltip direction logic
  const getMobileTooltipTransform = (id) => {
    if (id <= 3) {
      return 'translate(-50%, calc(100% + 12px))'; // open downward
    }
    return 'translate(-50%, calc(-100% - 14px))'; // open upward
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 3, md: 6 },
          alignItems: 'center',
          mb: 8,
          px: { xs: 2, md: 4 },
        }}
      >
        {/* IMAGE SECTION */}
        <Box
          sx={{
            flex: { xs: 1, md: '0 0 55%' },
            width: '100%',
            order: { xs: 2, md: 1 },
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', overflow: 'visible' }}>
            <img
              src={imageSrc}
              alt="how-to-use intro"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
                borderRadius: '12px',
              }}
            />

            {/* HOTSPOTS */}
            {hotspots.map((h) => (
              <IconButton
                key={h.id}
                onClick={() => setActive(active === h.id ? null : h.id)}
                aria-label={h.title}
                sx={{
                  position: 'absolute',
                  top: { xs: h.mobileTop, md: h.top },
                  left: { xs: h.mobileLeft, md: h.left },
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#44b5ad',
                  color: '#fff',
                  width: { xs: 34, md: 40 },
                  height: { xs: 34, md: 40 },
                  fontSize: { xs: '0.8rem', md: '1rem' },
                  fontWeight: 'bold',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    backgroundColor: '#37a79d',
                    transform: 'translate(-50%, -50%) scale(1.15)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
                  },
                }}
              >
                {h.id}
              </IconButton>
            ))}

            {/* TOOLTIPS */}
            {hotspots.map(
              (h) =>
                active === h.id && (
                  <Paper
                    key={`tip-${h.id}`}
                    elevation={6}
                    sx={{
                      position: 'absolute',
                      top: { xs: h.mobileTop, md: h.top },
                      left: { xs: h.mobileLeft, md: h.left },
                      transform: {
                        xs: getMobileTooltipTransform(h.id),
                        md: 'translate(-50%, calc(-100% - 14px))',
                      },
                      minWidth: { xs: 180, md: 220 },
                      p: 1.5,
                      backgroundColor: '#fff',
                      borderLeft: '4px solid #44b5ad',
                      borderRadius: 2,
                      zIndex: 10,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 'bold', color: '#0a6a9b', mb: 0.5 }}
                    >
                      Step {h.id}: {h.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#555', lineHeight: 1.5 }}
                    >
                      {h.desc}
                    </Typography>
                  </Paper>
                )
            )}
          </Box>
        </Box>

        {/* TEXT SECTION */}
        <Box
          sx={{
            flex: { xs: 1, md: '0 0 45%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            order: { xs: 1, md: 2 },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              fontFamily: '"Great Vibes", cursive',
              backgroundImage:
                'linear-gradient(160deg, #0a6a9b 0%, #44b5ad 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 3,
              fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.5rem' },
              lineHeight: 1.2,
            }}
          >
            Master Your Expenses on the Go!
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#555',
              lineHeight: 1.9,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              fontWeight: 500,
            }}
          >
            Transform your group spending into seamless collaboration. Track every
            penny, split costs effortlessly, and settle accounts with just a tap.
            Whether you're planning a road trip with friends, organizing a family
            gathering, or managing shared expenses with roommates, myExpense makes
            it simple and fun. Follow the interactive journey below to discover how
            easy managing shared expenses can be!
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default UseSection;
