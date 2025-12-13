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
  Attorney,
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

type ResendOtpInput = { email: string; type: string };

// --- Main Hooks ---

export function useRegister() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation<AuthResponse, ApiError, RegisterInput>({
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
          hourlyRate: data.hourlyRate,
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
        if (data.data.token) {
          setAuth(data.data as {
            user: User,
            attorney?: Attorney,
            individualProfile?: IndividualProfile,
            businessProfile?: BusinessProfile,
            token: string,
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
    mutationFn: async (data) => {
      const loginData = {
        identifier: data.email,
        password: data.password,
      };

      const response = await apiClient.post<LoginResponse>('/auth/login', loginData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data && data.data.token) {
        setAuth(data.data as {
            user: User,
            attorney?: Attorney,
            individualProfile?: IndividualProfile,
            businessProfile?: BusinessProfile,
            token: string,
        });
        queryClient.invalidateQueries({ queryKey: ['profile', data.data.user.id] });

        if (!data.data.user.isEmailVerified) {
          navigate(`/verify-email?email=${encodeURIComponent(data.data.user.email)}`, { replace: true });
        } else {
          const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
          navigate(redirectUrl || '/dashboard', { replace: true });
        }
      }
    },
  });
}

export function useProfile() {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const response = await apiClient.get<AuthResponse>('/users/profile');
      return response.data.data;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const { updateUser, updateProfile, user } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = user?.id;

  return useMutation<AuthResponse, ApiError, ProfileUpdateInput>({
    mutationFn: async (data) => {
      const response = await apiClient.put<AuthResponse>('/users/profile', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        updateUser(data.data.user);
        
        const profileData = data.data.attorney || data.data.individualProfile || data.data.businessProfile;
        if (profileData) {
          updateProfile(profileData as Attorney | IndividualProfile | BusinessProfile);
        }

        if (userId) {
          queryClient.invalidateQueries({ queryKey: ['profile', userId] });
        }
      }
    },
  });
}

export function useUploadAvatar() {
  const { updateUser } = useAuthStore();

  return useMutation<AvatarResponse, ApiError, File>({
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
  });
}

export function useVerifyEmail() {
  const navigate = useNavigate();
  const { updateEmailVerifiedStatus } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, VerifyEmailInput>({
    mutationFn: async (data) => {
      const response = await apiClient.post<AuthResponse>('/auth/verify-email', data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success && data.data) {
        updateEmailVerifiedStatus(true);
        queryClient.invalidateQueries({ queryKey: ['profile', data.data.user?.id] });
        navigate('/dashboard', { replace: true });
      }
    },
  });
}

export function useResendVerification() {
  return useMutation<SuccessResponse, ApiError, string>({
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
    mutationFn: async (data) => {
      const response = await apiClient.put<SuccessResponse>('/users/preferences', data);
      return response.data;
    },
  });
}

export function useForgotPassword() {
  return useMutation<SuccessResponse, ApiError, string>({
    mutationFn: async (email) => {
      const response = await apiClient.post<SuccessResponse>('/auth/forgot-password', { email });
      return response.data;
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation<SuccessResponse, ApiError, ResetPasswordInput>({
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
    mutationFn: async (data) => {
      const response = await apiClient.post<SuccessResponse>('/auth/resend-otp', data);
      return response.data;
    },
  });
}