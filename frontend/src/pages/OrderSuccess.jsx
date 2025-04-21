import React from 'react';
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
  Alert
} from '@mui/material';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order; // Get order details passed from checkout

  // Redirect if no order data is found (e.g., direct navigation)
  if (!order) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Alert severity="warning">
            No order details found. You might have accessed this page directly.
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')} 
            sx={{ mt: 2 }}
            fullWidth
          >
            Go to Homepage
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
          Thank You For Your Order!
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          Your order has been placed successfully.
        </Typography>
        
        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Order Summary (ID: {order.id})
        </Typography>
        <List disablePadding>
          {order.items.map((item) => (
            <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
              <ListItemText 
                primary={item.product_name} 
                secondary={`Quantity: ${item.quantity}`} 
              />
              <Typography variant="body2">${(item.price * item.quantity).toFixed(2)}</Typography>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ${parseFloat(order.total).toFixed(2)}
            </Typography>
          </ListItem>
        </List>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Shipping Address
        </Typography>
        <Typography>{order.shipping_first_name} {order.shipping_last_name}</Typography>
        <Typography>{order.shipping_address1}</Typography>
        {order.shipping_address2 && <Typography>{order.shipping_address2}</Typography>}
        <Typography>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</Typography>
        <Typography>{order.shipping_country}</Typography>
        <Typography>Phone: {order.shipping_phone}</Typography>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            component={RouterLink} 
            to="/products"
            sx={{ mr: 2 }}
          >
            Continue Shopping
          </Button>
          <Button 
            variant="outlined" 
            component={RouterLink} 
            to="/orders" // Link to order history (we'll create this next)
          >
            View Order History
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccess; 