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
import SettingsPage from './pages/auth/SettingsPage';

// 3. Main User Pages
import FindAttorneyPage from './pages/main/FindAttorneyPage';
import AttorneyDetailsPage from './pages/main/AttorneyDetailsPage';
import DashboardPage from './pages/main/DashboardPage';
import ExpensesPage from './pages/main/ExpensesPage';
import LoansPage from './pages/main/LoanPage';
import ProfilePage from './pages/main/ProfilePage';
import TaxDashboardPage from './pages/main/TaxDashboardPage';

// BOOKING IMPORTS
import BookingPage from './pages/main/BookingPage'; 
import BookingDetailsPage from './pages/main/BookingDetailsPage'; 

// 4. Attorney Specific Pages
import AttorneyDashboardContent from './components/attorney/AttorneyDashboardContent';
import AttorneyClientPortalPage from './components/attorney/AttorneyClientPortalPage';
import AttorneyBillingInvoicingPage from './components/attorney/AttorneyBillingInvoicingPage';
import AttorneyTaxResourcesPage from './components/attorney/AttorneyTaxResourcesPage';

// 🎯 NEW FIRS NEWS PAGE IMPORT
import FirsNewsFeedPage from './pages/resources/FirsNewsPage'; 

// 5. Admin Specific Pages
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import AdminVerificationPage from './components/admin/AdminAttorneyVerificationPage';
import AdminReviewPage from './components/admin/AdminAttorneyReviewPage';
import AdminPayoutsPage from './components/admin/AdminPayoutsPage';
import AdminUsersPage from './components/admin/AdminUsersPage';
import AdminAuditPage from './components/admin/AdminAuditPage';
import MyBookingsPage from './pages/main/MyBookingsPage';


// Define the full set of User and Admin roles
type UserType = 'individual' | 'attorney' | 'business' | 'admin' | 'fitadmin';
const ADMIN_ROLES: UserType[] = ['admin', 'fitadmin'];


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

// Role-Specific Protected Route (Checks auth and specific user type)
function RoleProtectedRoute({ role, children }: { role: UserType, children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuthStore();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    
    // Handles the Attorney role check against other standard roles
    if (user && user.userType !== role) {
      const destination = ADMIN_ROLES.includes(user.userType as UserType) ? '/admin/dashboard' :
                          user.userType === 'attorney' ? '/attorney/dashboard' : '/dashboard';
      console.warn(`Access denied: User (${user.userType}) attempted to reach ${role} route. Redirecting to ${destination}`);
      return <Navigate to={destination} replace />;
    }
    
    return <>{children}</>;
}

// Admin Protected Route (Checks auth and Admin user types)
function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, user } = useAuthStore();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // Check if the authenticated user has an Admin role
    if (user && !ADMIN_ROLES.includes(user.userType as UserType)) {
        // Redirect non-admin users to their appropriate dashboard
        const destination = user.userType === 'attorney' ? '/attorney/dashboard' : '/dashboard';
        console.warn(`Access denied: User (${user.userType}) attempted to reach Admin route. Redirecting to ${destination}`);
        return <Navigate to={destination} replace />;
    }
    
    return <>{children}</>;
}


// Public Only Route (redirect to dashboard if logged in)
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  
  if (isAuthenticated && user) {
    // Redirect based on role if already authenticated
    const destination = ADMIN_ROLES.includes(user.userType as UserType) ? '/admin/dashboard' :
                        user.userType === 'attorney' ? '/attorney/dashboard' : '/dashboard';
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
      
      {/* 🎯 NEW: FIRS News Feed Page (Publicly accessible) */}
      <Route path="/firs-news-feed" element={<FirsNewsFeedPage />} /> 
      
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
      
      {/* Shared Settings Page */}
      <Route path="/profile/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* ----------------------------------------------------- */}
      {/* BOOKING & HIRE ROUTES (Protected) */}
      {/* ----------------------------------------------------- */}
      {/* Route for the Booking Form (used by the Hire Attorney button) */}
      <Route 
          path="/attorney/:id/hire" 
          element={<ProtectedRoute><BookingPage /></ProtectedRoute>} 
      />
      
      {/* Route for viewing a specific booking's details */}
      <Route 
          path="/bookings/:bookingId" 
          element={<ProtectedRoute><BookingDetailsPage/></ProtectedRoute>} 
      />
      
      {/* Route for viewing the user's list of all bookings */}
      <Route 
          path="/bookings/my-bookings" 
          element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} 
      />

      {/* ----------------------------------------------------- */}
      {/* ATTORNEY-SPECIFIC ROUTES (Role Guarded) */}
      {/* ----------------------------------------------------- */}
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

      {/* ----------------------------------------------------- */}
      {/* ADMIN-SPECIFIC ROUTES (Admin Protected) */}
      {/* ----------------------------------------------------- */}
      <Route 
        path="/admin/dashboard" 
        element={<AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute>} 
      />
      <Route 
        path="/admin/attorneys/verification" 
        element={<AdminProtectedRoute><AdminVerificationPage /></AdminProtectedRoute>} 
      />
      <Route 
        path="/admin/attorneys/:attorneyId/review" 
        element={<AdminProtectedRoute><AdminReviewPage /></AdminProtectedRoute>} 
      />
      <Route 
        path="/admin/payouts" 
        element={<AdminProtectedRoute><AdminPayoutsPage /></AdminProtectedRoute>} 
      />
      <Route 
        path="/admin/users" 
        element={<AdminProtectedRoute><AdminUsersPage /></AdminProtectedRoute>} 
      />
      <Route 
        path="/admin/audit" 
        element={<AdminProtectedRoute><AdminAuditPage /></AdminProtectedRoute>} 
      />


      {/* 404 - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;