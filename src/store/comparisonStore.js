import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useComparisonStore = create(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 4, // Maximum items to compare
      
      // Add item to comparison
      addItem: (product) => {
        const items = get().items
        const maxItems = get().maxItems
        const existingItem = items.find(item => item.id === product.id)
        
        if (existingItem) {
          return { success: false, message: 'Item already in comparison' }
        }
        
        if (items.length >= maxItems) {
          return { success: false, message: `Maximum ${maxItems} items can be compared` }
        }
        
        set({
          items: [...items, product]
        })
        return { success: true, message: 'Added to comparison' }
      },
      
      // Remove item from comparison
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        })
        return { success: true, message: 'Removed from comparison' }
      },
      
      // Clear comparison
      clearComparison: () => {
        set({ items: [] })
      },
      
      // Check if item is in comparison
      isInComparison: (productId) => {
        return get().items.some(item => item.id === productId)
      },
      
      // Get comparison item count
      getComparisonItemCount: () => {
        return get().items.length
      },
      
      // Check if comparison is full
      isComparisonFull: () => {
        return get().items.length >= get().maxItems
      }
    }),
    {
      name: 'comparison-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)

export default useComparisonStore
