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
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../services/api';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchReviews = async () => {
    try {
      const response = await api.get('/admin/reviews');
      setReviews(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to fetch reviews. Please try again.');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpen = (review) => {
    setSelectedReview(review);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReview(null);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/admin/reviews/${reviewId}`);
        fetchReviews();
      } catch (error) {
        console.error('Error deleting review:', error);
        setError('Failed to delete review. Please try again.');
      }
    }
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

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reviews Management
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
              <TableCell>Product</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.product.name}</TableCell>
                <TableCell>{review.user.name}</TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly size="small" />
                </TableCell>
                <TableCell>
                  <Chip
                    label={review.verified_purchase ? 'Verified' : 'Unverified'}
                    color={review.verified_purchase ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{formatDate(review.created_at)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(review)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(review.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Review Details</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Product Information
              </Typography>
              <Typography variant="body1">
                Product: {selectedReview.product.name}
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography component="legend">Rating</Typography>
                <Rating value={selectedReview.rating} readOnly />
              </Box>
              <Typography variant="h6" gutterBottom>
                Review Content
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedReview.comment || 'No comment provided'}
              </Typography>
              <Typography variant="h6" gutterBottom>
                User Information
              </Typography>
              <Typography variant="body1">
                Name: {selectedReview.user.name}
              </Typography>
              <Typography variant="body1">
                Email: {selectedReview.user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Posted on: {formatDate(selectedReview.created_at)}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={selectedReview.verified_purchase ? 'Verified Purchase' : 'Unverified Purchase'}
                  color={selectedReview.verified_purchase ? 'success' : 'default'}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            onClick={() => {
              handleDelete(selectedReview.id);
              handleClose();
            }}
            color="error"
          >
            Delete Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReviewManagement; 