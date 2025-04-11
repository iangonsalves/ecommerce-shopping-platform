import { Alert } from '@mui/material';

const AlertMessage = ({ message, severity, onClose, sx = {} }) => {
  if (!message) return null;

  return (
    <Alert 
      severity={severity} 
      onClose={onClose}
      sx={{ mb: 2, whiteSpace: 'pre-line', ...sx }}
    >
      {message}
    </Alert>
  );
};

export default AlertMessage; 