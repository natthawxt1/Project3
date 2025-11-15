import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import orderService from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Package,
  Gift,
  Copy,
  CheckCircle,
  Calendar,
  CreditCard,
} from 'lucide-react';

interface OrderDetail {
  order_id: number;
  total_price: number;
  status: string;
  order_date: string;
  items: Array<{
    order_item_id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
    image_url: string;
    gift_codes: Array<{
      gift_code_id: number;
      code: string;
      status: string;
      redeemed_at: string | null;
    }>;
  }>;
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

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      toast.error('Please login');
      navigate('/auth');
      return;
    }
    if (orderId) fetchOrderDetail();
  }, [orderId, user, navigate]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(Number(orderId));
      setOrder(response.order);
    } catch (error: any) {
      console.error('Fetch order detail error:', error);
      toast.error('Failed to load order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge className={`${config.color} text-sm px-3 py-1`}>
        {config.label}
      </Badge>
    );
  };

  if (loading || !order) {
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
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/orders')}
            className="hover:bg-purple-100"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Orders
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                Order #{order.order_id}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(order.order_date).toLocaleDateString()}</span>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ฿{order.total_price.toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Order Items with Gift Codes */}
        <div className="space-y-6">
          {order.items.map((item, index) => (
            <motion.div
              key={item.order_item_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-2 border-purple-100 shadow-xl overflow-hidden">
                <CardContent className="p-0">
                  {/* Product Info */}
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image_url || '/placeholder.jpg'}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {item.product_name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Quantity: {item.quantity}</span>
                          <span>฿{item.price.toLocaleString()} each</span>
                          <span className="font-semibold text-purple-600">
                            Total: ฿{item.subtotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">
                        {item.gift_codes.length} Code{item.gift_codes.length > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </div>

                  {/* Gift Codes */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Gift className="h-6 w-6 text-purple-600" />
                      <h4 className="text-lg font-bold text-gray-900">Your Gift Codes</h4>
                    </div>

                    {item.gift_codes.length > 0 ? (
                      <div className="space-y-3">
                        {item.gift_codes.map((giftCode, codeIndex) => (
                          <motion.div
                            key={giftCode.gift_code_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + codeIndex * 0.05 }}
                            className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <Gift className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="text-2xl font-black text-gray-900 tracking-wider font-mono">
                                  {giftCode.code}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  Status: <span className="font-semibold capitalize">{giftCode.status}</span>
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => copyToClipboard(giftCode.code)}
                              variant="outline"
                              className="border-purple-200 hover:bg-purple-100"
                            >
                              {copiedCode === giftCode.code ? (
                                <>
                                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy
                                </>
                              )}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">
                          {order.status === 'paid'
                            ? 'Gift codes are being generated...'
                            : 'Complete payment to receive gift codes'}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
