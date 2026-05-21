import { useState } from 'react';
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
import { Header } from '@/components/layout';
import Footer from '@/components/layout/Footer';

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
    <div className="min-h-screen bg-white flex flex-col">
      <Header/>
      
      <div className="flex-1 flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">


              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Begin your
                <br />
                <span className="text-primary-600">journey</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600">
                Create your account and find the right tax attorney
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Core Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full name"
                  error={errors.fullName?.message}
                  {...registerField('fullName')}
                  placeholder="John Doe"
                />

                <Input
                  label="Email address"
                  type="email"
                  error={errors.email?.message}
                  {...registerField('email')}
                  placeholder="your.email@company.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Phone number"
                  type="tel"
                  error={errors.phoneNumber?.message}
                  {...registerField('phoneNumber')}
                  placeholder="+234 800 000 0000"
                />

                <Select
                  label="Account type"
                  options={userTypes}
                  error={errors.userType?.message}
                  {...registerField('userType')}
                />
              </div>

              {/* Conditional Attorney Fields */}
              {isAttorney && (
                <div className="space-y-6 border-t pt-6 border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">Attorney credentials</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Firm / Practice name"
                            error={errors.firmName?.message}
                            {...registerField('firmName')}
                            placeholder="Doe & Associates Law Firm"
                            leftIcon={<Briefcase className="w-5 h-5" />}
                        />
                        
                        <Input
                            label="Professional license number"
                            error={errors.professionalLicenseNumber?.message}
                            {...registerField('professionalLicenseNumber')}
                            placeholder="NBA/2020/12345"
                            leftIcon={<GraduationCap className="w-5 h-5" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Years of experience"
                            type="number"
                            error={errors.yearsOfExperience?.message} 
                            {...registerField('yearsOfExperience', { valueAsNumber: true })}
                            placeholder="e.g., 5"
                        />
                        <Input
                            label="Hourly rate (NGN)"
                            type="number"
                            error={errors.hourlyRate?.message}
                            {...registerField('hourlyRate', { valueAsNumber: true })}
                            placeholder="e.g., 50000"
                            leftIcon={<DollarSign className="w-5 h-5" />}
                        />
                    </div>
                </div>
              )}
              
              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={errors.password?.message}
                    {...registerField('password')}
                    placeholder="Minimum 8 characters"
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

              {/* Terms & Submit */}
              <div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...registerField('acceptTerms')}
                    className="mt-1 rounded border-gray-300"
                  />
                  <p className="text-sm text-gray-600">
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
                className="w-full bg-primary-600 hover:bg-primary-700 text-white group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isPending ? 'Creating account...' : 'Create account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
          <img 
            src="/public/images/BG.png"
            alt="Tax attorney services"
            className="w-full h-full object-cover opacity-90"
            onError={(e) => {
              // Fallback to gradient if image doesn't exist
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback gradient */}
          <div className="hidden absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-primary-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-12">
                <h2 className="text-4xl font-bold mb-4">Join Tax-FIT Today</h2>
                <p className="text-xl text-gray-200">Access Nigeria's top tax attorneys</p>
              </div>
            </div>
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Start your journey today
            </h2>
            <p className="text-lg text-gray-200">
              Join thousands using Tax-FIT to find the perfect tax attorney
            </p>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}