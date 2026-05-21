import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useLogin } from '@/hooks/auth/use-auth';
import { loginSchema, type LoginInput } from '@/lib/validations';
import Footer from '@/components/layout/Footer';
import { Header } from '@/components/layout';

type LoginFormData = LoginInput;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
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

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Welcome
                <br />
                <span className="text-primary-600">back</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Input
                  label="Email address"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                  placeholder="your.email@company.com"
                />
              </div>

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  error={errors.password?.message}
                  {...register('password')}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white group"
              >
                <span className="flex items-center justify-center gap-2">
                  {isPending ? 'Signing in...' : 'Sign in'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
          <img 
            src="/public/images/Frame.png"
            alt="Tax attorney consultation"
            className="w-full h-full object-cover opacity-90"
            onError={(e) => {
              // Fallback to gradient if image doesn't exist
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          {/* Fallback gradient */}
          <div className="hidden absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-12">
                <h2 className="text-4xl font-bold mb-4">Welcome to Tax-FIT</h2>
                <p className="text-xl text-gray-200">Your trusted tax attorney platform</p>
              </div>
            </div>
          </div>
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-12 left-12 right-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Professional tax guidance
            </h2>
            <p className="text-lg text-gray-200">
              Connect with verified tax attorneys across Nigeria
            </p>
          </div>
        </div>
      </div>
      
      <Footer/>
    </div>
  );
}