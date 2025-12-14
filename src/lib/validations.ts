import { z } from 'zod';

// --- Shared Schemas ---

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@$!%*?&#]/, 'Password must contain at least one special character (@$!%*?&#)');

// Email validation
export const emailSchema = z.string().email('Invalid email address');

// Phone validation 
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required');

// User type enum
export const userTypeEnum = z.enum(['individual', 'business', 'attorney']);

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().default('Nigeria'),
  postalCode: z.string().optional(),
});

// --- Main Schema ---

// Registration schema with CONDITIONAL VALIDATION using .superRefine()
export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: emailSchema,
  phoneNumber: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  userType: userTypeEnum,
  referralCode: z.string().optional(),
  acceptTerms: z.boolean().optional().default(true),
  
  // NOTE: These fields must be .optional() at the root so they are NOT required for 'individual' or 'business' users.
  firmName: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  professionalLicenseNumber: z.string().optional(),
  hourlyRate: z.number().optional(),
}).superRefine((data, ctx) => {
  // 1. Check Password Match
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
  }

  // 2. Conditional Attorney Field Requirements
  if (data.userType === 'attorney') {
    if (!data.firmName || data.firmName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Firm name is required for attorneys.",
        path: ['firmName'],
      });
    }

    if (!data.professionalLicenseNumber || data.professionalLicenseNumber.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Professional License Number is required for attorneys.",
        path: ['professionalLicenseNumber'],
      });
    }
    
    // Check if yearsOfExperience is present and a valid number (handles empty input resulting in NaN)
    if (typeof data.yearsOfExperience !== 'number' || data.yearsOfExperience < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Years of Experience must be a positive number.",
        path: ['yearsOfExperience'],
      });
    }
    
    // Check if hourlyRate is present and a valid number
    if (typeof data.hourlyRate !== 'number' || data.hourlyRate < 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Hourly Rate must be a positive number.",
        path: ['hourlyRate'],
      });
    }
  }
});

// --- Other Schemas ---

// Login schema
export const loginSchema = z.object({
  email: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

// OTP verification schema
export const otpVerificationSchema = z.object({
  email: emailSchema,
  otp: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['email_verification', 'phone_verification', 'password_reset']),
});

// Resend OTP schema
export const resendOtpSchema = z.object({
  email: emailSchema,
  type: z.enum(['email_verification', 'phone_verification', 'password_reset']),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ['confirmNewPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ['newPassword'],
});

// Profile update schema
export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  phoneNumber: phoneSchema.optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  address: addressSchema.optional(),
  preferences: z.object({
    taxKnowledgeLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    notifications: z.object({
      email: z.boolean().default(true),
      sms: z.boolean().default(true),
      push: z.boolean().default(true),
    }).optional(),
    language: z.string().default('en'),
    currency: z.string().default('NGN'),
  }).optional(),
});

// Attorney search schema
export const attorneySearchSchema = z.object({
  searchQuery: z.string().optional(),
  specialization: z.string().optional(),
  minExperience: z.number().optional(),
  maxRate: z.number().optional(),
  location: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
});

// Attorney profile schema
export const attorneyProfileSchema = z.object({
  firmName: z.string().min(2, 'Firm name is required'),
  yearsOfExperience: z.number().min(0, 'Years of experience must be positive'),
  professionalLicenseNumber: z.string().min(1, 'License number is required'),
  hourlyRate: z.number().min(0, 'Hourly rate must be positive').optional(),
  specializations: z.array(z.string()).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});


// --- Export types ---
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AttorneySearchInput = z.infer<typeof attorneySearchSchema>;
export type AttorneyProfileInput = z.infer<typeof attorneyProfileSchema>;