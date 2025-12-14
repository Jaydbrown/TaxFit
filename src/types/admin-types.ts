import type { User, AuthTokens } from './index'; 

export interface AdminUser extends Omit<User,'userType'>  {
    userType: 'admin' | 'fitadmin'; 
    adminRole?: 'super_admin' | 'reviewer' | 'support';
}

export interface AdminAuthStoreState {
    adminUser: AdminUser | null;
    adminTokens: AuthTokens | null;
    isAuthenticated: boolean;
    
    setAdminUser: (user: AdminUser | null) => void;
    setAdminTokens: (tokens: AuthTokens | null) => void;
    clearAdminSession: () => void;
}