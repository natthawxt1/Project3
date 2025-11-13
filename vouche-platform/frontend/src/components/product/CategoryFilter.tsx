import { Category } from '@/types';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

// Category icons (เพิ่ม emoji หรือ icon ตรงนี้)
const categoryIcons: Record<string, string> = {
  'Game Top-Up': '🎮',
  'Streaming': '🎬',
  'E-Commerce': '🛒',
  'Subscription': '⭐',
  'Gift Cards': '🎁',
  'Gaming': '🎯',
  'Entertainment': '🎪',
};

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {/* All Categories */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(null)}
          className={`flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
            selectedCategory === null
              ? 'bg-primary-600 text-white shadow-apple-lg'
              : 'bg-white hover:bg-primary-50 shadow-apple'
          }`}
        >
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl ${
              selectedCategory === null
                ? 'bg-white/20'
                : 'bg-primary-100'
            }`}
          >
            🌟
          </div>
          <span className="font-semibold text-sm">All</span>
        </motion.button>

        {/* Category Items */}
        {categories.map((category) => (
          <motion.button
            key={category.category_id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category.category_id)}
            className={`flex-shrink-0 flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 ${
              selectedCategory === category.category_id
                ? 'bg-primary-600 text-white shadow-apple-lg'
                : 'bg-white hover:bg-primary-50 shadow-apple'
            }`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl ${
                selectedCategory === category.category_id
                  ? 'bg-white/20'
                  : 'bg-primary-100'
              }`}
            >
              {categoryIcons[category.name] || '📦'}
            </div>
            <span className="font-semibold text-sm">{category.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
