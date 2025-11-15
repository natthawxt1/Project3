import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import paymentService from '@/services/paymentService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Package,
  QrCode,
  Smartphone,
} from 'lucide-react';

interface PaymentInfo {
  order_id: number;
  total_price: number;
  status: string;
  order_date: string;
  items: Array<{
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
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

const PaymentPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Please login');
      navigate('/auth');
      return;
    }
    if (orderId) fetchPaymentInfo();
  }, [orderId, user, navigate]);

  const fetchPaymentInfo = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentInfo(Number(orderId));
      setPayment(response.payment);
    } catch (error: any) {
      console.error('Fetch payment info error:', error);
      toast.error('Failed to load payment info');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setConfirming(true);
      await paymentService.confirmPayment(Number(orderId));
      toast.success('🎉 Payment confirmed! Your gift codes are ready!');
      navigate(`/orders/${orderId}`);
    } catch (error: any) {
      console.error('Confirm payment error:', error);
      toast.error('Failed to confirm payment');
    } finally {
      setConfirming(false);
    }
  };

  if (loading || !payment) {
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

      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
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
          className="mb-8 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-black text-gray-900 mb-2">Payment</h1>
          <p className="text-gray-600 text-lg">Complete your purchase to get gift codes</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: QR Code */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-purple-100 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <QrCode className="h-6 w-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Scan to Pay</h3>
                </div>

                {/* QR Code Placeholder */}
                <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 mb-6">
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-32 w-32 text-purple-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-semibold">QR Code PromptPay</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Amount: ฿{payment.total_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-sm font-bold">1</span>
                    </div>
                    <p className="text-sm text-gray-700">Open your mobile banking app</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-sm font-bold">2</span>
                    </div>
                    <p className="text-sm text-gray-700">Scan the QR code above</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-600 text-sm font-bold">3</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      Confirm payment and click "Confirm Payment" below
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-2 border-purple-100 shadow-xl mb-6">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="h-6 w-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Order Summary</h3>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {payment.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.product_name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-lg text-gray-900">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t-2 border-gray-200 pt-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ฿{payment.total_price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Demo Notice */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    <strong>💡 Demo Mode:</strong> Click "Confirm Payment" below to simulate
                    payment. Your gift codes will be activated immediately!
                  </p>
                </div>

                {/* Confirm Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleConfirmPayment}
                    disabled={confirming}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-7 rounded-2xl shadow-2xl"
                  >
                    {confirming ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="mr-3 h-6 w-6" />
                        Confirm Payment
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="border-2 border-gray-100 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Instant Delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">100% Authentic Codes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">24/7 Support</span>
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

export default PaymentPage;
