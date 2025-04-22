import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../services/api';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
    setError('');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdateLoading(true);
    try {
      await api.put(`/admin/orders/${orderId}/status`, {
        status: newStatus
      });
      fetchOrders();
      setError('');
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.user?.name}</TableCell>
                <TableCell>{formatDate(order.created_at)}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      disabled={statusUpdateLoading}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(order)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Order Details #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <>
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography>Date: {formatDate(selectedOrder.created_at)}</Typography>
                <Typography>Status: 
                  <Chip 
                    label={selectedOrder.status}
                    color={getStatusColor(selectedOrder.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography>Total: {formatCurrency(selectedOrder.total)}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography>Name: {selectedOrder.shipping_first_name} {selectedOrder.shipping_last_name}</Typography>
                <Typography>Email: {selectedOrder.user?.email}</Typography>
                <Typography>Phone: {selectedOrder.shipping_phone}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Shipping Address
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography>{selectedOrder.shipping_address1}</Typography>
                {selectedOrder.shipping_address2 && (
                  <Typography>{selectedOrder.shipping_address2}</Typography>
                )}
                <Typography>
                  {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}
                </Typography>
                <Typography>{selectedOrder.shipping_country}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <List>
                {selectedOrder.items?.map((item) => (
                  <React.Fragment key={item.id}>
                    <ListItem>
                      <ListItemText
                        primary={item.product_name}
                        secondary={`Quantity: ${item.quantity} | Price: ${formatCurrency(item.price)}`}
                      />
                      <Typography variant="body2">
                        {formatCurrency(item.quantity * item.price)}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement; 