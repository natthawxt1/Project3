import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Search,
  Filter,
  Eye,
  RefreshCw,
  User,
  TrendingUp,
  AlertCircle,
  XCircle,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';
import adminService from '@/services/adminService';
import { toast } from 'sonner';

interface Order {
  order_id: number;
  user_id: number;
  user_name: string;
  email: string;
  total_price: number;
  status: string;
  order_date: string;
  items_count: number;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (orderId: number) => {
    setSelectedOrder(orderId);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus);
      toast.success('✅ Order status updated!');
      fetchOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('❌ Failed to update status');
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_id.toString().includes(searchQuery) ||
      (order.user_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.email || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status === 'paid').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
    revenue: orders
      .filter((o) => o.status === 'paid')
      .reduce((sum, o) => sum + parseFloat(o.total_price.toString()), 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-blue-500 rounded-3xl flex items-center justify-center shadow-lg">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-gray-900">Order Management</h1>
              <p className="text-gray-600 text-lg mt-1">Manage and track customer orders</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - สีอ่อนแบบ Pastel */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          {/* Total Orders - สีฟ้าอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-semibold">Total Orders</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-black text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500 mt-1">vs last month</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Paid - สีเขียวอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-semibold">Paid</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-md">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-black text-gray-900">{stats.paid}</p>
                <p className="text-xs text-gray-500 mt-1">completed orders</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending - สีเหลืองอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-semibold">Pending</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-md">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-black text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-500 mt-1">awaiting payment</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cancelled - สีชมพูอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-semibold">Cancelled</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-4xl font-black text-gray-900">{stats.cancelled}</p>
                <p className="text-xs text-gray-500 mt-1">cancelled orders</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenue - สีม่วงอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 font-semibold">Revenue</p>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-md">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-900">
                  ฿{stats.revenue.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">total earnings</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search by Order ID, Customer Name, or Email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-bold text-blue-600">{filteredOrders.length}</span> of{' '}
                  <span className="font-bold">{orders.length}</span> orders
                </p>
                <Button
                  onClick={fetchOrders}
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 rounded-xl"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white border-0 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Total</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
                          <p className="text-gray-500">Loading orders...</p>
                        </td>
                      </motion.tr>
                    ) : filteredOrders.length > 0 ? (
                      filteredOrders.map((order, index) => (
                        <motion.tr
                          key={order.order_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="text-lg font-black text-blue-600">
                              #{order.order_id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">
                                  {order.user_name || 'Customer'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(order.order_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-lg font-black text-gray-900">
                              ฿{parseFloat(order.total_price.toString()).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge className="bg-purple-600 text-white border-0 text-base px-4 py-1">
                              {order.items_count || 0}
                            </Badge>
                          </td>

                          {/* Status Dropdown */}
                          <td className="px-6 py-4">
                            <div className="relative inline-block">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                                className="px-4 py-2 pr-8 rounded-xl font-bold border-0 shadow-md cursor-pointer hover:shadow-lg transition-all text-white appearance-none"
                                style={{
                                  background:
                                    order.status === 'paid'
                                      ? 'linear-gradient(to right, #10b981, #059669)'
                                      : order.status === 'pending'
                                      ? 'linear-gradient(to right, #f59e0b, #f97316)'
                                      : order.status === 'cancelled'
                                      ? 'linear-gradient(to right, #ef4444, #ec4899)'
                                      : 'linear-gradient(to right, #6b7280, #64748b)',
                                }}
                              >
                                <option value="pending" style={{ backgroundColor: '#fff', color: '#000' }}>
                                  Pending
                                </option>
                                <option value="paid" style={{ backgroundColor: '#fff', color: '#000' }}>
                                  Paid
                                </option>
                                <option value="cancelled" style={{ backgroundColor: '#fff', color: '#000' }}>
                                  Cancelled
                                </option>
                                <option value="refunded" style={{ backgroundColor: '#fff', color: '#000' }}>
                                  Refunded
                                </option>
                              </select>
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <Button
                              onClick={() => handleViewDetails(order.order_id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-xl font-bold text-gray-900 mb-2">No orders found</p>
                          <p className="text-gray-500">Try adjusting your search or filters</p>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrder(null);
        }}
        orderId={selectedOrder}
      />
    </div>
  );
};

export default OrderManagement;
