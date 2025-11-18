import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import orderService from '@/services/orderService';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, CheckCircle, Package } from 'lucide-react';

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="-top-1/2 -left-1/4 absolute bg-gradient-to-br from-purple-300/20 to-pink-300/20 blur-3xl rounded-full w-[600px] h-[600px]"
      />
      <motion.div
        animate={{ rotate: -360, scale: [1, 1.3, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="-right-1/4 -bottom-1/2 absolute bg-gradient-to-br from-pink-300/20 to-purple-300/20 blur-3xl rounded-full w-[600px] h-[600px]"
      />
    </div>
  );
};

const CheckoutPage = () => {
  const { cart, getTotalPrice,} = useCart();
  const { user } = useAuth(); // ⭐ เช็ค login
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ⭐ เช็ค login
  useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/auth');
    }
  }, [user, navigate]);

  // ⭐ เช็คตะกร้าว่าง
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const cartItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const response = await orderService.createOrder({ cart_items: cartItems });

      toast.success('🎉 Order placed successfully!', {
        description: `Order #${response.order.order_id} has been created`,
      });


      navigate(`/payment/${response.order.order_id}`);

      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  const totalPrice = getTotalPrice();

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="z-10 relative mx-auto px-4 py-12 max-w-4xl container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-2 font-black text-gray-900 text-5xl">Checkout</h1>
          <p className="text-gray-600 text-lg">Review your order and complete purchase</p>
        </motion.div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Left: Order Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-xl border-2 border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl w-12 h-12">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-2xl">Order Summary</h3>
                    <p className="text-gray-600 text-sm">{cart.length} items in your cart</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.product_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image_url || '/placeholder.jpg'}
                          alt={item.name}
                          className="rounded-lg w-16 h-16 object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Summary & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Price Summary */}
            <Card className="shadow-xl mb-6 border-2 border-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg w-10 h-10">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl">Payment Summary</h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>฿{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>฿0.00</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-bold text-gray-900 text-xl">Total</span>
                    <span className="bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-black text-transparent text-3xl">
                      ฿{totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 hover:from-purple-700 to-pink-600 hover:to-pink-700 shadow-2xl py-7 rounded-2xl w-full text-white text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="border-2 border-white border-t-transparent rounded-full w-5 h-5"
                        />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Place Order
                      </div>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-lg border-2 border-gray-100">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-sm">Instant Digital Delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-sm">24/7 Support</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;