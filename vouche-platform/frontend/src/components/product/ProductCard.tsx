import { useState } from 'react';
import { Product } from '@/types';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCard = ({ product, index }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const isOutOfStock = product.stock === 0;

  return (
    <Link to={`/product/${product.product_id}`}>
      <motion.div
        whileHover={{ y: -12, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
      >
        {/* 🆕 New Badge */}
        {index < 2 && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="absolute top-4 left-4 z-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md"
          >
            NEW
          </motion.div>
        )}

        {/* 🖼️ Image Container */}
        <div className="relative aspect-square p-8 bg-gradient-to-br from-purple-50 to-pink-50">
          {/* Product Image */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            ) : (
              <div className="text-8xl drop-shadow-2xl">🎁</div>
            )}
          </motion.div>

          {/* ❤️ Favorite Icon */}
          <div className="absolute top-4 right-4">
            <motion.button
              whileHover={{ scale: 1.2, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={`p-2.5 rounded-full backdrop-blur-xl transition-all shadow-lg ${
                isLiked
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/80 text-pink-500 hover:bg-pink-50'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* 🧾 Content */}
        <div className="p-6">
          {/* Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-3"
          >
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-primary-700">
              {product.category_name}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem] text-gray-900 group-hover:text-primary-600 transition-colors"
          >
            {product.name}
          </motion.h3>

          {/* Description */}
          {product.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm line-clamp-2 mb-4 text-gray-600"
            >
              {product.description}
            </motion.p>
          )}

          {/* Price */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="text-3xl font-bold text-primary-600">
              ฿{product.price.toLocaleString()}
            </div>
            {index % 3 === 0 && (
              <div className="text-lg line-through text-gray-400">
                ฿{Math.round(product.price * 1.3).toLocaleString()}
              </div>
            )}
          </motion.div>
        </div>

        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400/0 to-pink-400/0 group-hover:from-primary-400/10 group-hover:to-pink-400/10 transition-all duration-500 pointer-events-none"></div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
