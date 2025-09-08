import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Login user
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.login(credentials)

          if (response.success) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false
            })
            toast.success('Login successful!')
            return { success: true, data: response.data }
          } else {
            set({ isLoading: false })
            toast.error(response.message || 'Login failed')
            return { success: false, error: response.message }
          }
        } catch (error) {
          set({ isLoading: false })
          const errorMessage = error.response?.data?.message || 'Network error'
          toast.error(errorMessage)
          return { success: false, error: errorMessage }
        }
      },
      
      // Register user
      register: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.register(userData)

          if (response.success) {
            set({
              user: response.data.user,
              token: response.data.token,
              isAuthenticated: true,
              isLoading: false
            })
            toast.success('Registration successful!')
            return { success: true, data: response.data }
          } else {
            set({ isLoading: false })
            toast.error(response.message || 'Registration failed')
            return { success: false, error: response.message }
          }
        } catch (error) {
          set({ isLoading: false })
          const errorMessage = error.response?.data?.message || 'Network error'
          toast.error(errorMessage)
          return { success: false, error: errorMessage }
        }
      },
      
      // Logout user
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },
      
      // Update user profile
      updateProfile: async (userData) => {
        set({ isLoading: true })
        try {
          const response = await authAPI.updateProfile(userData)

          if (response.success) {
            set({
              user: response.data.user,
              isLoading: false
            })
            toast.success('Profile updated successfully!')
            return { success: true, data: response.data }
          } else {
            set({ isLoading: false })
            toast.error(response.message || 'Update failed')
            return { success: false, error: response.message }
          }
        } catch (error) {
          set({ isLoading: false })
          const errorMessage = error.response?.data?.message || 'Network error'
          toast.error(errorMessage)
          return { success: false, error: errorMessage }
        }
      },
      
      // Check if user is authenticated
      checkAuth: async () => {
        const token = get().token
        if (!token) return false

        try {
          const response = await authAPI.verifyToken()

          if (response.success) {
            set({ user: response.data.user, isAuthenticated: true })
            return true
          } else {
            get().logout()
            return false
          }
        } catch (error) {
          get().logout()
          return false
        }
      },

      // Check if user is admin
      isAdmin: () => {
        const user = get().user
        return user && user.role === 'admin'
      },

      // Get user role
      getUserRole: () => {
        const user = get().user
        return user ? user.role : null
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)

export default useAuthStore
