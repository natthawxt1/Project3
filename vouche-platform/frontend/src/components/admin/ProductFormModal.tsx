import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import adminService from '@/services/adminService';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  product: any | null;
}

const ProductFormModal = ({ isOpen, onClose, onSave, product }: ProductFormModalProps) => {
  // -------------------------
  // State
  // -------------------------
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    description: '',
    gift_codes: '',
  });

  // -------------------------
  // Load categories & product data when modal opens
  // -------------------------
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (product) {
        // Edit product
        setFormData({
          name: product.name,
          category_id: product.category_id.toString(),
          price: product.price.toString(),
          description: product.description || '',
          gift_codes: '',
        });
        setImagePreview(product.image_url || '');
        setImageFile(null);
      } else {
        // Create product
        setFormData({
          name: '',
          category_id: '',
          price: '',
          description: '',
          gift_codes: '',
        });
        setImagePreview('');
        setImageFile(null);
      }
    }
  }, [isOpen, product]);

  const fetchCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  // -------------------------
  // Image upload handlers
  // -------------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // -------------------------
  // Submit handler
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category_id', formData.category_id);
      submitData.append('price', formData.price);
      submitData.append('description', formData.description);

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (formData.gift_codes) {
        const codes = formData.gift_codes
          .split('\n')
          .map((code) => code.trim())
          .filter((code) => code.length > 0);
        submitData.append('gift_codes', JSON.stringify(codes));
      }

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // -------------------------
  // Render modal
  // -------------------------
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
          className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Steam Gift Card $50"
                    required
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category" className="text-sm font-semibold">
                    Category *
                  </Label>
                  <select
                    id="category"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    className="mt-2 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <Label htmlFor="price" className="text-sm font-semibold">
                    Price (฿) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                    className="mt-2 h-12 rounded-xl"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product..."
                    rows={4}
                    className="mt-2 rounded-xl"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Product Image</Label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-2xl p-6 transition-all cursor-pointer ${
                      isDragging
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-contain rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <p className="text-white font-semibold">Click or drag to change</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-700 font-semibold mb-2">
                          {isDragging ? 'Drop the image here' : 'Drag & drop image here'}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                          <Upload className="h-4 w-4" />
                          Choose File
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported: PNG, JPG, JPEG, GIF, WebP (Max 5MB)
                  </p>
                </div>

                {/* Gift Codes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="gift_codes" className="text-sm font-semibold">
                      {product ? 'Add More Gift Codes' : 'Gift Codes *'}
                    </Label>
                    <span className="text-xs text-primary-600 font-semibold">
                      {formData.gift_codes.split('\n').filter((c) => c.trim()).length} codes
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {product
                      ? '✨ Enter new codes to add to inventory (one per line)'
                      : 'Enter codes (one per line)'}
                  </p>
                  <Textarea
                    id="gift_codes"
                    value={formData.gift_codes}
                    onChange={(e) => setFormData({ ...formData, gift_codes: e.target.value })}
                    placeholder="CODE1-XXXX-XXXX&#10;CODE2-YYYY-YYYY&#10;CODE3-ZZZZ-ZZZZ"
                    rows={10}
                    required={!product}
                    className="mt-2 rounded-xl font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="rounded-full"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="rounded-full bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {product ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductFormModal;
