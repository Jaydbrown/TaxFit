// src/types/admin.ts (New file for Admin-specific types)

import type { User, AuthTokens } from './index'; // Assuming these base types exist

// --- Admin User Types ---
export interface AdminUser extends Omit<User, 'userType'> {
    userType: 'admin' | 'fitadmin'; // Ensure the user type is correctly narrowed
    adminRole?: 'super_admin' | 'reviewer' | 'support';
}

export interface AdminAuthStoreState {
    adminUser: AdminUser | null;
    adminTokens: AuthTokens | null;
    isAuthenticated: boolean;
    setAdminUser: (user: AdminUser | null) => void;
    setAdminTokens: (tokens: AuthTokens | null) => void;
    clearAdminSession: () => void;
}

// --- Attorney Verification Types ---
// Data structure for the attorney returned in the verification list
export interface AdminVerificationAttorneyListItem {
  _id: string; // Attorney Profile ID
  user: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  firmName: string;
  verificationStatus: 'pending' | 'approved' | 'rejected' | 'draft';
  submittedForVerificationAt: string;
  isVerifiedAttorney: boolean;
  hourlyRate: number;
  yearsOfExperience: number;
}

// Data structure for the attorney returned in the detail page
export interface AdminVerificationAttorneyDetails extends AdminVerificationAttorneyListItem {
    professionalDocuments: Array<{
        documentType: string;
        documentUrl: string;
        uploadedAt: string;
        verified?: boolean; // Based on PUT endpoint success response, assume verification status
    }>;
    rejectionReason?: string;
    rejectionDetails?: string;
}

// GET /api/v1/admin/attorneys/verification - Query Parameters
export interface AdminVerificationFilters {
  status?: 'all' | 'pending' | 'approved' | 'rejected'; // Corrected statuses based on usage
  page: number;
  limit: number;
  search?: string;
  sortBy?: 'submittedAt' | 'name' | 'experience' | 'status';
  sortOrder?: 'asc' | 'desc';
}

// GET /api/v1/admin/attorneys/verification - Response Data
export interface AdminVerificationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  attorneys: AdminVerificationAttorneyListItem[];
}

// PUT /api/v1/admin/attorneys/{attorneyId}/verification/review - Payload
export interface ReviewVerificationPayload {
    status: 'approved' | 'rejected';
    adminNotes?: string;
    rejectionReason?: string; // Kept as string for simplicity, can be enum if needed
    rejectionDetails?: string;
}

export interface AuditLog {
  logId: string;
  actorId: string; // User or Admin ID who performed the action
  action: string; // e.g., 'ATTORNEY_APPROVED', 'LOGIN_FAILED', 'USER_DELETED'
  resourceType: string; // e.g., 'Attorney', 'User', 'Payout'
  resourceId: string;
  ipAddress: string;
  timestamp: string;
}

export interface AuditLogResult {
  total: number;
  page: number;
  limit: number;
  logs: AuditLog[];
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

export interface AdminUserListItem extends User {
  // Add specific profile data if needed, but primarily used for list view:
  isPremium: boolean;
  lastLogin?: string;
  createdAt: string; // Ensure this is available for the 'Joined' column
}

export interface UserListResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  users: AdminUserListItem[];
}

export interface UserFilters {
  userType?: 'individual' | 'attorney' | 'business' | 'all';
  isPremium?: 'true' | 'false' | 'all';
  page: number;
  limit: number;
  search?: string;
}