import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Search, ShoppingCart, User, Heart, BarChart3, LogOut, Settings } from 'lucide-react'
import useCartStore from '../store/cartStore'
import useWishlistStore from '../store/wishlistStore'
import useComparisonStore from '../store/comparisonStore'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { toggleCart, getCartItemCount } = useCartStore()
  const { getWishlistItemCount } = useWishlistStore()
  const { getComparisonItemCount } = useComparisonStore()
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore()

  const cartItemCount = getCartItemCount()
  const wishlistItemCount = getWishlistItemCount()
  const comparisonItemCount = getComparisonItemCount()

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    toast.success('Logged out successfully')
  }

  return (
    <header className="bg-car-black border-b border-car-light-gray sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section - Placeholder for your logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                {/* Placeholder for logo - replace with your actual logo */}
                <span className="text-car-black font-bold text-lg">M</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">MseriesAutoOnlineSpares</h1>
                <p className="text-xs text-gray-400">Premium Car Parts & Spares</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-gray-300 transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-white hover:text-gray-300 transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-white hover:text-gray-300 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-white hover:text-gray-300 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-white hover:text-gray-300 transition-colors">
              <Search size={20} />
            </button>

            <Link to="/wishlist" className="text-white hover:text-gray-300 transition-colors relative">
              <Heart size={20} />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            <Link to="/comparison" className="text-white hover:text-gray-300 transition-colors relative">
              <BarChart3 size={20} />
              {comparisonItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {comparisonItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors"
                  >
                    <User size={20} />
                    <span className="hidden md:block">{user?.firstName || user?.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-car-gray border border-car-light-gray rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-white hover:bg-car-light-gray"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-white hover:bg-car-light-gray"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Orders
                        </Link>
                        {isAdmin() && (
                          <>
                            <div className="border-t border-car-light-gray my-1"></div>
                            <Link
                              to="/admin/dashboard"
                              className="block px-4 py-2 text-white hover:bg-car-light-gray flex items-center"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Admin Dashboard
                            </Link>
                            <Link
                              to="/admin/orders"
                              className="block px-4 py-2 text-white hover:bg-car-light-gray"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Manage Orders
                            </Link>
                            <Link
                              to="/admin/products"
                              className="block px-4 py-2 text-white hover:bg-car-light-gray"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Manage Products
                            </Link>
                          </>
                        )}
                        <div className="border-t border-car-light-gray my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-white hover:bg-car-light-gray flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="text-white hover:text-gray-300 transition-colors">
                  <User size={20} />
                </Link>
              )}
            </div>

            <button
              onClick={toggleCart}
              className="text-white hover:text-gray-300 transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-car-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-car-light-gray">
              <Link
                to="/"
                className="block px-3 py-2 text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-3 py-2 text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 text-white hover:text-gray-300 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
