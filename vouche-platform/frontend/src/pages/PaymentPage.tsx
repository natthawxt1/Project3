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

const PaymentPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  // ⭐ NEW: เลือกวิธีจ่ายเงิน
  const [paymentMethod, setPaymentMethod] = useState<
    'promptpay' | 'wallet' | 'card' | null
  >(null);

  useEffect(() => {
    if (!user) {
      toast.error('Please login');
      navigate('/auth');
      return;
    }
    if (orderId) fetchPaymentInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!paymentMethod) {
      toast.error('Please select a payment method!');
      return;
    }

    try {
      setConfirming(true);
      // ⭐ ส่ง paymentMethod ไป backend
      await paymentService.confirmPayment(Number(orderId), paymentMethod);
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
      <div className="flex justify-center items-center bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="border-4 border-purple-600 border-t-transparent rounded-full w-20 h-20"
        />
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen overflow-hidden">
      <AnimatedBackground />

      <div className="z-10 relative mx-auto px-4 py-12 max-w-4xl container">
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
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Orders
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-4 rounded-3xl w-20 h-20">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-2 font-black text-gray-900 text-5xl">Payment</h1>
          <p className="text-gray-600 text-lg">
            Complete your purchase to get gift codes
          </p>
        </motion.div>

        {/* ⭐ Payment Method Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h3 className="mb-3 font-semibold text-gray-700 text-sm">
            Select Payment Method
          </h3>
          <div className="gap-3 grid grid-cols-3">
            <Button
              variant={paymentMethod === 'promptpay' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('promptpay')}
              className="flex justify-center items-center gap-2 rounded-xl"
            >
              <QrCode className="w-4 h-4" />
              <span className="text-sm">QR</span>
            </Button>

            <Button
              variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('wallet')}
              className="flex justify-center items-center gap-2 rounded-xl"
            >
              <Smartphone className="w-4 h-4" />
              <span className="text-sm">Mobile</span>
            </Button>

            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="flex justify-center items-center gap-2 rounded-xl"
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">Card</span>
            </Button>
          </div>
        </motion.div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-2">
          {/* Left: QR / Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-xl border-2 border-purple-100">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <QrCode className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-gray-900 text-2xl">Scan to Pay</h3>
                </div>

                {/* ⭐ ถ้าเลือก PromptPay ให้โชว์ QR, ถ้าไม่เลือกให้โชว์ข้อความเฉย ๆ */}
                {paymentMethod === 'promptpay' ? (
                  <div className="bg-white mb-6 p-8 border-2 border-gray-200 rounded-2xl">
                    <div className="flex justify-center items-center bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl aspect-square">
                      <div className="text-center">
                        <QrCode className="mx-auto mb-4 w-32 h-32 text-purple-400" />
                        <p className="font-semibold text-gray-600">
                          QR Code PromptPay
                        </p>
                        <p className="mt-2 text-gray-500 text-sm">
                          Amount: ฿{payment.total_price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white mb-6 p-8 border-2 border-gray-200 border-dashed rounded-2xl">
                    <div className="flex justify-center items-center aspect-square">
                      <div className="space-y-2 text-gray-600 text-sm text-center">
                        <p>Select a payment method above.</p>
                        <p>
                          If you choose <span className="font-semibold">QR</span>, a
                          PromptPay QR code will appear here.
                        </p>
                        <p>
                          If you choose{' '}
                          <span className="font-semibold">Mobile Payment</span> or{' '}
                          <span className="font-semibold">Credit/Debit Card</span>, just
                          press <span className="font-semibold">&quot;Confirm Payment&quot;</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Instructions (ใช้ได้กับทุก method) */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center bg-purple-100 mt-0.5 rounded-full w-6 h-6">
                      <span className="font-bold text-purple-600 text-sm">1</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Select your preferred payment method above.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center bg-purple-100 mt-0.5 rounded-full w-6 h-6">
                      <span className="font-bold text-purple-600 text-sm">2</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      If using QR, open your mobile banking app and scan the QR code.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex flex-shrink-0 justify-center items-center bg-purple-100 mt-0.5 rounded-full w-6 h-6">
                      <span className="font-bold text-purple-600 text-sm">3</span>
                    </div>
                    <p className="text-gray-700 text-sm">
                      After completing payment, click &quot;Confirm Payment&quot; to
                      activate your gift codes.
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
            <Card className="shadow-xl mb-6 border-2 border-purple-100">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-gray-900 text-2xl">Order Summary</h3>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {payment.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-4 rounded-xl"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {item.product_name}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mb-6 pt-6 border-gray-200 border-t-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-xl">
                      Total Amount
                    </span>
                    <span className="bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-black text-transparent text-4xl">
                      ฿{payment.total_price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Demo Notice */}
                <div className="bg-blue-50 mb-6 p-4 border-2 border-blue-200 rounded-xl">
                  <p className="text-blue-900 text-sm">
                    <strong>💡 Demo Mode:</strong> This is a test payment screen. Select
                    any method and click &quot;Confirm Payment&quot; to save a record in
                    the database.
                  </p>
                </div>

                {/* Confirm Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleConfirmPayment}
                    disabled={confirming}
                    className="bg-gradient-to-r from-purple-600 hover:from-purple-700 to-pink-600 hover:to-pink-700 shadow-2xl py-7 rounded-2xl w-full text-white text-xl"
                  >
                    {confirming ? (
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                          className="border-2 border-white border-t-transparent rounded-full w-5 h-5"
                        />
                        Processing...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="mr-3 w-6 h-6" />
                        Confirm Payment
                      </>
                    )}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="shadow-lg border-2 border-gray-100">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-sm">Instant Delivery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500" />
                    <span className="text-gray-700 text-sm">
                      100% Authentic Codes
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-500" />
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

export default PaymentPage;
