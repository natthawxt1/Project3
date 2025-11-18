import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Package,
  User,
  Calendar,
  DollarSign,
  Loader2,
  Copy,
  Check,
  Gift,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import adminService from '@/services/adminService';
import { toast } from 'sonner';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
}

interface GiftCode {
  gift_code_id: number;
  code: string;
  status: string;
  redeemed_at: string | null;
}

interface OrderItem {
  order_item_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  image_url: string;
  gift_codes: GiftCode[];
}

interface OrderDetail {
  order_id: number;
  user_name?: string;
  email?: string;
  total_price: number;
  status: string;
  order_date: string;
  items: OrderItem[];
}

const OrderDetailsModal = ({ isOpen, onClose, orderId }: OrderDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [copiedCode, setCopiedCode] = useState<string>('');

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    setOrder(null);
    setLoading(true);
    try {
      const response = await adminService.getOrderDetails(orderId);
      // 👇 สำคัญ: ใช้ response.order เหมือนหน้า customer
      setOrder(response.order);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'refunded':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="z-50 fixed inset-0 flex justify-center items-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white shadow-2xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-gradient-to-r from-primary-50 to-pink-50 p-6 border-gray-200 border-b">
            <div>
              <h2 className="font-bold text-gray-900 text-2xl">Order Details</h2>
              <p className="mt-1 text-gray-600 text-sm">Order ID: #{orderId}</p>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-180px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              </div>
            ) : order ? (
              <div className="space-y-6">
                {/* Top summary */}
                <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                  {/* Customer */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-blue-500 p-2 rounded-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Customer</p>
                        <p className="font-bold text-gray-900">
                          {order.user_name || 'Customer'}
                        </p>
                      </div>
                    </div>
                    {order.email && (
                      <p className="ml-11 text-gray-600 text-sm">{order.email}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500 p-2 rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Order Date</p>
                        <p className="font-bold text-gray-900">
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 text-xs">
                          {new Date(order.order_date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500 p-2 rounded-lg">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">Total Amount</p>
                        <p className="font-bold text-gray-900 text-2xl">
                          ฿{order.total_price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <span className="font-semibold text-gray-700">Order Status:</span>
                  <Badge
                    className={`${getStatusColor(
                      order.status
                    )} border-0 px-4 py-1 text-sm font-bold`}
                  >
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Items + gift codes */}
                <div>
                  <h3 className="flex items-center gap-2 mb-4 font-bold text-gray-900 text-xl">
                    <Package className="w-5 h-5 text-primary-600" />
                    Order Items
                  </h3>

                  <div className="space-y-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => (
                        <div
                          key={item.order_item_id}
                          className="bg-white p-5 border-2 border-gray-200 hover:border-primary-300 rounded-2xl transition-colors"
                        >
                          <div className="flex gap-4">
                            {/* Image */}
                            <div className="flex-shrink-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl w-24 h-24 overflow-hidden">
                              {item.image_url ? (
                                <img
                                  src={`http://localhost:5000${item.image_url}`}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex justify-center items-center w-full h-full text-4xl">
                                  🎁
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <h4 className="mb-1 font-bold text-gray-900 text-lg">
                                {item.product_name}
                              </h4>
                              <div className="flex items-center gap-4 mb-3 text-gray-600 text-sm">
                                <span>
                                  Qty: <strong>{item.quantity}</strong>
                                </span>
                                <span>
                                  Price:{' '}
                                  <strong>
                                    ฿{item.price.toLocaleString()}
                                  </strong>
                                </span>
                                <span>
                                  Subtotal:{' '}
                                  <strong>
                                    ฿{item.subtotal.toLocaleString()}
                                  </strong>
                                </span>
                              </div>

                              {/* Gift Codes */}
                              <div className="bg-gradient-to-r from-primary-50 to-pink-50 p-4 rounded-xl">
                                <p className="flex items-center gap-2 mb-3 font-semibold text-gray-900">
                                  <Gift className="w-4 h-4 text-primary-600" />
                                  Gift Codes ({item.gift_codes.length})
                                </p>
                                {item.gift_codes.length > 0 ? (
                                  <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
                                    {item.gift_codes.map((gc) => (
                                      <div
                                        key={gc.gift_code_id}
                                        className="flex items-center gap-2 bg-white p-2 border border-gray-200 rounded-lg"
                                      >
                                        <code className="flex-1 font-mono text-gray-900 text-sm truncate">
                                          {gc.code}
                                        </code>
                                        <Badge
                                          className="bg-gray-100 border-0 text-gray-700 text-xs"
                                        >
                                          {gc.status}
                                        </Badge>
                                        <button
                                          onClick={() => handleCopyCode(gc.code)}
                                          className="hover:bg-gray-100 p-1.5 rounded transition-colors"
                                          title="Copy code"
                                        >
                                          {copiedCode === gc.code ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                          ) : (
                                            <Copy className="w-4 h-4 text-gray-600" />
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-sm">
                                    No codes for this item.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-gray-500 text-center">
                        No items in this order
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-gray-500 text-center">
                Failed to load order details
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-3 bg-gray-50 p-6 border-gray-200 border-t">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-primary-600 hover:from-primary-700 to-violet-600 hover:to-violet-700 rounded-full"
            >
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderDetailsModal;
