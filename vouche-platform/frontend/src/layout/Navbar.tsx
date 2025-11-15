import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Package, Settings, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; 
import { useCart } from '@/context/CartContext'; 
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { getTotalItems } = useCart(); 
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const totalItems = getTotalItems(); // ⭐ เก็บค่าไว้ใช้

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              VOUCHÉ
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/') ? 'text-purple-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                isActive('/shop') ? 'text-purple-600' : 'text-gray-700'
              }`}
            >
              Shop
            </Link>
            {user && (
              <Link
                to="/orders"
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-purple-600 ${
                  isActive('/orders') ? 'text-purple-600' : 'text-gray-700'
                }`}
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart - */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-purple-600 text-white text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <User className="h-5 w-5" />
                </Button>

                {/* Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm opacity-90">{user.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          to="/orders"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Profile Settings
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Cart Button for Mobile */}
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-purple-600 text-white text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-200 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/') ? 'bg-purple-100 text-purple-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive('/shop') ? 'bg-purple-100 text-purple-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Shop
                </Link>
                {user && (
                  <>
                    <Link
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive('/orders') ? 'bg-purple-100 text-purple-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      My Orders
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isActive('/cart') ? 'bg-purple-100 text-purple-600' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActive('/admin') ? 'bg-purple-100 text-purple-600' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                )}
                {!user && (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
