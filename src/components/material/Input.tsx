import React from 'react';
import MuiTextField, { TextFieldProps } from '@mui/material/TextField';

interface InputProps extends TextFieldProps {
  // Add any specific props if needed, otherwise TextFieldProps covers most cases
}

const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <MuiTextField
      variant="outlined" // Default Material UI variant
      fullWidth // Make it take full width by default
      className={className}
      {...props}
    />
  );
};

export { Input };