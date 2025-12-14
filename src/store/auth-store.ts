import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AttorneyProfile, IndividualProfile, BusinessProfile } from '@/types/index';

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
    attorney?: AttorneyProfile;
    individualProfile?: IndividualProfile;
    businessProfile?: BusinessProfile;
    token: string;
  }) => void;
  updateUser: (user: Partial<User>) => void;
  updateProfile: (profile: Partial<IndividualProfile | AttorneyProfile | BusinessProfile>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      attorney: null,
      individualProfile: null,
      businessProfile: null,
      token: null,
      isAuthenticated: false,

      setAuth: (data) => {
        // Store token in localStorage for API client
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        
        set({
          user: data.user,
          attorney: data.attorney || null,
          individualProfile: data.individualProfile || null,
          businessProfile: data.businessProfile || null,
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
          // --- FIX: Robust Profile Update ---
          // Ensure the profile object exists (initialize with {} if null) 
          // before merging partial updates. This prevents crashes if the profile 
          // data wasn't returned in the initial login/register response.
          
          if (state.user?.userType === 'attorney') {
            const currentProfile = state.attorney || {};
            // Use type assertion to satisfy the store state definition
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
        localStorage.removeItem('token');
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
      getStorage: () => localStorage,
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