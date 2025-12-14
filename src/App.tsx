// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import { useAuthStore } from './store/auth-store';

// 1. Core Pages (Default)
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';

// 2. Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import SettingsPage from './pages/auth/SettingsPage'; // Used for shared profile settings

// 3. Main User Pages
import FindAttorneyPage from './pages/main/FindAttorneyPage';
import AttorneyDetailsPage from './pages/main/AttorneyDetailsPage';
import DashboardPage from './pages/main/DashboardPage'; // The Role Manager/General Dashboard
import ExpensesPage from './pages/main/ExpensesPage';
import LoansPage from './pages/main/LoanPage';
import ProfilePage from './pages/main/ProfilePage';
import TaxDashboardPage from './pages/main/TaxDashboardPage';

// 4. Attorney Specific Pages (These were the components we discussed routing to)
import AttorneyDashboardContent from './components/attorney/AttorneyDashboardContent'; // The landing page for /attorney/dashboard
import AttorneyClientPortalPage from './components/attorney/AttorneyClientPortalPage';
import AttorneyBillingInvoicingPage from './components/attorney/AttorneyBillingInvoicingPage';
import AttorneyTaxResourcesPage from './components/attorney/AttorneyTaxResourcesPage';


// Assuming UserType is defined globally, e.g., 'individual' | 'attorney' | 'business'
type UserType = 'individual' | 'attorney' | 'business'; 


// --- ROUTE GUARDS ---

// Standard Protected Route (Checks auth status)
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    const currentPath = window.location.pathname;
    return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} replace />;
  }
  
  return <>{children}</>;
}

// Role-Specific Protected Route (Checks auth and user type)
function RoleProtectedRoute({ role, children }: { role: UserType, children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuthStore();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    if (user && user.userType !== role) {
      // Redirect wrong role users to their default dashboard
      const destination = user.userType === 'attorney' ? '/attorney/dashboard' : '/dashboard';
      console.warn(`Access denied: User (${user.userType}) attempted to reach ${role} route. Redirecting to ${destination}`);
      return <Navigate to={destination} replace />;
    }
    
    return <>{children}</>;
}

// Public Only Route (redirect to dashboard if logged in)
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated && user) {
    // Redirect based on role if already authenticated
    const destination = user.userType === 'attorney' ? '/attorney/dashboard' : '/dashboard';
    return <Navigate to={destination} replace />;
  }
  
  return <>{children}</>;
}

// --- MAIN ROUTER COMPONENT ---

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/find-attorney" element={<FindAttorneyPage />} />
      <Route path="/attorney/:id" element={<AttorneyDetailsPage />} />
      <Route path="/attorney/:id/hire" element={<ProtectedRoute><AttorneyDetailsPage /></ProtectedRoute>} />
      
      {/* Auth Routes - Public Only */}
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
      <Route path="/reset-password" element={<PublicOnlyRoute><ResetPasswordPage /></PublicOnlyRoute>} />
      
      {/* Protected Routes - General User Features */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
      <Route path="/loans" element={<ProtectedRoute><LoansPage /></ProtectedRoute>} />
      <Route path="/tax" element={<ProtectedRoute><TaxDashboardPage /></ProtectedRoute>} />
      <Route path="/tax-calculator" element={<ProtectedRoute><TaxDashboardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      
      {/* Shared Settings Page (Handles AttorneyProfileSettingsPage logic internally) */}
      <Route path="/profile/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      <Route 
        path="/attorney/dashboard" 
        element={<RoleProtectedRoute role="attorney"><AttorneyDashboardContent /></RoleProtectedRoute>} 
      />
      <Route 
        path="/attorney/clients" 
        element={<RoleProtectedRoute role="attorney"><AttorneyClientPortalPage /></RoleProtectedRoute>} 
      />
      <Route 
        path="/attorney/billing" 
        element={<RoleProtectedRoute role="attorney"><AttorneyBillingInvoicingPage /></RoleProtectedRoute>} 
      />
      <Route 
        path="/attorney/resources" 
        element={<RoleProtectedRoute role="attorney"><AttorneyTaxResourcesPage /></RoleProtectedRoute>} 
      />

      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;