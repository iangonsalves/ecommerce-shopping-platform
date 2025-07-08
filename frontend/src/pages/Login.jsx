import React, { useState, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Typography, Box, Alert } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import FormTextField from '../components/form/FormTextField';
import LoadingButton from '../components/common/LoadingButton';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <FormTextField
          name="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
        
        <FormTextField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={loading}
          loadingText="Logging in..."
          disabled={loading}
        >
          Login
        </LoadingButton>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ textDecoration: 'none' }}>
            Register here
          </Link>
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default Login; 