import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import type { 
  RegisterInput, 
  LoginInput, 
  AuthResponse, 
  LoginResponse,
  ProfileUpdateInput,
  User,
  AttorneyProfile,
  IndividualProfile,
  BusinessProfile
} from '@/types';


interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

// Define the shape expected by setAuth (since LoginResponse data might have tokens instead of token)
type AuthStateData = {
    user: User;
    attorney?: AttorneyProfile;
    individualProfile?: IndividualProfile;
    businessProfile?: BusinessProfile;
    token: string;
};

type SuccessResponse = { success: boolean; message: string };

type AvatarResponse = { success: boolean; data: { url: string } };

type VerifyEmailInput = { email: string; otp: string; type: string };

type ChangePasswordInput = { 
  currentPassword: string; 
  newPassword: string;
  confirmPassword: string;
};

type ResetPasswordInput = { 
  token: string; 
  newPassword: string;
  confirmPassword: string;
};

export type ApiResetPasswordInput = { 
  token: string; 
  newPassword: string;
  confirmPassword: string;
};

type ResendOtpInput = { email: string; type: string };

// --- Main Hooks ---

export function useRegister() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation<AuthResponse, ApiError, RegisterInput>({
    mutationKey: ['register'],
    mutationFn: async (data) => {
      let formattedPhone = data.phoneNumber;
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+234' + formattedPhone.substring(1);
      }

      const registerData = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: formattedPhone,
        password: data.password,
        confirmPassword: data.confirmPassword,
        userType: data.userType,
        acceptTerms: data.acceptTerms,
        ...(data.userType === 'attorney' && {
          firmName: data.firmName,
          yearsOfExperience: data.yearsOfExperience,
          professionalLicenseNumber: data.professionalLicenseNumber,
        }),
        ...(data.userType === 'individual' && {
          employmentStatus: data.employmentStatus,
          occupation: data.occupation,
        }),
      };

      const response = await apiClient.post<AuthResponse>('/auth/register', registerData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        // Handle both 'token' (legacy) and 'tokens.accessToken' (modern) structures
        const token = data.data.token || data.data.tokens?.accessToken;
        
        if (token) {
          const { user, attorney, individualProfile, businessProfile } = data.data;
          
          setAuth({
            user,
            attorney,
            individualProfile,
            businessProfile,
            token,
          });
        }
        
        navigate(`/verify-email?email=${encodeURIComponent(data.data.user.email)}`, { replace: true });
      }
    },
  });
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, ApiError, LoginInput>({
    mutationKey: ['login'],
    mutationFn: async (data) => {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        identifier: data.email,
        password: data.password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      const authData = data.data;

      if (data.success && authData && (authData.token || authData.tokens?.accessToken)) {
        
        const token = authData.token || authData.tokens!.accessToken;
        const user = authData.user;
        
        // 1. Store state first
        setAuth({
          user,
          attorney: authData.attorney,
          individualProfile: authData.individualProfile,
          businessProfile: authData.businessProfile,
          token,
        } as AuthStateData);
        
        queryClient.invalidateQueries({ queryKey: ['profile', user.id] });

        // --- CORE REDIRECTION LOGIC (IMMEDIATE) ---
        
        // DEBUGGING: Check the final state
        console.log(`[AUTH] Login successful. User Type: ${user.userType}, Verified: ${user.isEmailVerified}`);

        if (!user.isEmailVerified) {
          // Priority 1: Email not verified
          const verifyUrl = `/verify-email?email=${encodeURIComponent(user.email)}`;
          navigate(verifyUrl, { replace: true });
        } else if (user.userType === 'attorney') {
          // Priority 2: Attorney Dashboard
          navigate('/attorney/dashboard', { replace: true }); 
        } else {
          // Priority 3: Default Dashboard (Individual/Business)
          const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
          const destination = redirectUrl || '/dashboard';
          navigate(destination, { replace: true });
        }
      }
    },
    onError: (error) => {
      console.error('❌ Login error:', error);
    },
  });
}

export function useProfile() {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      try {
        const response = await apiClient.get<AuthResponse>('/auth/profile');
        return response.data.data;
      } catch (error: any) {
        // Handle 404 - endpoint not implemented yet
        if (error.response?.status === 404) {
          // Removed: console.log('⚠️ Profile endpoint not available, using cached auth data');
          const authState = useAuthStore.getState();
          // Safely return the cached state if available, assuming the fetch failed due to 404, not auth issue.
          if (authState.user) {
              return {
                  user: authState.user,
                  attorney: authState.attorney,
                  individualProfile: authState.individualProfile,
                  businessProfile: authState.businessProfile,
              };
          }
          // If the profile endpoint truly failed, re-throw the error
          throw error;
        }
        throw error;
      }
    },
    enabled: !!userId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const { updateUser, updateProfile, user } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation<AuthResponse, ApiError, ProfileUpdateInput>({
    mutationKey: ['updateProfile'],
    mutationFn: async (data) => {
      const response = await apiClient.put<AuthResponse>('/auth/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        updateUser(data.data.user);
        
        const { attorney, individualProfile, businessProfile } = data.data;
        const profileData = attorney || individualProfile || businessProfile;
        
        if (profileData) {
          updateProfile(profileData);
        }

        if (userId) {
          queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        }
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 404) {
        console.error(' Profile update endpoint not available');
      }
    },
  });
}

export function useUploadAvatar() {
  const { updateUser } = useAuthStore();

  return useMutation<AvatarResponse, ApiError, File>({
    mutationKey: ['uploadAvatar'],
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<AvatarResponse>(
        '/users/avatar',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        updateUser({ avatarUrl: data.data.url });
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 404) {
        console.error(' Avatar upload endpoint not available');
      }
    },
  });
}

export function useVerifyEmail() {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, VerifyEmailInput>({
    mutationKey: ['verifyEmail'],
    mutationFn: async (data) => {
      const response = await apiClient.post<AuthResponse>('/auth/verify-email', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        updateUser({ isEmailVerified: true });
        queryClient.invalidateQueries({ queryKey: ['profile', data.data.user?.id] });
        navigate('/dashboard', { replace: true });
      }
    },
  });
}

export function useResendVerification() {
  return useMutation<SuccessResponse, ApiError, string>({
    mutationKey: ['resendVerification'],
    mutationFn: async (email) => {
      const response = await apiClient.post<SuccessResponse>('/auth/resend-verification', { email });
      return response.data;
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    logout();
    queryClient.clear();
    navigate('/', { replace: true });
  };
}

export function useChangePassword() {
  return useMutation<SuccessResponse, ApiError, ChangePasswordInput>({
    mutationKey: ['changePassword'],
    mutationFn: async (data) => {
      const response = await apiClient.post<SuccessResponse>('/auth/change-password', data);
      return response.data;
    },
  });
}

export function useUpdateSecuritySettings() {
  type SecuritySettingsInput = {
    twoFactorEnabled?: boolean;
    loginAlerts?: boolean;
    sessionTimeout?: number;
  };
  
  return useMutation<SuccessResponse, ApiError, SecuritySettingsInput>({
    mutationKey: ['updateSecuritySettings'],
    mutationFn: async (data) => {
      const response = await apiClient.put<SuccessResponse>('/users/security-settings', data);
      return response.data;
    },
  });
}

export function useDeleteAccount() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation<SuccessResponse, ApiError, string>({
    mutationKey: ['deleteAccount'],
    mutationFn: async (password) => {
      const response = await apiClient.delete<SuccessResponse>('/users/account', {
        data: { password },
      });
      return response.data;
    },
    onSuccess: () => {
      logout();
      navigate('/', { replace: true });
    },
  });
}

export function useUpdateNotificationSettings() {
  type NotificationSettingsInput = {
    emailAlerts?: boolean;
    smsAlerts?: boolean;
    pushNotifications?: boolean;
    expenseReminders?: boolean;
    taxDeadlines?: boolean;
    attorneyMessages?: boolean;
    loanUpdates?: boolean;
    marketingEmails?: boolean;
  };
  
  return useMutation<SuccessResponse, ApiError, NotificationSettingsInput>({
    mutationKey: ['updateNotificationSettings'],
    mutationFn: async (data) => {
      const response = await apiClient.put<SuccessResponse>('/users/notification-settings', data);
      return response.data;
    },
  });
}

export function useUpdatePreferences() {
  type PreferencesInput = {
    language?: string;
    timezone?: string;
    currency?: string;
    dateFormat?: string;
  };

  return useMutation<SuccessResponse, ApiError, PreferencesInput>({
    mutationKey: ['updatePreferences'],
    mutationFn: async (data) => {
      const response = await apiClient.put<SuccessResponse>('/users/preferences', data);
      return response.data;
    },
  });
}

export function useForgotPassword() {
  return useMutation<SuccessResponse, ApiError, string>({
    mutationKey: ['forgotPassword'],
    mutationFn: async (email) => {
      const response = await apiClient.post<SuccessResponse>('/auth/forgot-password', { email });
      return response.data;
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  // 🎯 FIX 2: Use the new, unambiguous ApiResetPasswordInput type
  return useMutation<SuccessResponse, ApiError, ApiResetPasswordInput>({
    mutationKey: ['resetPassword'],
    mutationFn: async (data) => {
      const response = await apiClient.post<SuccessResponse>('/auth/reset-password', data);
      return response.data;
    },
    onSuccess: () => {
      navigate('/login', { replace: true });
    },
  });
}

export function useResendOtp() {
  return useMutation<SuccessResponse, ApiError, ResendOtpInput>({
    mutationKey: ['resendOtp'],
    mutationFn: async (data) => {
      const response = await apiClient.post<SuccessResponse>('/auth/resend-otp', data);
      return response.data;
    },
  });
}