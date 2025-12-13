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
          // Update the appropriate profile based on user type
          if (state.user?.userType === 'attorney' && state.attorney) {
            return { attorney: { ...state.attorney, ...profileData } };
          } else if (state.user?.userType === 'individual' && state.individualProfile) {
            return { individualProfile: { ...state.individualProfile, ...profileData } };
          } else if (state.user?.userType === 'business' && state.businessProfile) {
            return { businessProfile: { ...state.businessProfile, ...profileData } };
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