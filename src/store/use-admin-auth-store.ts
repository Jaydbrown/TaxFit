// src/store/use-admin-auth-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminAuthStoreState, AdminUser, AuthTokens } from '@/types/admin-types';
import { toast } from 'react-hot-toast';

const ADMIN_STORAGE_KEY = 'taxfit-admin-session';

export const useAdminAuthStore = create<AdminAuthStoreState>()(
    persist(
        (set, get) => ({
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
            // Only persist tokens and user data, computed 'isAuthenticated' is set in 'set' function
            partialize: (state) => ({ 
                adminUser: state.adminUser, 
                adminTokens: state.adminTokens 
            }),
        }
    )
);