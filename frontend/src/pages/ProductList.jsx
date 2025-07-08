import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart, loading: cartLoading, error: cartError, refreshCart } = useCart();

  const cleanImageUrl = (url) => {
    if (!url) return null;
    // Remove any escaped forward slashes and ensure proper URL format
    const cleaned = url.replace(/\\/g, '');
    return cleaned;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Clean image URLs in the response
        const cleanedProducts = response.data.map(product => {
          return {
            ...product,
            image: cleanImageUrl(product.image),
            image_url: cleanImageUrl(product.image_url)
          };
        });
        setProducts(cleanedProducts);
      } catch (error) {
        setError('Error fetching products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1);
    if (success) {
      refreshCart();
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {cartError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {cartError}
        </Alert>
      )}

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image ? 
                  (product.image.startsWith('http://') || product.image.startsWith('https://') ? 
                    product.image : 
                    `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${product.image}`)
                  : 'https://placehold.co/400x300/CCCCCC/666666?text=Product+Image'}
                alt={product.name}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  <span className="dirham-symbol">&#xea;</span> {Number(product.price).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <Button
                    component={Link}
                    to={`/products/${product.id}`}
                    variant="outlined"
                    fullWidth
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={cartLoading}
                  >
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList; 