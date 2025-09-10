import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to wishlist
      addItem: (product) => {
        const items = get().items
        const existingItem = items.find(item => item.id === product.id)
        
        if (!existingItem) {
          set({
            items: [...items, product]
          })
          return { success: true, message: 'Added to wishlist' }
        } else {
          return { success: false, message: 'Item already in wishlist' }
        }
      },
      
      // Remove item from wishlist
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        })
        return { success: true, message: 'Removed from wishlist' }
      },
      
      // Clear wishlist
      clearWishlist: () => {
        set({ items: [] })
      },
      
      // Check if item is in wishlist
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId)
      },
      
      // Get wishlist item count
      getWishlistItemCount: () => {
        return get().items.length
      },
      
      // Move item from wishlist to cart
      moveToCart: (productId, addToCart) => {
        const item = get().items.find(item => item.id === productId)
        if (item) {
          addToCart(item)
          get().removeItem(productId)
          return { success: true, message: 'Moved to cart' }
        }
        return { success: false, message: 'Item not found' }
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)

export default useWishlistStore
