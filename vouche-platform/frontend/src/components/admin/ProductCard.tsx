import React, { useState } from 'react';
import { Edit, Trash2, Package } from 'lucide-react';

interface Product {
  product_id: number;
  name: string;
  category_name: string;
  price: number;
  image_url: string | null;
  stock: number;
  is_active: boolean;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  // 🔥 Smart Image URL Handler
  const getImageUrl = () => {
    const imageUrl = product.image_url;
    
    if (!imageUrl) return null;
    
    // External URL (Unsplash, etc.)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Local path - เพิ่ม backend URL
    return `http://localhost:5000${imageUrl}`;
  };

  const finalImageUrl = getImageUrl();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
        {finalImageUrl && !imageError ? (
          <img 
            src={finalImageUrl} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => {
              console.error('❌ Image failed to load:', finalImageUrl);
              setImageError(true);
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', finalImageUrl);
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            🎁
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
          product.is_active 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {product.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full mb-3">
          {product.category_name}
        </span>

        {/* Name */}
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>

        {/* Price & Stock */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
          <div className="text-2xl font-bold text-purple-600">
            ฿{product.price.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package size={16} />
            <span className="font-semibold">{product.stock}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
          >
            <Edit size={16} />
            Edit
          </button>
          <button 
            onClick={() => onDelete(product.product_id)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-semibold transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
