import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Package, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import ProductFormModal from '@/components/admin/ProductFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import adminService from '@/services/adminService';

interface Product {
  product_id: number;
  name: string;
  category_id: number;
  category_name: string;
  price: number;
  description: string;
  image_url: string;
  stock: number;
  is_active: boolean;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProducts();
      setProducts(data.products);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await adminService.deleteProduct(productToDelete.product_id);
      toast.success('Product deleted successfully');
      fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  };

  const handleSaveProduct = async (data: any) => {
    try {
      if (selectedProduct) {
        await adminService.updateProduct(selectedProduct.product_id, data);
        toast.success('Product updated successfully');
      } else {
        await adminService.createProduct(data);
        toast.success('Product created successfully');
      }
      fetchProducts();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save product');
      throw error;
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen">
      <div className="mx-auto px-4 py-8 container">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600 font-bold text-transparent text-4xl">
                Product Management
              </h1>
              <p className="mt-1 text-gray-600">
                Manage your product catalog and inventory
              </p>
            </div>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-primary-600 hover:from-primary-700 to-violet-600 hover:to-violet-700 shadow-lg rounded-full"
          >
            <Plus className="mr-2 w-5 h-5" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="top-1/2 left-4 absolute w-5 h-5 text-gray-400 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 rounded-xl h-12"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="border-4 border-primary-600 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <Package className="mx-auto mb-4 w-16 h-16 text-gray-400" />
              <h3 className="mb-2 font-semibold text-gray-900 text-xl">
                No products found
              </h3>
              <p className="mb-6 text-gray-600">
                {searchQuery ? 'Try adjusting your search' : 'Get started by adding your first product'}
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-full"
                >
                  <Plus className="mr-2 w-5 h-5" />
                  Add Product
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.product_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl overflow-hidden transition-shadow">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 aspect-square">
                      {product.image_url ? (
                        <img
                          src={
                            product.image_url.startsWith('http')
                              ? product.image_url
                              : `http://localhost:5000${product.image_url}`
                          }
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-full h-full text-6xl">
                          🎁
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2">
                        <span className="bg-primary-100 px-2 py-1 rounded-full font-semibold text-primary-700 text-xs">
                          {product.category_name}
                        </span>
                      </div>
                      <h3 className="mb-1 font-bold text-lg line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="mb-3 text-gray-600 text-sm line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="font-bold text-primary-600 text-2xl">
                            ฿{product.price.toLocaleString()}
                          </div>
                          <div className="text-gray-600 text-sm">
                            Stock: {product.stock}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.is_active ? 'Active' : 'Inactive'}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-lg"
                        >
                          <Edit className="mr-1 w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(product)}
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-red-50 rounded-lg text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="mr-1 w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default ProductManagement;