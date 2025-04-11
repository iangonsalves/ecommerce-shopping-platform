import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError, clearMessage } from '../features/auth/authSlice';
import { Typography, Box } from '@mui/material';
import PageContainer from '../components/layout/PageContainer';
import AlertMessage from '../components/common/AlertMessage';
import FormTextField from '../components/form/FormTextField';
import LoadingButton from '../components/common/LoadingButton';
import useForm from '../hooks/useForm';

const Register = () => {
  const {
    formData,
    handleChange,
    resetForm
  } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, message } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (!result.error) {
      resetForm();
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <PageContainer>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Register
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
          name="name"
          label="Full Name"
          autoComplete="name"
          autoFocus
          value={formData.name}
          onChange={handleChange}
        />
        
        <FormTextField
          name="email"
          label="Email Address"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        
        <FormTextField
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
        />
        
        <FormTextField
          name="password_confirmation"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          value={formData.password_confirmation}
          onChange={handleChange}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          loading={loading}
          loadingText="Registering..."
        >
          Register
        </LoadingButton>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ textDecoration: 'none' }}>
            Login here
          </Link>
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default Register; 