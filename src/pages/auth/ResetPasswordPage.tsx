import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useResetPassword } from '@/hooks/auth/use-auth';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { mutate: resetPassword, isPending, isError, error } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (token) {
      // Send the data in the correct format
      resetPassword(
        {
          token,
          newPassword: data.password,
          confirmPassword: data.confirmPassword,
        },
        {
          onSuccess: () => {
            setResetSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
              navigate('/login');
            }, 3000);
          },
        }
      );
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-4">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-6">This password reset link is invalid or has expired.</p>
          <Link 
            to="/forgot-password" 
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="min-h-screen flex items-center justify-center py-16">
            <div className="w-full max-w-md text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-extralight text-gray-900 tracking-tight mb-4">
                Password <span className="italic font-light text-primary-600">reset!</span>
              </h1>
              
              <p className="text-lg text-gray-600 font-light mb-8">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>

              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="min-h-screen flex items-center justify-center py-16">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-primary-500"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                  New Password
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 tracking-tight leading-tight">
                Create new
                <br />
                <span className="italic font-light text-primary-600">password</span>
              </h1>

              <p className="text-lg text-gray-600 font-light">
                Enter your new password below. Make sure it's at least 8 characters long.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <Input
                  label="New password"
                  type={showPassword ? 'text' : 'password'}
                  error={errors.password?.message}
                  {...register('password')}
                  placeholder="Minimum 8 characters"
                  className="font-light pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm new password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                  placeholder="Re-enter password"
                  className="font-light pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Error Message */}
              {isError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    {(error as any)?.response?.data?.message || 
                     'Failed to reset password. Please try again or request a new reset link.'}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full bg-secondary-900 hover:bg-secondary-800 text-white group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isPending ? 'Resetting password...' : 'Reset password'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}