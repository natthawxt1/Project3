import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import productService from '@/services/productService';
import { Product } from '@/types';
import { 
  ShoppingCart, Heart, Star, Shield, Zap, ArrowLeft,
  Check, Info, Tag, TrendingUp, Package
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

const AnimatedBackground = ({ variant = 'white' }: { variant?: 'purple' | 'white' | 'gradient' }) => {
  const colors = {
    purple: { orb1: 'from-purple-400/30 to-pink-400/30', orb2: 'from-pink-400/30 to-purple-400/30', orb3: 'from-blue-400/20 to-purple-400/20' },
    white: { orb1: 'from-purple-300/20 to-pink-300/20', orb2: 'from-pink-300/20 to-purple-300/20', orb3: 'from-blue-300/10 to-purple-300/10' },
    gradient: { orb1: 'from-purple-500/40 to-pink-500/40', orb2: 'from-pink-500/40 to-purple-500/40', orb3: 'from-blue-500/30 to-purple-500/30' },
  };
  const selected = colors[variant];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ rotate: 360, scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className={`absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br ${selected.orb1} rounded-full blur-3xl`} />
      <motion.div animate={{ rotate: -360, scale: [1, 1.3, 1] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} className={`absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br ${selected.orb2} rounded-full blur-3xl`} />
      <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br ${selected.orb3} rounded-full blur-3xl`} />
    </div>
  );
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  // ⭐ แก้ไข: เพิ่ม data transformation
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const productData = await productService.getProductById(Number(id));
      console.log('✅ Product loaded:', productData);
      
      // ⭐⭐⭐ แปลง price และ stock เป็น number
      const transformedProduct: Product = {
        ...productData,
        price: Number(productData.price) || 0,
        stock: Number(productData.stock) || 0,
      };
      
      setProduct(transformedProduct);
    } catch (error: any) {
      console.error('❌ Failed to load product:', error);
      
      if (error.response?.status === 404) {
        toast.error('Product not found', {
          description: 'This product may have been removed.'
        });
      } else {
        toast.error('Failed to load product details');
      }
      
      // Navigate back after 2 seconds
      setTimeout(() => navigate('/shop'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) {
      toast.error('Product not available');
      return;
    }

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart({
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
      stock: product.stock,
      category_name: product.category_name,
    });

    toast.success('Added to cart!', {
      description: `${product.name} x${quantity}`,
    });
  };

  const features = [
    { icon: Zap, text: 'Instant Digital Delivery' },
    { icon: Shield, text: '100% Secure Payment' },
    { icon: Check, text: 'Verified & Authentic' },
    { icon: TrendingUp, text: 'Best Price Guarantee' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Button onClick={() => navigate('/shop')}><ArrowLeft className="mr-2 h-5 w-5" />Back to Shop</Button>
        </div>
      </div>
    );
  }

  const totalPrice = product.price * quantity;
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
      <AnimatedBackground variant="white" />
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-8 hover:bg-purple-100">
            <ArrowLeft className="mr-2 h-5 w-5" />Back
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <Card className="overflow-hidden border-2 border-purple-100 shadow-2xl">
              <CardContent className="p-0 relative">
                {isLowStock && <Badge className="absolute top-4 left-4 z-10 bg-red-500">Only {product.stock} left!</Badge>}
                {isOutOfStock && <Badge className="absolute top-4 left-4 z-10 bg-gray-500">Out of Stock</Badge>}
                {!isOutOfStock && !isLowStock && <Badge className="absolute top-4 left-4 z-10 bg-green-500">In Stock</Badge>}
                
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }} className="relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100">
                  <img src={product.image_url || '/placeholder.jpg'} alt={product.name} className="w-full h-full object-cover" />
                </motion.div>

                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsLiked(!isLiked)} className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${isLiked ? 'bg-pink-500 text-white' : 'bg-white text-gray-400'}`}>
                  <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Product Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {product.category_name && (
              <Badge className="mb-4 bg-purple-100 text-purple-700"><Tag className="mr-1 h-3 w-3" />{product.category_name}</Badge>
            )}

            <h1 className="text-5xl font-black text-gray-900 mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}</div>
              <span className="text-gray-600 font-semibold">4.9/5</span>
              <span className="text-gray-400">(2,547 reviews)</span>
            </div>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">{product.description || 'Premium digital gift card for instant use.'}</p>

            {/* Price */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black text-gray-900">฿{product.price.toFixed(2)}</span>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600 font-semibold">{product.stock} available</span>
                </div>
              </div>
            </motion.div>

            {/* Quantity */}
            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-4">Quantity:</label>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="lg" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-14 rounded-full text-2xl">-</Button>
                <span className="text-3xl font-bold text-gray-900 w-16 text-center">{quantity}</span>
                <Button variant="outline" size="lg" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock} className="w-14 h-14 rounded-full text-2xl">+</Button>
              </div>
            </div>

            {/* Total Price */}
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-700">Total Price:</span>
                <span className="text-4xl font-black text-gray-900">฿{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="lg" onClick={handleAddToCart} disabled={isOutOfStock} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl py-7 rounded-2xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingCart className="mr-3 h-6 w-6" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </motion.div>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="flex items-center gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-100 shadow-sm">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-16">
          <Card className="border-2 border-purple-100 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Info className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Product Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">How it works:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Add to cart and checkout</li>
                    <li>Complete secure payment</li>
                    <li>Receive your code instantly</li>
                    <li>Redeem on the platform</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Terms & Conditions:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Valid for 12 months from purchase</li>
                    <li>Non-refundable after delivery</li>
                    <li>Cannot be exchanged for cash</li>
                    <li>One-time use only</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
