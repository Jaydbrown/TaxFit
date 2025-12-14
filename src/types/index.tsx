
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

// --- Profile Interfaces (Detailed) ---

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
  address?: string; // Consider using the Address interface here instead of string
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

// --- Auth and API Response Structure ---

// Defines the consistent payload structure for user data (used by AuthResponse/LoginResponse/ProfileResponse)
export interface AuthResponseData {
  user: User;
  attorney?: AttorneyProfile;
  individualProfile?: IndividualProfile;
  businessProfile?: BusinessProfile;
  token?: string; // Token might be top-level or nested depending on the endpoint
  tokens?: AuthTokens;
  requiresEmailVerification?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: AuthResponseData;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  // Login response guarantees a token
  data: Omit<AuthResponseData, 'token'> & { token: string }; 
}

export interface ProfileResponse {
  success: boolean;
  data: AuthResponseData;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

// --- Input Types ---

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


// --- Attorney Search Types ---

/**
 * Defines the combined data structure expected for a single attorney search result item.
 * It combines the User base data with the nested AttorneyProfile.
 */
export interface AttorneySearchResultItem extends User {
  attorneyProfile: AttorneyProfile; 
}

// Defines Attorney alias to point to the non-conflicting structure used in search results.
export type Attorney = AttorneySearchResultItem;


export interface AttorneySearchFilters {
  searchQuery?: string;
  specialization?: string;
  minExperience?: number;
  maxRate?: number;
  location?: string;
  rating?: number;
}

export interface AttorneySearchResult {
  // Uses the corrected 'Attorney' type
  attorneys: Attorney[]; 
  total: number;
  hasMore: boolean;
}

// --- Legacy/Misc Types ---

export type IUserType = UserType;

export interface ITaxBenefit {
  id: string;
  title: string;
  description: string;
  amount: number;
  category: string;
}