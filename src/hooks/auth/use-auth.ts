import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiClient, { getDeviceInfo } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import {
  RegisterInput,
  LoginInput,
  OtpVerificationInput,
  ResendOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from '@/lib/validations';
import {
  AuthResponse,
  LoginResponse,
  OtpResponse,
  ProfileResponse,
} from '@/types';

export const useRegister = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const { confirmPassword, phoneNumber, ...rest } = data;
      
      let formattedPhone = phoneNumber;
      if (phoneNumber.startsWith('0')) {
        formattedPhone = '+234' + phoneNumber.substring(1);
      } else if (!phoneNumber.startsWith('+')) {
        formattedPhone = '+234' + phoneNumber;
      }
      
      const registerData = {
        ...rest,
        phoneNumber: formattedPhone,
        acceptTerms: true
      };
      
      console.log('📤 Data being sent to API:', registerData);
      const response = await apiClient.post<AuthResponse>('/auth/register', registerData);
      console.log('✅ API Response - Register:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.requiresEmailVerification) {
        toast.success('Registration successful! Please verify your email.');
        navigate(`/verify-email?email=${encodeURIComponent(data.data.user.email)}`);
      } else {
        login(data.data.user, data.data.tokens);
        toast.success('Registration successful!');
        navigate('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error(' API Error - Register:', error);
      console.error(' Error Response:', error.response?.data);
      console.error(' Error Message:', error.message);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const loginData = {
        identifier: data.email,
        password: data.password,
      };
      
      console.log(' API Request - Login:', loginData);
      const response = await apiClient.post<LoginResponse>('/auth/login', loginData);
      console.log(' API Response - Login:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.data.user, data.data.tokens);
      toast.success('Login successful!');
      
      if (data.data.user.userType === 'attorney') {
        navigate('/attorney/dashboard');
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error: any) => {
      console.error(' API Error - Login:', error);
      console.error(' Error Response:', error.response?.data);
      console.error(' Error Message:', error.message);
    },
  });
};

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (data: OtpVerificationInput) => {
      const response = await apiClient.post<AuthResponse>('/auth/verify-email', data);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.data.user, data.data.tokens);
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async (data: ResendOtpInput) => {
      const response = await apiClient.post<OtpResponse>('/auth/resend-otp', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ForgotPasswordInput) => {
      const response = await apiClient.post<OtpResponse>('/auth/forgot-password', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/check-email');
    },
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: ResetPasswordInput) => {
      const response = await apiClient.post<OtpResponse>('/auth/reset-password', data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/login');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/');
    },
    onError: () => {
      logout();
      queryClient.clear();
      navigate('/');
    },
  });
};

export const useProfile = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get<ProfileResponse>('/auth/profile');
      return response.data.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
};