import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
} from '@mui/material';

const UseSection = () => {
  const [active, setActive] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const imageSrc =
    '/images/cartoon-road-vector-illustration_851674-46353 (1).avif';

  const hotspots = [
    {
      id: 1,
      top: '18%',
      left: '22%',
      mobileTop: '18%',
      mobileLeft: '25%',
      title: 'Sign Up / Login',
      desc: 'Create your account and jump right in.',
    },
    {
      id: 2,
      top: '34%',
      left: '44%',
      mobileTop: '36%',
      mobileLeft: '50%',
      title: 'Create Trip',
      desc: 'Start a new trip and share a code with friends.',
    },
    {
      id: 3,
      top: '50%',
      left: '62%',
      mobileTop: '56%',
      mobileLeft: '65%',
      title: 'Join Trip',
      desc: 'Enter a trip code to join in seconds.',
    },
    {
      id: 4,
      top: '66%',
      left: '40%',
      mobileTop: '74%',
      mobileLeft: '38%',
      title: 'Add Expense',
      desc: 'Log shared costs and split them with ease.',
    },
    {
      id: 5,
      top: '80%',
      left: '75%',
      mobileTop: '88%',
      mobileLeft: '75%',
      title: 'Request Payment',
      desc: 'Send payment requests and settle balances clearly.',
    },
  ];

  const getMobileTransform = (id) => {
    if (id <= 2) {
      return 'translate(-50%, calc(100% + 14px))';
    }
    return 'translate(-50%, calc(-100% - 16px))';
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 6, md: 8 }, bgcolor: 'rgba(248, 251, 255, 0.9)' }}>
      <Stack spacing={3} sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#102a43',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          How it works
        </Typography>
        <Typography
          sx={{
            lineHeight: 1.8,
            fontSize: '1.05rem',
            color: '#486581',
            maxWidth: 760,
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          From creating your trip to settling up at the end, every step is designed to feel quick, clear, and stress-free.
        </Typography>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 4, md: 6 },
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: { md: '0 0 42%' }, width: '100%' }}>
          <Stack spacing={2}>
            {['Create a trip', 'Add shared expenses', 'Settle payments'].map((item, index) => (
              <Paper
                key={item}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid rgba(10, 106, 155, 0.1)',
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: 'rgba(68, 181, 173, 0.16)',
                    color: '#0a6a9b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                  }}
                >
                  {index + 1}
                </Box>
                <Typography sx={{ fontWeight: 600, color: '#102a43' }}>{item}</Typography>
              </Paper>
            ))}
          </Stack>
        </Box>

        <Box sx={{ flex: { md: '0 0 58%' }, width: '100%' }}>
          <Box sx={{ position: 'relative', width: '100%' }}>
            <img
              src={imageSrc}
              alt="how to use"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                borderRadius: '16px',
                boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
              }}
            />

            {hotspots.map((h) => (
              <IconButton
                key={h.id}
                aria-label={h.title}
                onClick={() => {
                  if (isMobile) {
                    setActive(active === h.id ? null : h.id);
                  }
                }}
                onMouseEnter={() => {
                  if (!isMobile) setActive(h.id);
                }}
                onMouseLeave={() => {
                  if (!isMobile) setActive(null);
                }}
                sx={{
                  position: 'absolute',
                  top: { xs: h.mobileTop, md: h.top },
                  left: { xs: h.mobileLeft, md: h.left },
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#44b5ad',
                  color: '#fff',
                  width: { xs: 34, md: 40 },
                  height: { xs: 34, md: 40 },
                  fontWeight: 'bold',
                  boxShadow: '0 10px 24px rgba(68, 181, 173, 0.22)',
                }}
              >
                {h.id}
              </IconButton>
            ))}

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
                        xs: getMobileTransform(h.id),
                        md: 'translate(-50%, calc(-100% - 14px))',
                      },
                      minWidth: 220,
                      p: 1.5,
                      borderLeft: '4px solid #44b5ad',
                      borderRadius: 2,
                      zIndex: 20,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      Step {h.id}: {h.title}
                    </Typography>
                    <Typography variant="body2">{h.desc}</Typography>
                  </Paper>
                )
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UseSection;
