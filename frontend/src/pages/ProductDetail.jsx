import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../services/api';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, loading: cartLoading, error: cartError, refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        setError('Error fetching product details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    setSuccessMessage('');
    const success = await addToCart(product.id, quantity);
    if (success) {
      setSuccessMessage('Item added to cart successfully!');
      setQuantity(1);
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

  if (error || !product) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Product not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.image || product.image_url || 'https://via.placeholder.com/400'}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'contain'
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stock: {product.stock} units
            </Typography>

            {cartError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {cartError}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: '100px' }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                disabled={cartLoading || quantity < 1 || quantity > product.stock}
              >
                {cartLoading ? 'Adding...' : 'Add to Cart'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail; 