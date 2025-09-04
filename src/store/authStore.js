import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      
      // Login user
      login: (authData) => {
        set({
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
          isLoading: false
        })
        return { success: true }
      },
      
      // Register user
      register: async (userData) => {
        set({ isLoading: true })
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          })
          
          if (response.ok) {
            const data = await response.json()
            set({
              user: data.user,
              token: data.token,
              isAuthenticated: true,
              isLoading: false
            })
            return { success: true }
          } else {
            const error = await response.json()
            set({ isLoading: false })
            return { success: false, error: error.message }
          }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'Network error' }
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
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${get().token}`
            },
            body: JSON.stringify(userData),
          })
          
          if (response.ok) {
            const data = await response.json()
            set({
              user: data.user,
              isLoading: false
            })
            return { success: true }
          } else {
            const error = await response.json()
            set({ isLoading: false })
            return { success: false, error: error.message }
          }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'Network error' }
        }
      },
      
      // Check if user is authenticated
      checkAuth: async () => {
        const token = get().token
        if (!token) return false
        
        try {
          // TODO: Replace with actual API call to verify token
          const response = await fetch('/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            set({ user: data.user, isAuthenticated: true })
            return true
          } else {
            get().logout()
            return false
          }
        } catch (error) {
          get().logout()
          return false
        }
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
