import { Button } from '@mui/material';

const LoadingButton = ({ 
  loading, 
  loadingText, 
  children, 
  ...props 
}) => {
  return (
    <Button
      disabled={loading}
      {...props}
    >
      {loading ? loadingText : children}
    </Button>
  );
};

export default LoadingButton; 