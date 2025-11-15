import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product/ProductCard';
import productService from '@/services/productService';
import categoryService from '@/services/categoryService';
import { Product, Category } from '@/types';
import { toast } from 'sonner';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    searchParams.get('category') ? Number(searchParams.get('category')) : null
  );
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchData();
  }, [selectedCategory, sortBy]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsData = await productService.getProducts();
      let filteredProducts = productsData.products || [];

      // Filter by category
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
          (p: Product) => p.category_id === selectedCategory
        );
      }

      // Sort products
      filteredProducts = sortProducts(filteredProducts, sortBy);

      setProducts(filteredProducts);

      // Fetch categories (only once)
      if (categories.length === 0) {
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData.categories || []);
      }
    } catch (error: any) {
      toast.error('Failed to load products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (products: Product[], sortType: string) => {
    const sorted = [...products];
    switch (sortType) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        });
      default:
        return sorted;
    }
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      searchParams.set('category', categoryId.toString());
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Breadcrumb & Sort */}
      <div className="border-b border-purple-100 bg-white/60 backdrop-blur-xl sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <span className="text-gray-600">Home</span>
              <span className="text-gray-400"> / </span>
              <span className="text-purple-600 font-semibold">Products</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <span className="text-gray-600 text-sm font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-purple-200 rounded-xl px-4 py-2 pr-10 cursor-pointer hover:border-purple-400 transition-colors text-gray-700 font-medium shadow-sm"
                >
                  <option value="name">Alphabetically, A-Z</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-600 pointer-events-none" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleCategoryChange(null)}
                  className={`rounded-full whitespace-nowrap shadow-lg transition-all duration-300 ${
                    selectedCategory === null
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                      : 'bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400'
                  }`}
                >
                  All Products
                </Button>
              </motion.div>

              {categories.map((category, index) => (
                <motion.div
                  key={category.category_id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleCategoryChange(category.category_id)}
                    className={`rounded-full whitespace-nowrap shadow-lg transition-all duration-300 ${
                      selectedCategory === category.category_id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                        : 'bg-white border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-400'
                    }`}
                  >
                    {category.name}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {selectedCategory
              ? categories.find((c) => c.category_id === selectedCategory)?.name
              : 'All Products'}
          </h2>
          <p className="text-gray-600">{products.length} products available</p>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try selecting a different category</p>
            <Button
              onClick={() => handleCategoryChange(null)}
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              View All Products
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <motion.div
                  key={product.product_id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    type: 'spring',
                    stiffness: 100,
                  }}
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
