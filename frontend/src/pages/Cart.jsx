import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    cart, 
    loading, 
    error, 
    updateQuantity, 
    removeItem, 
    refreshCart 
  } = useCart();

  // Local state to track quantities before sending to server
  const [quantities, setQuantities] = useState({});
  // Ref to store timeout IDs for cleanup
  const timeoutRef = useRef({});

  // Initialize local quantities from cart data
  useEffect(() => {
    if (cart?.items) {
      const newQuantities = {};
      cart.items.forEach(item => {
        newQuantities[item.id] = item.quantity;
      });
      setQuantities(newQuantities);
    }
  }, [cart]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Refresh cart when component mounts
  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleQuantityChange = async (itemId, newValue) => {
    // Clear any existing timeout for this item
    if (timeoutRef.current[itemId]) {
      clearTimeout(timeoutRef.current[itemId]);
    }

    // Update local state immediately
    const newQuantity = parseInt(newValue, 10);
    if (isNaN(newQuantity) || newQuantity < 1) return;

    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));

    // Set new timeout for this item
    timeoutRef.current[itemId] = setTimeout(async () => {
      const success = await updateQuantity(itemId, newQuantity);
      if (success) {
        refreshCart();
      } else {
        // If update fails, revert to previous quantity
        setQuantities(prev => ({
          ...prev,
          [itemId]: cart?.items?.find(item => item.id === itemId)?.quantity || 1
        }));
      }
      // Clear the timeout reference after it's done
      timeoutRef.current[itemId] = null;
    }, 300); // Reduced debounce time for better responsiveness
  };

  const handleRemoveItem = async (itemId) => {
    // Clear any pending timeout for this item
    if (timeoutRef.current[itemId]) {
      clearTimeout(timeoutRef.current[itemId]);
    }

    const success = await removeItem(itemId);
    if (success) {
      refreshCart();
      // Remove from local quantities state
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[itemId];
        return newQuantities;
      });
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container>
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + (item.price * quantities[item.id]), 0);

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>

        <Box sx={{ mt: 3 }}>
          {cart.items.map((item) => (
            <Box key={item.id} sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Box
                    component="img"
                    src={
                      item.product?.image
                        ? (item.product.image.startsWith('http://') || item.product.image.startsWith('https://')
                            ? item.product.image
                            : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${item.product.image}`)
                        : (item.product?.image_url
                            ? (item.product.image_url.startsWith('http://') || item.product.image_url.startsWith('https://')
                                ? item.product.image_url
                                : `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}/${item.product.image_url}`)
                            : 'https://via.placeholder.com/100')
                    }
                    alt={item.product?.name || 'Product'}
                    sx={{
                      width: '100%',
                      maxWidth: '100px',
                      height: 'auto',
                      objectFit: 'contain'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="h6">{item.product?.name || 'Product'}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${Number(item.price || 0).toFixed(2)}
                  </Typography>
                  {/* Display selected size if available */}
                  {item.options?.size && (
                    <Typography variant="body2" color="text.secondary">
                      Size: {item.options.size}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={quantities[item.id] || item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    onBlur={(e) => handleQuantityChange(item.id, e.target.value)}
                    inputProps={{ 
                      min: 1,
                      style: { textAlign: 'center' }
                    }}
                    size="small"
                    sx={{ width: '80px' }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography variant="h6">
                    ${(item.price * (quantities[item.id] || item.quantity)).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton 
                    color="error" 
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="remove item"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5">
            Total: ${total.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Cart; 