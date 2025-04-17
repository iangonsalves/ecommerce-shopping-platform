import React, { useState } from 'react';
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

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState(initialShippingData);
  const [errors, setErrors] = useState(initialErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { cart, loading: cartLoading } = useCart();
  const navigate = useNavigate();

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

  const handleNext = async () => {
    if (activeStep === 0 && !validateShippingForm()) {
      return;
    }

    if (activeStep === steps.length - 1) {
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        // Validate checkout data with the backend
        const response = await axios.post('/api/checkout', {
          shipping: shippingData
        });

        if (response.data.status === 'success') {
          // For Week 3, we just show success
          // In Week 4, we'll handle actual order creation
          navigate('/checkout/success');
        }
      } catch (error) {
        setSubmitError(
          error.response?.data?.message || 
          'Failed to validate checkout data. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleShippingInput = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value
    }));
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
          <Typography variant="h6" gutterBottom>
            Payment method
          </Typography>
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Total: ${cart?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
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
              Your order number is #2001539. We have emailed your order
              confirmation, and will send you an update when your order has
              shipped.
            </Typography>
          </Box>
        ) : (
          <>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            {getStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleNext}
                color={activeStep === steps.length - 1 ? 'secondary' : 'primary'}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  activeStep === steps.length - 1 ? 'Place order' : 'Next'
                )}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Checkout; 