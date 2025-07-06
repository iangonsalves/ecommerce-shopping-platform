import React from 'react';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Alex's Jersey Hub
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          The home for amazing jerseys at great prices
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/products"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            Browse Jerseys
          </Button>
          <Button
            component={Link}
            to="/categories"
            variant="outlined"
            color="primary"
            size="large"
          >
            View Leagues
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Wide Selection
            </Typography>
            <Typography color="text.secondary">
              Browse through our extensive collection of products
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Secure Shopping
            </Typography>
            <Typography color="text.secondary">
              Shop with confidence using our secure payment system
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Fast Delivery
            </Typography>
            <Typography color="text.secondary">
              Get your orders delivered quickly and safely
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 