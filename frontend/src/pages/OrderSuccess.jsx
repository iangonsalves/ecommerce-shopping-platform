import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../services/api';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const orderId = location.state?.orderId;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {  
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // If no order data is found (e.g., direct navigation)
  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            No order details found. You might have accessed this page directly.
          </Alert>
          <Button 
            variant="contained" 
            component={RouterLink}
            to="/orders"
            sx={{ mr: 2 }}
          >
            View Orders
          </Button>
          <Button 
            variant="outlined" 
            component={RouterLink}
            to="/"
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" color="primary" gutterBottom>
            Order Placed Successfully!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Thank you for your purchase
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Order ID" 
              secondary={order.id} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Total Amount" 
              secondary={`$${order.total.toFixed(2)}`} 
            />
          </ListItem>
          <ListItem>
            <ListItemText 
              primary="Status" 
              secondary={order.status} 
            />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="contained" 
            component={RouterLink}
            to="/orders"
          >
            View All Orders
          </Button>
          <Button 
            variant="outlined" 
            component={RouterLink}
            to="/"
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess; 