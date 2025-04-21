import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Paper,
  Grid,
  TextField,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const steps = ['Shipping Address', 'Payment Details', 'Review Order'];

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'YOUR_STRIPE_PUBLISHABLE_KEY');

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

const PaymentForm = ({ cart, shippingData, clientSecret, onSubmit, processing, error }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    onSubmit(null, null, true);

    if (!stripe || !elements || !clientSecret) {
      console.error('Stripe.js not loaded or no client secret');
      onSubmit('Payment system not ready. Please wait or refresh.', null, false);
      return;
    }
    
    console.log('Using Client Secret:', clientSecret);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        onSubmit('Card details not found. Please try again.', null, false);
        return;
    }

    const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${shippingData.firstName} ${shippingData.lastName}`,
          address: {
            line1: shippingData.address1 || '',
            line2: shippingData.address2 || null,
            city: shippingData.city || '',
            state: shippingData.state || '',
            postal_code: shippingData.zip || '',
            country: shippingData.country || '',
          },
          phone: shippingData.phone || null,
        },
      },
    });

    if (paymentError) {
      console.error("Stripe payment error object:", paymentError);
      const message = paymentError.message || 'An unknown payment error occurred.';
      onSubmit(message, null, false);
    } else {
      onSubmit(null, paymentIntent, false);
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
        {processing ? <CircularProgress size={24} /> : `Pay $${cart?.total?.toFixed(2) || '0.00'}`}
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
                const response = await axios.post('/api/create-payment-intent'); 
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
    
    if (activeStep !== 1 && clientSecret) {
      setClientSecret('');
    }

  }, [activeStep, cart?.items, clientSecret, paymentProcessing]); 

  const validateShippingForm = () => {
    const newErrors = { ...initialErrors };
    let isValid = true;

    if (!shippingData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    if (!shippingData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!shippingData.address1.trim()) {
      newErrors.address1 = 'Address is required';
      isValid = false;
    }

    if (!shippingData.city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }

    if (!shippingData.state.trim()) {
      newErrors.state = 'State is required';
      isValid = false;
    }

    if (!shippingData.zip.trim()) {
      newErrors.zip = 'ZIP code is required';
      isValid = false;
    } else if (!/^\d{5}(-\d{4})?$/.test(shippingData.zip)) {
      newErrors.zip = 'Invalid ZIP code format';
      isValid = false;
    }

    if (!shippingData.country.trim()) {
      newErrors.country = 'Country is required';
      isValid = false;
    }

    if (!shippingData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^\+?[\d\s-]{10,}$/.test(shippingData.phone)) {
      newErrors.phone = 'Invalid phone number format';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePaymentResult = async (errorMsg, paymentIntentResult, processing) => {
    setPaymentProcessing(processing);
    setPaymentError(errorMsg || '');

    if (errorMsg || processing) {
      return; 
    }

    if (paymentIntentResult?.status === 'succeeded') {
      setPaymentIntentId(paymentIntentResult.id);
      setActiveStep((prevStep) => prevStep + 1);
    } else {
      console.warn("Payment not succeeded:", paymentIntentResult);
      setPaymentError(`Payment status: ${paymentIntentResult?.status || 'Unknown'}. Please try again.`);
    }
  };

  const handlePlaceOrder = async () => {
    if (!paymentIntentId) {
        setSubmitError("Cannot place order without a successful payment confirmation.");
        return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    try {
        const response = await axios.post('/api/checkout', { 
          shipping: shippingData,
          paymentIntentId: paymentIntentId
        });

        if (response.data.status === 'success') {
          clearCart(); 
          navigate('/checkout/success', { state: { order: response.data.order } }); 
        } else {
           setSubmitError(response.data.message || 'Failed to finalize order after payment.');
        }
      } catch (orderError) {
        console.error("Order placement error:", orderError);
        setSubmitError(
          orderError.response?.data?.message || 
          'Payment succeeded, but failed to finalize order. Please contact support. Reference ID: ' + paymentIntentId
        );
      } finally {
        setIsSubmitting(false);
      }
  }

  const handleNext = async () => {
    setSubmitError(''); 
    setPaymentError(''); 

    if (activeStep === 0) {
      if (!validateShippingForm()) {
        return;
      }
      setActiveStep((prevStep) => prevStep + 1);
    } 
  };

  const handleBack = () => {
    if (activeStep === 2 || activeStep === 1) {
      setPaymentError('');
    }
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingInput = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) { 
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First name"
                name="firstName"
                value={shippingData.firstName}
                onChange={handleShippingInput}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last name"
                name="lastName"
                value={shippingData.lastName}
                onChange={handleShippingInput}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address line 1"
                name="address1"
                value={shippingData.address1}
                onChange={handleShippingInput}
                error={!!errors.address1}
                helperText={errors.address1}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address line 2"
                name="address2"
                value={shippingData.address2}
                onChange={handleShippingInput}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                name="city"
                value={shippingData.city}
                onChange={handleShippingInput}
                error={!!errors.city}
                helperText={errors.city}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State/Province/Region"
                name="state"
                value={shippingData.state}
                onChange={handleShippingInput}
                error={!!errors.state}
                helperText={errors.state}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Zip / Postal code"
                name="zip"
                value={shippingData.zip}
                onChange={handleShippingInput}
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
                onChange={handleShippingInput}
                error={!!errors.country}
                helperText={errors.country}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone number"
                name="phone"
                value={shippingData.phone}
                onChange={handleShippingInput}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <PaymentForm 
            cart={cart}
            shippingData={shippingData}
            clientSecret={clientSecret}
            onSubmit={handlePaymentResult}
            processing={paymentProcessing}
            error={paymentError} 
          />
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
                          src={item.product.image || 'https://via.placeholder.com/100'}
                          alt={item.product.name}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle1">
                          {item.product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle1">
                          ${(item.price * item.quantity).toFixed(2)}
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
                  Total: ${cart?.total?.toFixed(2) || '0.00'}
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
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Paper sx={{ p: 3, my: 3 }}>
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
        {activeStep === steps.length ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Thank you for your order.
            </Typography>
            <Typography variant="subtitle1">
              Your order details should be displayed here or fetched based on state.
            </Typography>
            <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Continue Shopping</Button>
          </Box>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }} disabled={isSubmitting || paymentProcessing}>
                  Back
                </Button>
              )}
              {activeStep === 0 && (
                <Button
                  variant="contained"
                  onClick={handleNext} 
                  disabled={isSubmitting || paymentProcessing || cart?.items?.length === 0} 
                >
                  Next
                </Button>
              )}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
};

export default Checkout; 