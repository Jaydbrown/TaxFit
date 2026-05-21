import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Eye, EyeOff, Shield } from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { loginSchema } from '@/lib/validations';
import Footer from '@/components/layout/Footer';
import { Header } from '@/components/layout';
import { useAdminLogin } from '@/hooks/auth/use-auth';

type AdminLoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: adminLogin, isPending } = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: AdminLoginFormData) => {
    adminLogin(data);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header/>
      
      <div className="flex-1 flex">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8 sm:mb-12 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-red-500"></div>
                <span className="text-xs text-red-600 font-semibold uppercase tracking-wider">
                  Admin access
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                    Admin
                    <br />
                    <span className="text-red-600">portal</span>
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-gray-600">
                Secure access for Tax-FIT administrators
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input
                  label="Admin email"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                  placeholder="admin@taxfit.com"
                />
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  error={errors.password?.message}
                  {...register('password')}
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full bg-red-600 hover:bg-red-700 text-white group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isPending ? 'Signing in...' : 'Sign in as admin'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            {/* Warning */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Admin access only.</strong> Unauthorized access attempts are logged and monitored.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Not an admin?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  User login
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
                Tax-FIT Admin Portal
              </h2>
              <p className="text-xl text-gray-200 mb-6">
                Manage users, attorneys, and platform operations
              </p>
              <div className="grid grid-cols-2 gap-4 text-left max-w-md mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold mb-1">2,500+</div>
                  <div className="text-sm text-gray-300">Attorneys</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-2xl font-bold mb-1">50K+</div>
                  <div className="text-sm text-gray-300">Users</div>
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