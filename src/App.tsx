
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import PatientManagement from './components/PatientManagement';
import IncidentManagement from './components/IncidentManagement';
import CalendarView from './components/CalendarView';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginForm />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/patients" element={
          <ProtectedRoute requiredRole="Admin">
            <PatientManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/appointments" element={
          <ProtectedRoute requiredRole="Admin">
            <IncidentManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/calendar" element={
          <ProtectedRoute requiredRole="Admin">
            <CalendarView />
          </ProtectedRoute>
        } />
        
        <Route path="/my-appointments" element={
          <ProtectedRoute requiredRole="Patient">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Appointments</h2>
              <p className="text-gray-600">Coming soon - detailed appointment history and upcoming visits</p>
            </div>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
