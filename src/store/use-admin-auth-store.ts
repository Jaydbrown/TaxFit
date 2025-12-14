// src/store/use-admin-auth-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';

// Assuming you have these base types in your global types file or a dedicated admin-types file
import type { User, AuthTokens } from '@/types'; 

// Extended Interface for the Admin User
export interface AdminUser extends Omit<User,'userType'> {
    userType: 'admin' | 'fitadmin'; 
    adminRole?: 'super_admin' | 'reviewer' | 'support';
}

// Interface for the Store State
export interface AdminAuthStoreState {
    adminUser: AdminUser | null;
    adminTokens: AuthTokens | null;
    isAuthenticated: boolean;
    
    // Actions
    setAdminUser: (user: AdminUser | null) => void;
    setAdminTokens: (tokens: AuthTokens | null) => void;
    clearAdminSession: () => void;
}

const ADMIN_STORAGE_KEY = 'taxfit-admin-session';

/**
 * Zustand store for managing the Admin user session and authentication state.
 */
export const useAdminAuthStore = create<AdminAuthStoreState>()(
    persist(
        (set) => ({
            adminUser: null,
            adminTokens: null,
            isAuthenticated: false,

            setAdminUser: (user) => set({ adminUser: user, isAuthenticated: !!user }),
            
            setAdminTokens: (tokens) => set({ adminTokens: tokens, isAuthenticated: !!tokens }),

            clearAdminSession: () => {
                set({
                    adminUser: null,
                    adminTokens: null,
                    isAuthenticated: false,
                });
                toast.success('Admin session ended.');
            },
        }),
        {
            name: ADMIN_STORAGE_KEY,
            partialize: (state) => ({ 
                adminUser: state.adminUser, 
                adminTokens: state.adminTokens 
            }),
            // Use 'localStorage' as the default storage
        }
    )
);