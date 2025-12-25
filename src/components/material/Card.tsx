import React from 'react';
import MuiCard from '@mui/material/Card';
import MuiCardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardTitleProps {
  className?: string;
  children?: React.ReactNode;
}

interface CardContentProps {
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <MuiCard className={className}>
      {children}
    </MuiCard>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ className, children }) => {
  return (
    <Box className={`p-6 ${className}`}>
      {children}
    </Box>
  );
};

const CardTitle: React.FC<CardTitleProps> = ({ className, children }) => {
  return (
    <Typography variant="h5" component="h3" className={`font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </Typography>
  );
};

const CardContent: React.FC<CardContentProps> = ({ className, children }) => {
  return (
    <MuiCardContent className={className}>
      {children}
    </MuiCardContent>
  );
};

export { Card, CardHeader, CardTitle, CardContent };