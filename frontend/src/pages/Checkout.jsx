import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Box,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { Elements } from '@stripe/react-stripe-js';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import stripePromise from '../config/stripe';

const steps = ['Shipping Address', 'Payment Details', 'Review Order'];

const initialShippingData = {
  firstName: '',
  lastName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  phone: ''
};

const initialErrors = {
  firstName: '',
  lastName: '',
  address1: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  phone: ''
};

const PaymentForm = ({ clientSecret, setPaymentError, onPaymentSuccess, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);
    setError('');
    setPaymentError('');

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setPaymentError(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      setPaymentError('An unexpected error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Box sx={{ border: '1px solid #ccc', p: 2, borderRadius: 1, mb: 2 }}>
        <CardElement options={{ style: { base: { fontSize: '16px' } }, disabled: processing || !clientSecret }} />
      </Box>
      {!clientSecret && !processing && (
        <Alert severity="warning" sx={{ mb: 2 }}>Initializing payment form...</Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Button
        type="submit"
        variant="contained"
        disabled={!stripe || !elements || !clientSecret || processing}
        fullWidth
      >
        {processing ? <CircularProgress size={24} /> : `Pay $${Number(total || 0).toFixed(2)}`}
      </Button>
    </form>
  );
};

const CheckoutContent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState(initialShippingData);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (activeStep === 1 && cart?.items?.length > 0 && !clientSecret && !paymentProcessing) {
        setPaymentProcessing(true);
        setPaymentError('');
        try {
          const response = await api.post('/create-payment-intent', {
            amount: cart.total * 100, // Convert to cents
            currency: 'usd'
          });
          if (response.data.clientSecret) {
            setClientSecret(response.data.clientSecret);
          } else {
            setPaymentError('Could not initialize payment. Please try again.');
          }
        } catch (error) {
          console.error("Error fetching payment intent:", error);
          setPaymentError(error.response?.data?.error || 'Failed to initialize payment system. Please refresh or try again later.');
        } finally {
          setPaymentProcessing(false);
        }
      }
    };

    fetchPaymentIntent();
  }, [activeStep, cart?.items, cart?.total, clientSecret, paymentProcessing]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // Validate shipping data
    const newErrors = {};
    let hasError = false;

    Object.keys(shippingData).forEach(field => {
      if (field !== 'address2' && !shippingData[field]) {
        newErrors[field] = 'This field is required';
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    handleNext();
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    setPaymentIntentId(paymentIntentId);
    handleNext();
  };

  const handlePlaceOrder = async () => {
    if (!paymentIntentId) {
      setSubmitError('Payment information is missing');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await api.post('/checkout', {
        shipping: shippingData,
        payment_intent_id: paymentIntentId
      });

      if (response.data.status === 'success') {
        clearCart();
        navigate('/checkout/success', { 
          state: { 
            orderId: response.data.order.id
          }
        });
      } else {
        setSubmitError('Failed to place order. Please try again.');
      }
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleShippingSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={shippingData.firstName}
                  onChange={(e) => {
                    setShippingData({ ...shippingData, firstName: e.target.value });
                    setErrors({ ...errors, firstName: '' });
                  }}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={shippingData.lastName}
                  onChange={(e) => {
                    setShippingData({ ...shippingData, lastName: e.target.value });
                    setErrors({ ...errors, lastName: '' });
                  }}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address Line 1"
                  name="address1"
                  value={shippingData.address1}
                  onChange={(e) => {
                    setShippingData({ ...shippingData, address1: e.target.value });
                    setErrors({ ...errors, address1: '' });
                  }}
                  error={!!errors.address1}
                  helperText={errors.address1}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  name="address2"
                  value={shippingData.address2}
                  onChange={(e) => setShippingData({ ...shippingData, address2: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingData.city}
                  onChange={(e) => {
                    setShippingData({ ...shippingData, city: e.target.value });
                    setErrors({ ...errors, city: '' });
                  }}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={shippingData.state}
                  onChange={(e) => {
                    setShippingData({ ...shippingData, state: e.target.value });
                    setErrors({ ...errors, state: '' });
                  }}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="ZIP/Postal Code"
                  name="zip"
                  value={shippingData.zip}
                  onChange={(e) => {
                    setShippingData({ ...shippingData, zip: e.target.value });
                    setErrors({ ...errors, zip: '' });
                  }}
                  error={!!errors.zip}
                  helperText={errors.zip}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  name="country"
                  value={shippingData.country}
                  onChange={(e) => {
                    setShippingData({ ...shippingData, country: e.target.value });
                    setErrors({ ...errors, country: '' });
                  }}
                  error={!!errors.country}
                  helperText={errors.country}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={shippingData.phone}
                  onChange={(e) => {
                    setShippingData({ ...shippingData, phone: e.target.value });
                    setErrors({ ...errors, phone: '' });
                  }}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                Next
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Elements stripe={stripePromise}>
            <PaymentForm
              clientSecret={clientSecret}
              setPaymentError={setPaymentError}
              onPaymentSuccess={handlePaymentSuccess}
              total={cart?.total}
            />
          </Elements>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order summary
            </Typography>
            <Grid container spacing={2}>
              {cart?.items?.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={3}>
                        <img
                          src={item.product.image || item.product.image_url || 'https://via.placeholder.com/100'}
                          alt={item.product.name}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography gutterBottom>{item.product?.name}</Typography>
                        {/* Display selected size if available */}
                        {item.options?.size && (
                          <Typography variant="body2" color="text.secondary">
                            Size: {item.options.size}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">Quantity: {item.quantity}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle1">
                          ${Number(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Shipping Details
            </Typography>
            <Typography>{shippingData.firstName} {shippingData.lastName}</Typography>
            <Typography>{shippingData.address1}</Typography>
            {shippingData.address2 && <Typography>{shippingData.address2}</Typography>}
            <Typography>{shippingData.city}, {shippingData.state} {shippingData.zip}</Typography>
            <Typography>{shippingData.country}</Typography>
            <Typography>Phone: {shippingData.phone}</Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  Total: ${Number(cart?.total || 0).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
            {submitError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlaceOrder}
              disabled={isSubmitting || !paymentIntentId}
              sx={{ mt: 3 }}
              fullWidth
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Place Order'}
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (cartLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>
          Your cart is empty. Please add items before proceeding to checkout.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
        {activeStep !== 0 && activeStep !== 2 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
            <Button onClick={handleBack}>Back</Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

const Checkout = () => {
  return (
    <CheckoutContent />
  );
};

export default Checkout; 