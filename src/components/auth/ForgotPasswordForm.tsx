import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations';
import { useForgotPassword } from '@/hooks/auth/use-auth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordMutation = useForgotPassword();

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPasswordMutation.mutate(data.email);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
        <p className="text-gray-600">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          placeholder="john.doe@example.com"
          leftIcon={<Mail className="w-5 h-5" />}
          error={errors.email?.message}
          helperText="Enter the email address associated with your account"
          {...register('email')}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={forgotPasswordMutation.isPending}
        >
          Send Reset Link
        </Button>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors inline-flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
}