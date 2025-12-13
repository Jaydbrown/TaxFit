import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useForgotPassword } from '@/hooks/auth/use-auth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const { mutate: forgotPassword, isPending, isError, error } = useForgotPassword();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const emailValue = watch('email');

  const onSubmit = (data: ForgotPasswordFormData) => {
    // Send only the email string, not an object
    forgotPassword(data.email, {
      onSuccess: () => {
        setEmailSent(true);
      },
    });
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="min-h-screen flex items-center justify-center py-16">
            <div className="w-full max-w-md text-center">
              {/* Success Icon */}
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extralight text-gray-900 tracking-tight mb-4">
                  Check your <span className="italic font-light text-primary-600">email</span>
                </h1>
                
                <p className="text-lg text-gray-600 font-light mb-2">
                  We've sent password reset instructions to:
                </p>
                <p className="text-lg font-medium text-gray-900 mb-8">
                  {emailValue}
                </p>
                
                <div className="space-y-4 text-sm text-gray-600">
                  <p>Click the link in the email to reset your password.</p>
                  <p>If you don't see the email, check your spam folder.</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Link to="/login">
                  <Button className="w-full bg-secondary-900 hover:bg-secondary-800 text-white group">
                    <span className="flex items-center justify-center gap-2">
                      Back to login
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>

                <button
                  onClick={() => {
                    setEmailSent(false);
                  }}
                  className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Didn't receive the email? Try again
                </button>
              </div>
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
            {/* Back Link */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to login
            </Link>

            {/* Header */}
            <div className="mb-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-primary-500"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                  Password Recovery
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 tracking-tight leading-tight">
                Forgot your
                <br />
                <span className="italic font-light text-primary-600">password?</span>
              </h1>

              <p className="text-lg text-gray-600 font-light">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <Input
                  label="Email address"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                  placeholder="you@example.com"
                  className="font-light"
                  autoComplete="email"
                />
                <Mail className="absolute right-3 top-9 w-5 h-5 text-gray-400" />
              </div>

              {/* Error Message */}
              {isError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    {(error as any)?.response?.data?.message || 
                     'Failed to send reset email. Please try again.'}
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
                  {isPending ? 'Sending...' : 'Send reset instructions'}
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