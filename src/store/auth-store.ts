import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// Import only the types needed for the store state
import type { User, AttorneyProfile, IndividualProfile, BusinessProfile } from '@/types/index';
// 1. FIX: REMOVE the conflicting import: 'import { User } from "lucide-react";'

// Define the keys globally for consistency
const ACCESS_TOKEN_KEY = 'accessToken'; 
const REFRESH_TOKEN_KEY = 'refreshToken';

// 2. AuthState Interface remains correct (using nullable types)
interface AuthState {
  user: User | null;
  attorney: AttorneyProfile | null;
  individualProfile: IndividualProfile | null;
  businessProfile: BusinessProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (data: {
    user: User;
    attorney?: AttorneyProfile | null;
    individualProfile?: IndividualProfile | null;
    businessProfile?: BusinessProfile | null;
    token: string;
  }) => void;
  updateUser: (user: Partial<User>) => void;
  updateProfile: (profile: Partial<IndividualProfile | AttorneyProfile | BusinessProfile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 3. FIX: Initialize state properties correctly to null
      user: null, 
      attorney: null,
      individualProfile: null,
      businessProfile: null,
      token: null,
      isAuthenticated: false,

      setAuth: (data) => {
        // 4. FIX: Use the correct key for storing the token
        if (data.token) {
          localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
        }
        
        set({
          user: data.user,
          attorney: data.attorney ?? null,
          individualProfile: data.individualProfile ?? null,
          businessProfile: data.businessProfile ?? null,
          token: data.token,
          isAuthenticated: true,
        });
      },

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),

      updateProfile: (profileData) =>
        set((state) => {
          
          if (state.user?.userType === 'attorney') {
            // Check if currentProfile is null/undefined before merging
            const currentProfile = state.attorney || {};
            return { attorney: { ...currentProfile, ...profileData } as AttorneyProfile };
          
          } else if (state.user?.userType === 'individual') {
            const currentProfile = state.individualProfile || {};
            return { individualProfile: { ...currentProfile, ...profileData } as IndividualProfile };
            
          } else if (state.user?.userType === 'business') {
            const currentProfile = state.businessProfile || {};
            return { businessProfile: { ...currentProfile, ...profileData } as BusinessProfile };
          }
          
          return state;
        }),

      logout: () => {
        // 5. FIX: Clear both tokens using the correct keys
        localStorage.removeItem(ACCESS_TOKEN_KEY); 
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        
        set({
          user: null,
          attorney: null,
          individualProfile: null,
          businessProfile: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        attorney: state.attorney,
        individualProfile: state.individualProfile,
        businessProfile: state.businessProfile,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);