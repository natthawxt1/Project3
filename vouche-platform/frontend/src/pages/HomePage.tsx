import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/product/ProductCard';
import productService from '@/services/productService';
import { Product } from '@/types';
import { 
  Sparkles, Gift, Zap, Shield, ArrowRight, TrendingUp, 
  Star, Heart, ShoppingBag
} from 'lucide-react';

// Animated Background Component
const AnimatedBackground = ({ variant = 'purple' }: { variant?: 'purple' | 'white' | 'gradient' }) => {
  const colors = {
    purple: {
      orb1: 'from-purple-400/30 to-pink-400/30',
      orb2: 'from-pink-400/30 to-purple-400/30',
      orb3: 'from-blue-400/20 to-purple-400/20',
    },
    white: {
      orb1: 'from-purple-300/20 to-pink-300/20',
      orb2: 'from-pink-300/20 to-purple-300/20',
      orb3: 'from-blue-300/10 to-purple-300/10',
    },
    gradient: {
      orb1: 'from-purple-500/40 to-pink-500/40',
      orb2: 'from-pink-500/40 to-purple-500/40',
      orb3: 'from-blue-500/30 to-purple-500/30',
    },
  };

  const selected = colors[variant];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
        className={`absolute -top-1/2 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br ${selected.orb1} rounded-full blur-3xl`}
      />
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 1.3, 1],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: 'linear' 
        }}
        className={`absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br ${selected.orb2} rounded-full blur-3xl`}
      />
      <motion.div
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br ${selected.orb3} rounded-full blur-3xl`}
      />

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
          className="absolute bg-white/30 rounded-full"
          style={{
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
        />
      ))}

      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #9333ea 1px, transparent 1px),
            linear-gradient(to bottom, #9333ea 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedProducts = () => {
    return [...products].sort(() => Math.random() - 0.5);
  };

  const features = [
    { icon: Zap, title: 'Instant Delivery', desc: 'Receive codes within seconds' },
    { icon: Shield, title: '100% Secure', desc: 'Safe & verified purchases' },
    { icon: Gift, title: 'Best Prices', desc: 'Unbeatable daily deals' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-hidden">
      {/* Hero Section */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative py-24 px-6 overflow-hidden"
      >
        <AnimatedBackground variant="purple" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
        


            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-7xl md:text-8xl font-black mb-8 leading-tight"
            >
              <motion.span 
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity, 
                  ease: 'linear' 
                }}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent bg-[length:200%_auto]"
              >
                Gift Cards
              </motion.span>
              <br />
              <span className="text-gray-900">Made Simple</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Instant digital gift cards for <span className="font-bold text-purple-600">gaming</span>, 
              <span className="font-bold text-pink-600"> entertainment</span>, and more.
              <br />
              <span className="font-semibold text-gray-800">
                Delivered in seconds, trusted by thousands.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link to="/shop">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Browse Gift Cards
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/shop">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    variant="outline" 
                    className="text-lg px-10 py-7 rounded-full border-2 border-purple-300 hover:border-purple-500 hover:bg-purple-50/80 backdrop-blur-sm transition-all"
                  >
                    <TrendingUp className="mr-2 h-5 w-5" />
                    View Hot Deals
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="relative py-16 px-6 bg-white/70 backdrop-blur-sm overflow-hidden">
        <AnimatedBackground variant="white" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-purple-100 hover:border-purple-400 bg-white/80 backdrop-blur-sm group">
                  <CardContent className="p-8 text-center">
                    <motion.div 
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl"
                    >
                      <feature.icon className="h-10 w-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-lg">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestseller Section */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white overflow-hidden">
        <AnimatedBackground variant="gradient" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-6xl font-black mb-4 flex items-center justify-center gap-4"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔥
              </motion.span>
              Bestsellers
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                🔥
              </motion.span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-purple-100"
            >
              Most popular gift cards this week • Loved by thousands
            </motion.p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="rounded-full h-20 w-20 border-4 border-white border-t-transparent mb-6"
              />
              <p className="text-xl text-purple-100">Loading amazing deals...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🎁</div>
              <h3 className="text-3xl font-bold mb-3">No products yet</h3>
              <p className="text-xl text-purple-100">Check back soon for amazing deals!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.product_id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/shop">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-10 py-7 rounded-full shadow-2xl font-bold"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="relative py-20 px-6 bg-white overflow-hidden">
        <AnimatedBackground variant="white" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.h2 
              className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-4"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="h-14 w-14 text-pink-500 fill-current" />
              </motion.div>
              Recommended for You
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Heart className="h-14 w-14 text-pink-500 fill-current" />
              </motion.div>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600"
            >
              Handpicked selections based on your interests
            </motion.p>
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent mb-6"
              />
              <p className="text-xl text-gray-600">Finding perfect matches...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">💜</div>
              <h3 className="text-3xl font-bold mb-3 text-gray-900">No recommendations yet</h3>
              <p className="text-xl text-gray-600">Start shopping to get personalized recommendations!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {getRecommendedProducts().slice(0, 8).map((product, index) => (
                <motion.div
                  key={`recommended-${product.product_id}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: -1 }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
        <AnimatedBackground variant="purple" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto relative z-10"
        >
          <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-16 text-center text-white relative">
              <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
              <div className="relative z-10">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Star className="h-20 w-20 mx-auto mb-6 fill-current" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl font-black mb-6"
                >
                  Ready to Get Started?
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl mb-10 text-purple-50 leading-relaxed max-w-2xl mx-auto"
                >
                  Join thousands of happy customers and get instant digital gift cards today!
                </motion.p>
                <Link to="/shop">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-8 rounded-full shadow-2xl font-bold"
                    >
                      Start Shopping Now
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;
