import React from 'react';
import MuiButton from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Link as RouterLink } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  className?: string;
  asChild?: boolean;
  to?: string; // For Link usage with react-router-dom
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'default',
  size = 'default',
  onClick,
  className,
  asChild,
  to,
  disabled,
  ...props
}) => {
  let muiVariant: 'text' | 'outlined' | 'contained' = 'contained';
  let muiColor: 'inherit' | 'primary' | 'secondary' | 'error' = 'primary';
  let muiSize: 'small' | 'medium' | 'large' = 'medium';

  switch (variant) {
    case 'default':
      muiVariant = 'contained';
      muiColor = 'primary';
      break;
    case 'secondary':
      muiVariant = 'outlined';
      muiColor = 'secondary';
      break;
    case 'ghost':
      muiVariant = 'text';
      muiColor = 'inherit';
      break;
    case 'destructive':
      muiVariant = 'contained';
      muiColor = 'error';
      break;
  }

  switch (size) {
    case 'sm':
      muiSize = 'small';
      break;
    case 'lg':
      muiSize = 'large';
      break;
    case 'icon':
      return (
        <IconButton
          color={muiColor}
          size={muiSize}
          onClick={onClick}
          className={className}
          disabled={disabled}
          {...props}
        >
          {children}
        </IconButton>
      );
    case 'default':
    default:
      muiSize = 'medium';
      break;
  }

  const Component = asChild && to ? RouterLink : 'button';

  return (
    <MuiButton
      component={Component as any}
      to={to}
      variant={muiVariant}
      color={muiColor}
      size={muiSize}
      onClick={onClick}
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export { Button };