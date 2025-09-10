import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const schema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().optional(),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  acceptTerms: yup.boolean().oneOf([true], 'You must accept the terms and conditions')
})

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data) => {
    try {
      const result = await registerUser(data)

      if (result.success) {
        toast.success('Registration successful!')
        navigate('/login')
      }
    } catch (error) {
      console.error('Registration error:', error)
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
            <h2 className="text-3xl font-bold text-white">Create your account</h2>
            <p className="mt-2 text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-gray-300 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('firstName')}
                  type="text"
                  className={`w-full pl-10 pr-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                    errors.firstName ? 'border-red-500' : 'border-car-light-gray'
                  }`}
                  placeholder="First name"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('lastName')}
                  type="text"
                  className={`w-full pl-10 pr-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                    errors.lastName ? 'border-red-500' : 'border-car-light-gray'
                  }`}
                  placeholder="Last name"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

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

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Phone Number <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('phone')}
                type="tel"
                className={`w-full pl-10 pr-4 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                  errors.phone ? 'border-red-500' : 'border-car-light-gray'
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
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
                placeholder="Create a password"
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-12 py-3 bg-car-gray border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white ${
                  errors.confirmPassword ? 'border-red-500' : 'border-car-light-gray'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-center">
              <input
                {...register('acceptTerms')}
                id="accept-terms"
                type="checkbox"
                className="h-4 w-4 text-white focus:ring-white border-car-light-gray rounded bg-car-gray"
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-400">
                I agree to the{' '}
                <Link to="/terms" className="text-white hover:text-gray-300">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-white hover:text-gray-300">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-500">{errors.acceptTerms.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
