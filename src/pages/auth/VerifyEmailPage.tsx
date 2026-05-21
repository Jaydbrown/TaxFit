import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { otpVerificationSchema, type OtpVerificationInput } from '@/lib/validations';
import { useVerifyEmail, useResendOtp } from '@/hooks/auth/use-auth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpVerificationInput>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      email: email,
      otp: '',
      type: 'email_verification',
    },
  });

  const verifyEmailMutation = useVerifyEmail();
  const resendOtpMutation = useResendOtp();

  const onSubmit = (data: OtpVerificationInput) => {
    verifyEmailMutation.mutate(data);
  };

  const handleResend = () => {
    if (email) {
      resendOtpMutation.mutate({ email, type: 'email_verification' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="min-h-screen flex items-center justify-center py-16">
          <div className="w-full max-w-md">
            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            {/* Header */}
            <div className="mb-12 space-y-6 text-center">
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-primary-500"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                  Email Verification
                </span>
                <div className="h-px w-12 bg-primary-500"></div>
              </div>

              <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 tracking-tight leading-tight">
                Verify your
                <br />
                <span className="italic font-light text-primary-600">email</span>
              </h1>

              <p className="text-lg text-gray-600 font-light leading-relaxed">
                We've sent a verification code to
                <br />
                <span className="font-medium text-gray-900">{email}</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Hidden fields */}
              <input type="hidden" {...register('email')} value={email} />
              <input type="hidden" {...register('type')} value="email_verification" />

              {/* OTP Input */}
              <div>
                <Input
                  label="Enter 6-digit code"
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest font-light"
                  error={errors.otp?.message}
                  {...register('otp')}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-secondary-900 hover:bg-secondary-800 text-white group"
                disabled={verifyEmailMutation.isPending}
              >
                <span className="flex items-center justify-center gap-2">
                  {verifyEmailMutation.isPending ? 'Verifying...' : 'Verify Email'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            {/* Resend */}
            <div className="mt-8 p-6 bg-gray-50 border border-gray-200 text-center">
              <p className="text-sm text-gray-600 font-light mb-3">
                Didn't receive the code? Check your spam folder or request a new code.
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendOtpMutation.isPending}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
              >
                {resendOtpMutation.isPending ? 'Sending...' : 'Resend verification code'}
              </button>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-primary-600 font-light"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}