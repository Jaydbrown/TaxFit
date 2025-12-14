import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Eye, EyeOff, Briefcase, GraduationCap, DollarSign } from 'lucide-react';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Button from '@/components/common/Button';
import { useRegister } from '@/hooks/auth/use-auth';
import { registerSchema } from '@/lib/validations';

type RegisterFormData = z.infer<typeof registerSchema>;

const userTypes = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business/Company' },
  { value: 'attorney', label: 'Tax Attorney' },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: register, isPending } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
        userType: 'individual', 
    }
  });

  const selectedUserType = watch('userType'); 
  const isAttorney = selectedUserType === 'attorney';

  const onSubmit = (data: RegisterFormData) => {
    register(data);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        <div className="min-h-screen flex items-center justify-center py-16">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="mb-12 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-primary-500"></div>
                <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-light">
                  New Account
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-extralight text-gray-900 tracking-tight leading-tight">
                Begin your
                <br />
                <span className="italic font-light text-primary-600">journey</span>
              </h1>

              <p className="text-lg text-gray-600 font-light">
                Create your account and access world-class tax advisory services.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* --- Core Fields --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full name"
                  error={errors.fullName?.message}
                  {...registerField('fullName')}
                  placeholder="John Doe"
                  className="font-light"
                />

                <Input
                  label="Email address"
                  type="email"
                  error={errors.email?.message}
                  {...registerField('email')}
                  placeholder="your.email@company.com"
                  className="font-light"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone number"
                  type="tel"
                  error={errors.phoneNumber?.message}
                  {...registerField('phoneNumber')}
                  placeholder="+234 800 000 0000"
                  className="font-light"
                />

                <Select
                  label="Account type"
                  options={userTypes}
                  error={errors.userType?.message}
                  {...registerField('userType')}
                />
              </div>

              {/* --- Conditional Attorney Fields --- */}
              {isAttorney && (
                <div className="space-y-6 border-t pt-6 border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">Attorney Credentials</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Firm / Practice Name"
                            error={errors.firmName?.message}
                            {...registerField('firmName')}
                            placeholder="Doe & Associates Law Firm"
                            leftIcon={<Briefcase className="w-5 h-5" />}
                            className="font-light"
                        />
                        
                        <Input
                            label="Professional License Number"
                            error={errors.professionalLicenseNumber?.message}
                            {...registerField('professionalLicenseNumber')}
                            placeholder="NBA/2020/12345"
                            leftIcon={<GraduationCap className="w-5 h-5" />}
                            className="font-light"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Years of Experience"
                            type="number"
                            // FIX APPLIED HERE: Use optional chaining on the field property itself
                            error={errors.yearsOfExperience?.message} 
                            {...registerField('yearsOfExperience', { valueAsNumber: true })}
                            placeholder="e.g., 5"
                            className="font-light"
                        />
                        <Input
                            label="Hourly Rate (NGN)"
                            type="number"
                            // FIX APPLIED HERE: Use optional chaining on the field property itself
                            error={errors.hourlyRate?.message}
                            {...registerField('hourlyRate', { valueAsNumber: true })}
                            placeholder="e.g., 50000"
                            leftIcon={<DollarSign className="w-5 h-5" />}
                            className="font-light"
                        />
                    </div>
                </div>
              )}
              
              {/* --- Password Fields --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={errors.password?.message}
                    {...registerField('password')}
                    placeholder="Minimum 8 characters"
                    className="font-light"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    error={errors.confirmPassword?.message}
                    {...registerField('confirmPassword')}
                    placeholder="Re-enter password"
                    className="font-light"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* --- Terms & Submit --- */}
              <div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...registerField('acceptTerms')}
                    className="mt-1 rounded border-gray-300"
                  />
                  <p className="text-sm text-gray-600 font-light">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full bg-secondary-900 hover:bg-secondary-800 text-white group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isPending ? 'Creating account...' : 'Create account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 font-light">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
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