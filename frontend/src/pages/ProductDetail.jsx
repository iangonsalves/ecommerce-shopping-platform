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
  CircularProgress,
  Rating,
  Divider,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, loading: cartLoading, error: cartError, refreshCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: ''
  });
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products/${id}/reviews`)
        ]);
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        setError('Error fetching product details');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');

    try {
      const response = await api.post(`/products/${id}/reviews`, reviewForm);
      setReviews([response.data, ...reviews]);
      setReviewDialogOpen(false);
      setReviewForm({ rating: 0, comment: '' });
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Error submitting review');
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
    <Container>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src={product.image || product.image_url || 'https://via.placeholder.com/400'}
              alt={product.name}
              style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.average_rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({product.reviews_count} reviews)
              </Typography>
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Typography>
            {successMessage && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {successMessage}
              </Alert>
            )}
            {cartError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {cartError}
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

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Reviews</Typography>
          {user && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setReviewDialogOpen(true)}
            >
              Write a Review
            </Button>
          )}
        </Box>
        
        <List>
          {reviews.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No reviews yet. Be the first to review this product!
            </Typography>
          ) : (
            reviews.map((review) => (
              <React.Fragment key={review.id}>
                <ListItem sx={{ display: 'block' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      by {review.user.name}
                    </Typography>
                    {review.verified_purchase && (
                      <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                        (Verified Purchase)
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body1">{review.comment}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.created_at).toLocaleDateString()}
                  </Typography>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          {reviewError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {reviewError}
            </Alert>
          )}
          <Box sx={{ my: 2 }}>
            <Typography component="legend">Rating</Typography>
            <Rating
              value={reviewForm.rating}
              onChange={(event, newValue) => {
                setReviewForm({ ...reviewForm, rating: newValue });
              }}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Review"
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReviewSubmit}
            variant="contained"
            disabled={!reviewForm.rating}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetail; 