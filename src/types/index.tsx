
export type UserType = 'individual' | 'attorney' | 'business'| 'admin';
export type EmploymentStatus = 'employed' | 'self-employed' | 'unemployed' | 'student' | 'retired';
export type ConsultationMode = 'In-Person' | 'Video Call' | 'Phone Call' | 'chat';
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
  verificationStatus?: 'draft' | 'pending' | 'approved' | 'rejected';
  bio?: string;
  location?: string;
  state?: string;
  rating?: number;
  totalCases?: number;
  successRate?: number;
  submittedForVerificationAt?: string;
  rejectionReason?: string;
  rejectionDetails?: string;
  professionalDocuments?: any[];
  education?: {
        institution: string;
        degree: string;
        year: number;
    }[];

    certifications?: {
        name: string;
        issuer: string;
        year: number;
    }[];
    totalReviews?: number; 
    averageRating?: number;
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
  bookingNumber: string;
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
  education?: {
        institution: string;
        degree: string;
        year: number;
    }[];

    certifications?: {
        name: string;
        issuer: string;
        year: number;
    }[];
}

export interface AttorneySearchResultItem extends User {
  attorneyProfile: AttorneyProfile; 
}

export type Attorney = AttorneySearchResultItem;


export interface AttorneySearchFilters {
  searchQuery?: string;
  specialization?: string;
  minExperience?: number;
  maxRate?: number;
  location?: string;
  rating?: number;
  page: number;
  limit: number;
}

export interface AttorneySearchResult {
  attorneys: Attorney[]; 
  total: number;
  hasMore: boolean;
  limit: number;
}

export interface PayoutRequest {
  payoutId: string;
  attorneyId: string;
  attorneyName: string;
  amount: number;
  status: 'pending' | 'processed' | 'failed';
  requestedAt: string;
  processorRef?: string;
}

export interface PayoutListResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  payouts: PayoutRequest[];
}

// Query filter interface for Payouts
export interface PayoutFilters {
  status?: 'pending' | 'processed' | 'failed' | 'all';
  page: number;
  limit: number;
  search?: string;
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

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: string[] | { [key: string]: string }; // Optional field for validation errors
}


export interface ApiError extends Error {
    response?: {
        data: ApiErrorResponse;
        status: number;
        statusText: string;
    };
    // Include other Axios error properties like code, config, etc., if needed
    isAxiosError: boolean;
    name: string;
    message: string;
}

// src/types/index.ts (Conceptual content for your main type file)

// --- Standard Response Structures ---

/**
 * Interface for standard API errors.
 */
export interface ApiError {
    message: string;
    status: number;
    details?: string | Record<string, any>;
}

/**
 * Generic Interface for standard pagination metadata.
 */
export interface PaginatedResponse {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}

/**
 * The standard, generic API response wrapper for non-authentication endpoints.
 * T is the type of the data payload contained within the 'data' field.
 * * This should replace the incorrect extension of 'AuthResponse' in your hooks.
 */
export interface ApiResponse<T> {
    message: string;
    status: number;
    data: T;
}



// --- Specific Data Payloads ---

// You would need to define all the specific data types here, for example:
// export type ConsultationMode = 'In-Person' | 'Video Call' | 'Phone Call';
// export interface User { /* ... fields ... */ }
// export interface Booking { /* ... fields ... */ }
// export interface Expense { /* ... fields ... */ }

// --- Example of how the Auth Response should be structured (to avoid inheritance issues) ---

// export interface AuthResponseData { 
//     user: User; 
//     token: string;
//     bookingNumber?: string; // Should be optional if sometimes included
// }
// export interface AuthResponse extends ApiResponse<AuthResponseData> {} 

// --- END OF TYPES FILE ---