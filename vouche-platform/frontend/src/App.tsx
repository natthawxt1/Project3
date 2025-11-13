import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import AuthPage from './pages/auth/AuthPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManagement from './pages/admin/ProductManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* ✅ Layout ครอบทุกหน้า */}
            <Route path="/" element={<Layout />}>
              {/* 🌐 Public Routes */}
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="auth" element={<AuthPage />} />

              {/* 🔒 Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="checkout" element={<CheckoutPage />} />
                <Route path="orders" element={<OrdersPage />} />
              </Route>

              {/* 🛠 Admin Routes */}
              <Route element={<ProtectedRoute requireAdmin />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/products" element={<ProductManagement />} />
              </Route>
            </Route>
          </Routes>

          {/* 🔔 Toaster Notification */}
          <Toaster position="top-right" richColors />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
