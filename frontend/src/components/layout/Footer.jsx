import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Alex's Jersey Hub
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your one-stop shop for all your football jersey needs.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/products" color="inherit" display="block" sx={{ mb: 1 }}>
              All Jerseys
            </Link>
            <Link component={RouterLink} to="/leagues" color="inherit" display="block" sx={{ mb: 1 }}>
              Leagues
            </Link>
            <Link component={RouterLink} to="/cart" color="inherit" display="block" sx={{ mb: 1 }}>
              Cart
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@jerseyhub.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: (+971) 50 153 3421
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {currentYear} Alex's Jersey Hub. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 