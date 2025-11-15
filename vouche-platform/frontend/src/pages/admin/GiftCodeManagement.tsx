import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, Gift, Filter, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import adminService from '@/services/adminService';

interface GiftCode {
    gift_code_id: number;
    product_id: number;
    product_name: string;
    code: string;
    status: 'new' | 'active' | 'redeemed' | 'expired';
    order_id: number | null;
    created_at: string;
    redeemed_at: string | null;
}

interface Product {
    product_id: number;
    name: string;
}

const GiftCodeManagement = () => {
    const [giftCodes, setGiftCodes] = useState<GiftCode[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [productFilter, setProductFilter] = useState<string>('all');
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // ⭐ 1. เพิ่ม States ตรงนี้
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [bulkCodes, setBulkCodes] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, [statusFilter, productFilter]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [codesData, productsData] = await Promise.all([
                adminService.getGiftCodes({
                    status: statusFilter !== 'all' ? statusFilter : undefined,
                    product_id: productFilter !== 'all' ? productFilter : undefined,
                }),
                adminService.getProducts(),
            ]);
            setGiftCodes(codesData.gift_codes || []);
            setProducts(productsData.products || []);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load gift codes');
        } finally {
            setLoading(false);
        }
    };

    // ⭐ 2. เพิ่มฟังก์ชั่นนี้
    const handleBulkAddCodes = async () => {
        if (!selectedProductId || !bulkCodes.trim()) {
            toast.error('Please select a product and enter codes');
            return;
        }

        const codesArray = bulkCodes
            .split(/[\n,]/)
            .map((code) => code.trim())
            .filter((code) => code.length > 0);

        if (codesArray.length === 0) {
            toast.error('No valid codes entered');
            return;
        }

        try {
            setIsSubmitting(true);
            await adminService.bulkAddGiftCodes({
                product_id: parseInt(selectedProductId),
                codes: codesArray,
            });
            toast.success(`✅ Added ${codesArray.length} codes successfully!`);
            setIsAddModalOpen(false);
            setBulkCodes('');
            setSelectedProductId('');
            fetchData();
        } catch (error: any) {
            console.error('Bulk add error:', error);
            toast.error(error.response?.data?.message || 'Failed to add codes');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCopyCode = (code: string, id: number) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        toast.success('Code copied to clipboard!');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredCodes = giftCodes.filter(
        (code) =>
            code.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            code.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new':
                return 'bg-blue-100 text-blue-700';
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'redeemed':
                return 'bg-purple-100 text-purple-700';
            case 'expired':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const stats = {
        total: giftCodes.length,
        new: giftCodes.filter((c) => c.status === 'new').length,
        active: giftCodes.filter((c) => c.status === 'active').length,
        redeemed: giftCodes.filter((c) => c.status === 'redeemed').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <div className="container mx-auto px-4 py-8">
                {/* ⭐ 3. แก้ Header (เพิ่มปุ่ม Add Codes) */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/admin">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
                                Gift Code Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage gift code inventory</p>
                        </div>
                    </div>

                    {/* Add Codes Button */}
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                        <Gift className="mr-2 h-5 w-5" />
                        Add Codes
                    </Button>
                </div>

                {/* Stats Cards - 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Total Orders - ฟ้า */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-600 font-semibold">Total Codes</p>
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                                        <Gift className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-4xl font-black text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-500 mt-1">total inventory</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Available (New) - เขียว */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-0 shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-600 font-semibold">Available</p>
                                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-md">
                                        <Gift className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-4xl font-black text-gray-900">{stats.new}</p>
                                <p className="text-xs text-gray-500 mt-1">ready to sell</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Active (Sold) - เหลือง */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-0 shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-gray-600 font-semibold">Active</p>
                                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-md">
                                        <Gift className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <p className="text-4xl font-black text-gray-900">{stats.active}</p>
                                <p className="text-xs text-gray-500 mt-1">in orders</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by code or product..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-12 rounded-xl"
                                />
                            </div>

                            <select
                                value={productFilter}
                                onChange={(e) => setProductFilter(e.target.value)}
                                className="h-12 px-4 rounded-xl border border-gray-300 bg-white"
                            >
                                <option value="all">All Products</option>
                                {products.map((product) => (
                                    <option key={product.product_id} value={product.product_id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>

                            <div className="flex gap-2">
                                {['all', 'new', 'active', 'redeemed', 'expired'].map((status) => (
                                    <Button
                                        key={status}
                                        onClick={() => setStatusFilter(status)}
                                        variant={statusFilter === status ? 'default' : 'outline'}
                                        size="sm"
                                        className="rounded-full capitalize"
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Gift Codes Table */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                    </div>
                ) : filteredCodes.length === 0 ? (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No gift codes found</h3>
                            <p className="text-gray-600">
                                {searchQuery ? 'Try adjusting your search' : 'No gift codes available'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Code</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {filteredCodes.map((code, index) => (
                                                <motion.tr
                                                    key={code.gift_code_id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="border-b hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="font-mono text-sm">#{code.gift_code_id}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-semibold text-gray-900">{code.product_name}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                                                                {code.code}
                                                            </code>
                                                            <button
                                                                onClick={() => handleCopyCode(code.code, code.gift_code_id)}
                                                                className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                            >
                                                                {copiedId === code.gift_code_id ? (
                                                                    <Check className="h-4 w-4 text-green-600" />
                                                                ) : (
                                                                    <Copy className="h-4 w-4 text-gray-600" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Badge className={`${getStatusColor(code.status)} capitalize`}>
                                                            {code.status}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {code.order_id ? (
                                                            <span className="font-mono text-sm">#{code.order_id}</span>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {new Date(code.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Button
                                                            onClick={() => handleCopyCode(code.code, code.gift_code_id)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-lg"
                                                        >
                                                            <Copy className="h-4 w-4 mr-1" />
                                                            Copy
                                                        </Button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* ⭐ 4. เพิ่ม Modal ตรงนี้ (ก่อนปิด </div> สุดท้าย) */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-3xl font-bold text-gray-900">Add Gift Codes</h2>
                                            <p className="text-gray-600 mt-1">
                                                Add multiple codes at once (one per line or comma-separated)
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsAddModalOpen(false)}
                                            className="rounded-full"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </Button>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Select Product <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={selectedProductId}
                                            onChange={(e) => setSelectedProductId(e.target.value)}
                                            className="w-full h-12 px-4 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                                        >
                                            <option value="">Choose a product...</option>
                                            {products.map((product) => (
                                                <option key={product.product_id} value={product.product_id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Gift Codes <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={bulkCodes}
                                            onChange={(e) => setBulkCodes(e.target.value)}
                                            placeholder="Enter codes (one per line or comma-separated)&#10;Example:&#10;ABC123DEF456&#10;XYZ789GHI012&#10;or: ABC123DEF456, XYZ789GHI012"
                                            rows={12}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all font-mono text-sm resize-none"
                                        />
                                        <p className="text-sm text-gray-600 mt-2">
                                            {bulkCodes.split(/[\n,]/).filter((c) => c.trim()).length} codes entered
                                        </p>
                                    </div>

                                    <div className="flex gap-4">
                                        <Button
                                            onClick={() => setIsAddModalOpen(false)}
                                            variant="outline"
                                            className="flex-1 h-12 rounded-xl"
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleBulkAddCodes}
                                            disabled={isSubmitting || !selectedProductId || !bulkCodes.trim()}
                                            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <Gift className="mr-2 h-5 w-5" />
                                                    Add Codes
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GiftCodeManagement;
