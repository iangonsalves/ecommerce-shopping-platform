import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError, clearMessage } from '../features/auth/authSlice';
import { Typography, Box } from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import AlertMessage from '../components/common/AlertMessage';
import FormTextField from '../components/form/FormTextField';
import LoadingButton from '../components/common/LoadingButton';
import useForm from '../hooks/useForm';

const Login = () => {
  const {
    formData,
    handleChange,
    resetForm
  } = useForm({
    email: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      resetForm();
      navigate('/');
    }
  };

  return (
    <PageContainer>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Login
      </Typography>
      
      <AlertMessage 
        message={error} 
        severity="error" 
        onClose={() => dispatch(clearError())} 
      />
      
      <AlertMessage 
        message={message} 
        severity="success" 
        onClose={() => dispatch(clearMessage())} 
      />

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <FormTextField
          name="email"
          label="Email Address"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
        />
        
        <FormTextField
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={loading}
          loadingText="Logging in..."
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