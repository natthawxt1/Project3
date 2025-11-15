import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import orderService from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  Package,
  Calendar,
  CreditCard,
  Eye,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

interface Order {
  order_id: number;
  total_price: number;
  status: string;
  order_date: string;
  items_count: number;
}

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ rotate: -360, scale: [1, 1.3, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl"
      />
    </div>
  );
};

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to view orders');
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response.orders);
    } catch (error: any) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      paid: { label: 'Paid', color: 'bg-green-100 text-green-800 border-green-200' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200' },
      refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.color} text-sm px-3 py-1 border-2 font-semibold`}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      <AnimatedBackground />

      <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-gray-900">My Orders</h1>
              <p className="text-gray-600 text-lg">View your purchase history</p>
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <Package className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
            <Button
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.order_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 border-purple-100 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Left: Order Info */}
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                          <Package className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            Order #{order.order_id}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(order.order_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              <span>{order.items_count} items</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              <span className="font-semibold">฿{order.total_price.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status & Action */}
                      <div className="flex items-center gap-4">
                        {getStatusBadge(order.status)}

                        {/* ⭐⭐⭐ Conditional Button - แก้ตรงนี้ */}
                        {order.status === 'pending' ? (
                          // Pending → Go to Payment
                          <Button
                            onClick={() => navigate(`/payment/${order.order_id}`)}
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                          >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Go to Payment
                          </Button>
                        ) : order.status === 'paid' ? (
                          // Paid → View Details (Gift Codes)
                          <Button
                            onClick={() => navigate(`/orders/${order.order_id}`)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          >
                            <Eye className="mr-2 h-5 w-5" />
                            View Details
                          </Button>
                        ) : null /* ⚠️ Cancelled/Refunded → ไม่มีปุ่ม */}
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
