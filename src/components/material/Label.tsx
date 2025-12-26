import React from 'react';
import MuiInputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';

interface LabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, children, className }) => {
  return (
    <MuiInputLabel htmlFor={htmlFor} shrink className={`!text-base !font-medium !text-foreground ${className}`}>
      {children}
    </MuiInputLabel>
  );
};

export { Label };