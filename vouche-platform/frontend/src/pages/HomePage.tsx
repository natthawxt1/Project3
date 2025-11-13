import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Zap, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { toast } from 'sonner';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({
        sort: 'newest'
      });
      // Get first 8 products for carousel
      setFeaturedProducts(data.products.slice(0, 8));
    } catch (error) {
      console.error('Failed to load featured products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 pb-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-100 to-pink-100 px-6 py-2 rounded-full mb-6"
            >
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
              <span className="text-gradient">Digital vouchers.</span>
              <br />
              <span className="text-foreground">Reimagined.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the future of digital gift cards. Premium, instant, and secure.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/shop">
                <Button 
                  size="lg" 
                  className="gradient-purple text-lg px-8 py-6 rounded-full shadow-apple-lg hover:shadow-apple-hover transition-all duration-300"
                >
                  Explore vouchers
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 rounded-full border-2 hover:bg-primary-50 transition-all duration-300"
                >
                  Get started
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating cards decoration */}
        <div className="absolute top-1/4 left-10 opacity-20">
          <div className="w-32 h-40 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl rotate-12 blur-sm"></div>
        </div>
        <div className="absolute bottom-1/4 right-10 opacity-20">
          <div className="w-32 h-40 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl -rotate-12 blur-sm"></div>
        </div>
      </section>

      {/* Bestseller Carousel Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-5xl font-bold mb-2">
                Bestseller
              </h2>
              <p className="text-gray-600">Top-rated products loved by our customers</p>
            </div>
            
            <Link to="/shop">
              <Button
                className="rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              >
                More Products
              </Button>
            </Link>
          </motion.div>

          {/* Carousel Container */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="relative group">
              {/* Scroll Buttons */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white backdrop-blur-xl p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-6 group-hover:translate-x-0"
              >
                <ChevronLeft className="h-6 w-6 text-primary-600" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white backdrop-blur-xl p-4 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-6 group-hover:translate-x-0"
              >
                <ChevronRight className="h-6 w-6 text-primary-600" />
              </motion.button>

              {/* Products Carousel */}
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.product_id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.1,
                    }}
                    className="flex-shrink-0 w-[300px] sm:w-[320px]"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <ProductCard product={product} index={index} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto"
          >
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Instant Delivery</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive your digital vouchers instantly. No waiting, no hassle.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">100% Secure</h3>
              <p className="text-muted-foreground leading-relaxed">
                Bank-level security. Your transactions are always protected.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="text-center group"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-pink-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Premium Selection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Curated collection of the most popular digital vouchers.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <TrendingUp className="h-16 w-16 mx-auto mb-6 text-emerald-300" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-primary-100 mb-10 leading-relaxed">
              Join thousands of satisfied customers who trust VOUCHÉ for their digital voucher needs.
            </p>
            <Link to="/shop">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-500 hover:to-cyan-500 text-white text-lg px-10 py-6 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300"
              >
                Browse vouchers
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;