import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-car-gray border-t border-car-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-car-black font-bold">M</span>
              </div>
              <h3 className="text-xl font-bold text-white">MseriesAutoOnlineSpares</h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your trusted partner for premium car parts and spares. We provide high-quality automotive components 
              to keep your vehicle running at its best.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail size={16} />
                <span>info@mseriesauto.com</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400">
                <MapPin size={16} className="mt-1" />
                <span>123 Auto Parts Street<br />Car City, CC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-car-light-gray mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 MseriesAutoOnlineSpares. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
