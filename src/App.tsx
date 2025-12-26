import { Toaster as Sonner } from "@/components/ui/sonner"; // Keep Sonner
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // New import
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import PatientsPage from "./pages/PatientsPage";
import CalendarPage from "./pages/CalendarPage";
import AuditPage from "./pages/AuditPage";
import PatientRegistrationPage from "./pages/PatientRegistrationPage";

// Material UI imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const queryClient = new QueryClient();

// Define a basic Material UI theme.
// Using approximate hex values for colors based on the existing Tailwind CSS variables.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1E293B', // Corresponds to --primary (dark blue-gray)
      contrastText: '#F8FAFC', // Corresponds to --primary-foreground (off-white)
    },
    secondary: {
      main: '#F1F5F9', // Corresponds to --secondary (light gray)
      contrastText: '#1E293B', // Corresponds to --secondary-foreground (dark blue-gray)
    },
    error: {
      main: '#EF4444', // Corresponds to --destructive (red)
      contrastText: '#F8FAFC',
    },
    background: {
      default: '#F8FAFC', // Corresponds to --background (off-white)
      paper: '#FFFFFF', // Corresponds to --card (white)
    },
    text: {
      primary: '#0F172A', // Corresponds to --foreground (very dark blue)
      secondary: '#64748B', // Muted text, using a common gray
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent Material UI from uppercasing button text
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', // Mimic shadcn card shadow
          borderRadius: '0.5rem', // Mimic shadcn border radius
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // Ensure labels are visible and styled correctly
          transform: 'translate(14px, 16px) scale(1)', // Default position for outlined input
          '&.Mui-focused': {
            color: 'var(--foreground)', // Keep foreground color when focused
          },
          '&.Mui-error': {
            color: 'var(--destructive)', // Error color
          },
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)', // Shrink position
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--destructive)', // Error border color
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary)', // Hover border color
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--primary)', // Focused border color
          },
        },
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Provides a consistent baseline for styling */}
      <TooltipProvider>
        {/* Removed shadcn/ui Toaster */}
        <Sonner /> {/* Keep Sonner for toast notifications */}
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} /> {/* New Signup Route */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM PROTECTED ROUTES HERE */}
                  <Route path="/patients" element={<PatientsPage />} />
                  <Route path="/patients/register" element={<PatientRegistrationPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/audit" element={<AuditPage />} />
                </Route>
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;