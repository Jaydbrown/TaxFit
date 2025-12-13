// User types - consolidated from types/user.ts
export type UserType = 'individual' | 'attorney' | 'business';
export type EmploymentStatus = 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  userType: UserType;
  isEmailVerified: boolean;
  isPremium: boolean;
  avatarUrl?: string | null;
  referralCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
}

export interface AttorneyProfile {
  firmName: string;
  yearsOfExperience: number;
  hourlyRate: number;
  specializations?: string[];
  professionalLicenseNumber?: string;
  bio?: string;
  location?: string;
  state?: string;
  rating?: number;
  totalCases?: number;
  successRate?: number;
}

export interface IndividualProfile {
  employmentStatus: EmploymentStatus;
  occupation: string;
  dateOfBirth?: string;
  address?: string;
  taxId?: string;
}

export interface BusinessProfile {
  businessName: string;
  registrationNumber: string;
  businessType: string;
  industry: string;
  annualRevenue?: number;
  numberOfEmployees?: number;
}

export interface Attorney extends User {
  attorney: AttorneyProfile;
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    attorney?: AttorneyProfile;
    individualProfile?: IndividualProfile;
    businessProfile?: BusinessProfile;
    token?: string;
    tokens?: AuthTokens;
    requiresEmailVerification?: boolean;
  };
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    attorney?: AttorneyProfile;
    individualProfile?: IndividualProfile;
    businessProfile?: BusinessProfile;
    token: string;
    tokens?: AuthTokens;
  };
}

export interface RegisterInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  userType: UserType;
  acceptTerms: boolean;
  referralCode?: string;
  // Attorney-specific fields
  firmName?: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
  professionalLicenseNumber?: string;
  // Individual-specific fields
  employmentStatus?: EmploymentStatus;
  occupation?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ProfileUpdateInput {
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  // Individual-specific
  employmentStatus?: EmploymentStatus;
  occupation?: string;
  dateOfBirth?: string;
  address?: string;
  taxId?: string;
  // Attorney-specific
  firmName?: string;
  yearsOfExperience?: number;
  hourlyRate?: number;
  bio?: string;
  specializations?: string[];
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
    attorney?: AttorneyProfile;
    individualProfile?: IndividualProfile;
    businessProfile?: BusinessProfile;
  };
}

// Attorney Search types
export interface AttorneySearchFilters {
  searchQuery?: string;
  specialization?: string;
  minExperience?: number;
  maxRate?: number;
  location?: string;
  rating?: number;
}

export interface AttorneySearchResult {
  attorneys: Attorney[];
  total: number;
  hasMore: boolean;
}

// Legacy type aliases for backward compatibility
export type IUserType = UserType;
export interface ITaxBenefit {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
}

export interface AttorneyProfile {
  firmName: string;
  yearsOfExperience: number;
  hourlyRate: number;
  specializations?: string[];
  professionalLicenseNumber?: string;
}
export interface Attorney extends User {
  attorney: AttorneyProfile;
}


export interface AttorneySearchFilters {
  searchQuery?: string;
  specialization?: string;
  minExperience?: number;
  maxRate?: number;
  location?: string;
}
export interface AttorneySearchResult {
  attorneys: Attorney[];
  total: number;
  hasMore: boolean;
}
