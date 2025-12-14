// src/types/admin-types.ts

import type { User, AuthTokens } from './index'; // Assuming base types like User and AuthTokens exist here

/**
 * Interface for the specific properties of an Admin/FitAdmin user, extending the base User.
 */
export interface AdminUser extends User {
    // Admins might have a specific role or access level property
    userType: 'admin' | 'fitadmin'; 
    adminRole?: 'super_admin' | 'reviewer' | 'support';
}

/**
 * The structure of the Admin Authentication Store state.
 */
export interface AdminAuthStoreState {
    adminUser: AdminUser | null;
    adminTokens: AuthTokens | null;
    isAuthenticated: boolean;
    
    // Actions
    setAdminUser: (user: AdminUser | null) => void;
    setAdminTokens: (tokens: AuthTokens | null) => void;
    clearAdminSession: () => void;
}