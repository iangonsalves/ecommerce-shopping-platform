import React from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography
} from '@mui/material';

const statusHighlights = [
  'Connecting to the live backend',
  'Waking up the Render service',
  'Preparing the store experience'
];

const AppBootScreen = ({
  attempt,
  isError,
  onRetry,
  onContinue
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(circle at top, rgba(29,185,84,0.14), transparent 38%), linear-gradient(180deg, #181818 0%, #111 100%)',
        py: { xs: 4, md: 8 }
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{
            overflow: 'hidden',
            border: '1px solid rgba(29,185,84,0.2)',
            backgroundColor: 'background.paper'
          }}
        >
          <Box
            sx={{
              height: 8,
              background: 'linear-gradient(90deg, #1db954 0%, #ffd600 100%)'
            }}
          />

          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Box
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(29,185,84,0.12)',
                  border: '1px solid rgba(29,185,84,0.28)'
                }}
              >
                <CircularProgress size={42} thickness={4.5} color="primary" />
              </Box>

              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: 'secondary.main', letterSpacing: 2.4 }}
                >
                  Alex&apos;s Jersey Hub
                </Typography>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    color: 'common.white !important',
                    borderBottom: 'none',
                    mb: 1
                  }}
                >
                  Waking Up The Server
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255,255,255,0.78) !important',
                    maxWidth: 560
                  }}
                >
                  The live backend is on Render and may take a moment to resume after inactivity.
                  We&apos;re connecting now so the storefront loads cleanly.
                </Typography>
              </Box>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                useFlexGap
                sx={{ width: '100%', justifyContent: 'center' }}
              >
                {statusHighlights.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: 999,
                      bgcolor: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'common.white',
                      fontSize: '0.9rem'
                    }}
                  >
                    {item}
                  </Box>
                ))}
              </Stack>

              <Typography
                variant="body2"
                sx={{ color: 'rgba(255,255,255,0.62) !important' }}
              >
                Attempt {attempt}
              </Typography>

              {isError ? (
                <Stack spacing={2} sx={{ width: '100%', maxWidth: 520 }}>
                  <Alert severity="warning" sx={{ textAlign: 'left' }}>
                    The backend is taking longer than expected to respond. You can retry the
                    warm-up or continue into the site anyway.
                  </Alert>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                    <Button variant="contained" color="primary" onClick={onRetry}>
                      Retry Warm-Up
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onContinue}>
                      Continue Anyway
                    </Button>
                  </Stack>
                </Stack>
              ) : null}
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AppBootScreen;
