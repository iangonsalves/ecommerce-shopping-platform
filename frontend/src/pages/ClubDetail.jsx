import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ClubDetail = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await api.get(`/clubs/${id}`);
        // Handle both wrapped and unwrapped responses
        const clubData = response.data.data || response.data;
        setClub(clubData);
        setError('');
      } catch (error) {
        setError('Failed to load club data');
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      // You could add a success message here
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!club) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>
          Club not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {club.name}
      </Typography>
      
      <Typography variant="body1" paragraph>
        {club.description}
      </Typography>

      {/* Display products for the club */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Club Jerseys:
      </Typography>

      <Grid container spacing={3}>
        {club.products && club.products.length > 0 ? (
          club.products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardActionArea component={Link} to={`/products/${product.id}`}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image || product.image_url ? 
                      ((product.image || product.image_url).startsWith('http://') || (product.image || product.image_url).startsWith('https://') ? 
                        (product.image || product.image_url) : 
                        `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${product.image || product.image_url}`)
                      : 'https://placehold.co/400x300/CCCCCC/666666?text=Product+Image'}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      <span className="dirham-symbol">&#xea;</span> {Number(product.price).toFixed(2)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAddToCart(product.id)}
                    disabled={cartLoading}
                  >
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Alert severity="info">
              No jerseys available for this club yet.
            </Alert>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ClubDetail; 