import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
})

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    try {
      const result = await login(data)

      if (result.success) {
        // Navigate to the intended page or admin dashboard for admins
        const user = result.data.user;
        if (user.role === 'admin' && from === '/') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Sign in to your account</h2>
            <p className="mt-2 text-gray-400">
              Or{' '}
              <Link to="/register" className="text-white hover:text-gray-300 font-medium">
                create a new account
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="bg-car-gray rounded-lg p-4 border border-car-light-gray">
          <h3 className="text-white font-medium mb-2">Demo Credentials:</h3>
          <div className="text-sm text-gray-400 space-y-1">
            <p><strong>Admin:</strong> admin@mseriesauto.com / admin123</p>
            <p><strong>Customer:</strong> user@example.com / user123</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-10 pr-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                  errors.email ? 'border-red-500' : 'border-car-light-gray'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-12 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                  errors.password ? 'border-red-500' : 'border-car-light-gray'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-white focus:ring-white border-car-light-gray rounded bg-car-gray"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="text-white hover:text-gray-300">
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Social login placeholder */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-car-light-gray" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-car-black text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button className="w-full inline-flex justify-center py-2 px-4 border border-car-light-gray rounded-md shadow-sm bg-car-gray text-sm font-medium text-white hover:bg-car-light-gray">
              Google
            </button>
            <button className="w-full inline-flex justify-center py-2 px-4 border border-car-light-gray rounded-md shadow-sm bg-car-gray text-sm font-medium text-white hover:bg-car-light-gray">
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
