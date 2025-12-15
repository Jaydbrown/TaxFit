// src/components/auth/ResetPasswordForm.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock } from 'lucide-react';
// CRITICAL: Ensure ResetPasswordInput is defined correctly in '@/lib/validations'
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations'; 
import { useResetPassword } from '@/hooks/auth/use-auth';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
// 🎯 FIX 1: Import the precise API type from the hook file (or shared types)
// Assuming useResetPassword is in a file that also exports the ApiResetPasswordInput type
import type { ApiResetPasswordInput } from '@/hooks/auth/use-auth'; 


interface ResetPasswordFormProps {
  token: string;
}

// 🎯 FormData correctly represents the actual input fields (use for react-hook-form)
interface FormData {
    token: string;
    password: string; // Form field name (matches input name)
    confirmPassword: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ 
    resolver: zodResolver(resetPasswordSchema), 
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const resetPasswordMutation = useResetPassword();
  const password = watch('password');

  // 🎯 FINAL FIX: Use the explicit ApiResetPasswordInput type for casting
  const onSubmit = (data: FormData) => {
    
    // 1. Create the raw payload object with the required API key 'newPassword'.
    const payload = {
        token: data.token,
        newPassword: data.password, // Mapping form's 'password' field
        confirmPassword: data.confirmPassword,
    };

    // 2. Use double assertion (as unknown as T) with the PRECISE API type.
    // This asserts that the mapped object now matches the mutation function's argument type,
    // resolving the persistent TS2345 error.
    resetPasswordMutation.mutate(payload as unknown as ApiResetPasswordInput);
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[@$!%*?&#]/.test(pwd)) strength++;

    if (strength <= 2) return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 4) return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-600">
          Enter your new password below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            label="New Password"
            type="password"
            placeholder="Create a strong password"
            leftIcon={<Lock className="w-5 h-5" />}
            error={errors.password?.message}
            {...register('password')}
          />
          
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Password strength:</span>
                <span className={`text-xs font-medium ${
                  passwordStrength.strength === 33 ? 'text-red-600' :
                  passwordStrength.strength === 66 ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Re-enter your password"
          leftIcon={<Lock className="w-5 h-5" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Password requirements:</strong>
          </p>
          <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
            <li>At least 8 characters long</li>
            <li>Contains uppercase and lowercase letters</li>
            <li>Contains at least one number</li>
            <li>Contains at least one special character (@$!%*?&#)</li>
          </ul>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={resetPasswordMutation.isPending}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
}