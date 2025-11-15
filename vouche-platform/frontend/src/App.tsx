import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/layout/Navbar';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import AuthPage from '@/pages/auth/AuthPage';
import CartPage from '@/pages/auth/CartPage';
import CheckoutPage from '@/pages/auth/CheckoutPage';
import OrdersPage from '@/pages/auth/OrdersPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ProductManagement from '@/pages/admin/ProductManagement';
import CategoryManagement from '@/pages/admin/CategoryManagement';
import OrderManagement from '@/pages/admin/OrderManagement';
import GiftCodeManagement from '@/pages/admin/GiftCodeManagement';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminRoute from '@/components/AdminRoute';
import PaymentPage from '@/pages/PaymentPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import ProfilePage from './pages/profilePage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile" element={<ProfilePage/>} />
              
              
              {/* Protected User Routes */}
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
              
              {/*  Payment & Order Detail Routes */}
              <Route path="/payment/:orderId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/orders/:orderId" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />
              <Route path="/admin/categories" element={<AdminRoute><CategoryManagement /></AdminRoute>} />
              <Route path="/admin/orders" element={<AdminRoute><OrderManagement /></AdminRoute>} />
              <Route path="/admin/gift-codes" element={<AdminRoute><GiftCodeManagement /></AdminRoute>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
