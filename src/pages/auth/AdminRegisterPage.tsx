import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Header } from '@/components/layout';
import Footer from '@/components/layout/Footer';
import { useAdminRegister } from '@/hooks/auth/use-auth';
import { toast } from 'react-hot-toast';

interface AdminRegisterFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  adminCode: string;
}

export default function AdminRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: adminRegister, isPending } = useAdminRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminRegisterFormData>();

  const password = watch('password');

  const onSubmit = (data: AdminRegisterFormData) => {
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Pass data without adminCode
    adminRegister({
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      confirmPassword: data.confirmPassword,
      // adminCode removed
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header/>
      
      <div className="flex-1 flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-red-500"></div>
                <span className="text-xs text-red-600 font-semibold uppercase tracking-wider">
                  Admin registration
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                    Create admin
                    <br />
                    <span className="text-red-600">account</span>
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-gray-600">
                Register as a Tax-FIT administrator
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full name"
                {...register('fullName', { required: 'Full name is required' })}
                error={errors.fullName?.message}
                placeholder="John Doe"
              />

              <Input
                label="Admin email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                error={errors.email?.message}
                placeholder="admin@taxfit.com"
              />

              <Input
                label="Phone number"
                type="tel"
                {...register('phoneNumber', { required: 'Phone number is required' })}
                error={errors.phoneNumber?.message}
                placeholder="+234 800 000 0000"
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  error={errors.password?.message}
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
                  {...register('confirmPassword', { 
                    required: 'Please confirm password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  error={errors.confirmPassword?.message}
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

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isPending ? 'Creating account...' : 'Create admin account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            {/* Warning */}
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                <strong>⚠️ Admin accounts have elevated privileges.</strong> Only create accounts for authorized Tax-FIT staff.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Already have an admin account?{' '}
                <Link
                  to="/admin/login"
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-red-900 via-red-800 to-gray-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          {/* Content Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-center text-white">
              <Shield className="w-24 h-24 mx-auto mb-6 text-red-300" />
              <h2 className="text-4xl font-bold mb-4">
                Join the admin team
              </h2>
              <p className="text-xl text-gray-200 mb-8">
                Help manage Nigeria's leading tax attorney platform
              </p>
              <div className="text-left max-w-md mx-auto space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Manage attorneys</div>
                    <div className="text-sm text-gray-300">Review and verify attorney applications</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">User oversight</div>
                    <div className="text-sm text-gray-300">Monitor and support platform users</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Financial control</div>
                    <div className="text-sm text-gray-300">Process payouts and track transactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}