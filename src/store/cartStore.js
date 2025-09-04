import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      // Add item to cart
      addItem: (product) => {
        const items = get().items
        const existingItem = items.find(item => item.id === product.id)
        
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({
            items: [...items, { ...product, quantity: 1 }]
          })
        }
      },
      
      // Remove item from cart
      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.id !== productId)
        })
      },
      
      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        
        set({
          items: get().items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },
      
      // Clear cart
      clearCart: () => {
        set({ items: [] })
      },
      
      // Toggle cart sidebar
      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },
      
      // Close cart
      closeCart: () => {
        set({ isOpen: false })
      },
      
      // Open cart
      openCart: () => {
        set({ isOpen: true })
      },
      
      // Get cart totals
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.price.replace('R', ''))
          return total + (price * item.quantity)
        }, 0)
      },
      
      // Get cart item count
      getCartItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)

export default useCartStore
