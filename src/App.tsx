import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import PatientsPage from "./pages/PatientsPage";
import CalendarPage from "./pages/CalendarPage";
import AuditPage from "./pages/AuditPage";

// Material UI imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const queryClient = new QueryClient();

// Define a basic Material UI theme.
// Using approximate hex values for colors based on the existing Tailwind CSS variables.
const theme = createTheme({
  palette: {
    primary: {
      main: '#0F172A', // Dark blue/black
      contrastText: '#F8FAFC', // Light text
    },
    secondary: {
      main: '#E2E8F0', // Light gray
      contrastText: '#0F172A', // Dark text
    },
    error: {
      main: '#EF4444', // Red for destructive
      contrastText: '#F8FAFC',
    },
    background: {
      default: '#F8FAFC', // Light background
      paper: '#FFFFFF', // White card background
    },
    text: {
      primary: '#0F172A', // Dark text
      secondary: '#64748B', // Muted text
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
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Provides a consistent baseline for styling */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  {/* ADD ALL CUSTOM PROTECTED ROUTES HERE */}
                  <Route path="/patients" element={<PatientsPage />} />
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