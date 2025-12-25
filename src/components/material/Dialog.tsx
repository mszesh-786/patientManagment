import React from 'react';
import MuiDialog from '@mui/material/Dialog';
import MuiDialogTitle from '@mui/material/DialogTitle';
import MuiDialogContent from '@mui/material/DialogContent';
import MuiDialogContentText from '@mui/material/DialogContentText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children, className }) => {
  return (
    <MuiDialog open={open} onClose={() => onOpenChange(false)} className={className}>
      {children}
    </MuiDialog>
  );
};

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild }) => {
  // Material UI Dialogs are typically controlled, so the trigger just renders its children.
  // The parent component handles the `open` state.
  return <>{children}</>;
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className }) => {
  return (
    <Box className={`p-6 pb-4 ${className}`}>
      {children}
    </Box>
  );
};

const DialogTitle: React.FC<DialogTitleProps> = ({ children, className }) => {
  return (
    <MuiDialogTitle className={`!p-0 !text-2xl !font-semibold !leading-none !tracking-tight ${className}`}>
      {children}
    </MuiDialogTitle>
  );
};

const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, className }) => {
  return (
    <MuiDialogContentText className={`!text-sm !text-muted-foreground ${className}`}>
      {children}
    </MuiDialogContentText>
  );
};

const DialogContent: React.FC<DialogContentProps> = ({ children, className }) => {
  return (
    <MuiDialogContent className={`!p-6 !pt-0 ${className}`}>
      {children}
    </MuiDialogContent>
  );
};

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
};