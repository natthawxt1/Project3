import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, User, Calendar, DollarSign, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import adminService from '@/services/adminService';
import { toast } from 'sonner';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
}

const OrderDetailsModal = ({ isOpen, onClose, orderId }: OrderDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [copiedCode, setCopiedCode] = useState<string>('');

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const response = await adminService.getOrderDetails(orderId);
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

  const getGiftCodeStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'new':
        return 'bg-blue-100 text-blue-700';
      case 'redeemed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-pink-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-sm text-gray-600 mt-1">Order ID: #{orderId}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : order ? (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Customer */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Customer</p>
                        <p className="font-bold text-gray-900">{order.full_name || order.name}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 ml-11">{order.email}</p>
                  </div>

                  {/* Date */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Order Date</p>
                        <p className="font-bold text-gray-900">
                          {new Date(order.order_date || order.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(order.order_date || order.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Total Amount</p>
                        <p className="font-bold text-2xl text-gray-900">
                          ฿{parseFloat(order.total_amount || order.total_price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="font-semibold text-gray-700">Order Status:</span>
                  <Badge className={`${getStatusColor(order.status)} border-0 px-4 py-1 text-sm font-bold`}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary-600" />
                    Order Items
                  </h3>

                  <div className="space-y-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-primary-300 transition-colors"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 flex-shrink-0">
                              {item.image_url ? (
                                <img
                                  src={`http://localhost:5000${item.image_url}`}
                                  alt={item.product_name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'https://via.placeholder.com/100/9370DB/FFFFFF?text=No+Image';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                  🎁
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1">
                              <h4 className="font-bold text-lg text-gray-900 mb-1">
                                {item.product_name}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                <span>Quantity: <strong>{item.quantity}</strong></span>
                                <span>Price: <strong>฿{parseFloat(item.price).toLocaleString()}</strong></span>
                                {item.subtotal && (
                                  <span>Subtotal: <strong>฿{parseFloat(item.subtotal).toLocaleString()}</strong></span>
                                )}
                              </div>

                              {/* Gift Codes */}
                              {item.gift_codes && item.gift_codes.length > 0 && (
                                <div className="bg-gradient-to-r from-primary-50 to-pink-50 rounded-xl p-4">
                                  <p className="font-semibold text-gray-900 mb-3">
                                    🎫 Gift Codes ({item.gift_codes.length})
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {item.gift_codes.map((gc: any) => (
                                      <div
                                        key={gc.gift_code_id}
                                        className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200"
                                      >
                                        <code className="flex-1 font-mono text-sm text-gray-900 truncate">
                                          {gc.code}
                                        </code>
                                        <Badge className={`${getGiftCodeStatusColor(gc.status)} border-0 text-xs`}>
                                          {gc.status}
                                        </Badge>
                                        <button
                                          onClick={() => handleCopyCode(gc.code)}
                                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                          title="Copy code"
                                        >
                                          {copiedCode === gc.code ? (
                                            <Check className="h-4 w-4 text-green-600" />
                                          ) : (
                                            <Copy className="h-4 w-4 text-gray-600" />
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No items in this order
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                Failed to load order details
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button
              onClick={onClose}
              className="rounded-full bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700"
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
