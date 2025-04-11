import { TextField } from '@mui/material';

const FormTextField = ({ 
  name, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  autoComplete,
  autoFocus = false,
  required = true,
  ...props 
}) => {
  return (
    <TextField
      margin="normal"
      required={required}
      fullWidth
      id={name}
      label={label}
      name={name}
      type={type}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default FormTextField; 