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
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';
import adminService from '@/services/adminService';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            {/* Navigate back */}
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex justify-center items-center bg-blue-500 shadow-lg rounded-3xl w-16 h-16">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-black text-gray-900 text-5xl">Order Management</h1>
              <p className="mt-1 text-gray-600 text-lg">Manage and track customer orders</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - สีอ่อนแบบ Pastel */}
        <div className="gap-4 grid grid-cols-1 md:grid-cols-5 mb-8">
          {/* Total Orders - สีฟ้าอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg hover:shadow-xl border-0 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-600 text-sm">Total Orders</p>
                  <div className="flex justify-center items-center bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md rounded-2xl w-12 h-12">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="font-black text-gray-900 text-4xl">{stats.total}</p>
                <p className="mt-1 text-gray-500 text-xs">vs last month</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Paid - สีเขียวอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg hover:shadow-xl border-0 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-600 text-sm">Paid</p>
                  <div className="flex justify-center items-center bg-gradient-to-br from-emerald-500 to-green-500 shadow-md rounded-2xl w-12 h-12">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="font-black text-gray-900 text-4xl">{stats.paid}</p>
                <p className="mt-1 text-gray-500 text-xs">completed orders</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pending - สีเหลืองอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg hover:shadow-xl border-0 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-600 text-sm">Pending</p>
                  <div className="flex justify-center items-center bg-gradient-to-br from-amber-500 to-yellow-500 shadow-md rounded-2xl w-12 h-12">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="font-black text-gray-900 text-4xl">{stats.pending}</p>
                <p className="mt-1 text-gray-500 text-xs">awaiting payment</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cancelled - สีชมพูอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg hover:shadow-xl border-0 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-600 text-sm">Cancelled</p>
                  <div className="flex justify-center items-center bg-gradient-to-br from-rose-500 to-pink-500 shadow-md rounded-2xl w-12 h-12">
                    <XCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="font-black text-gray-900 text-4xl">{stats.cancelled}</p>
                <p className="mt-1 text-gray-500 text-xs">cancelled orders</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Revenue - สีม่วงอ่อน */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 shadow-lg hover:shadow-xl border-0 transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-gray-600 text-sm">Revenue</p>
                  <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-violet-500 shadow-md rounded-2xl w-12 h-12">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="font-black text-gray-900 text-3xl">
                  ฿{stats.revenue.toLocaleString()}
                </p>
                <p className="mt-1 text-gray-500 text-xs">total earnings</p>
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
          <Card className="bg-white shadow-lg mb-6 border-0">
            <CardContent className="p-6">
              <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="top-1/2 left-4 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
                    <Input
                      type="text"
                      placeholder="Search by Order ID, Customer Name, or Email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-200 h-12"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Filter className="top-1/2 left-4 absolute w-5 h-5 text-gray-400 -translate-y-1/2 pointer-events-none transform" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white pr-4 pl-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-200 w-full h-12 transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-gray-600 text-sm">
                  Showing <span className="font-bold text-blue-600">{filteredOrders.length}</span> of{' '}
                  <span className="font-bold">{orders.length}</span> orders
                </p>
                <Button
                  onClick={fetchOrders}
                  variant="outline"
                  className="hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 rounded-xl"
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
          <Card className="bg-white shadow-lg border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-cyan-600">
                  <tr>
                    <th className="px-6 py-4 font-bold text-white text-sm text-left">Order ID</th>
                    <th className="px-6 py-4 font-bold text-white text-sm text-left">Customer</th>
                    <th className="px-6 py-4 font-bold text-white text-sm text-left">Date</th>
                    <th className="px-6 py-4 font-bold text-white text-sm text-left">Total</th>
                    <th className="px-6 py-4 font-bold text-white text-sm text-center">Items</th>
                    <th className="px-6 py-4 font-bold text-white text-sm text-left">Status</th>
                    <th className="px-6 py-4 font-bold text-white text-sm text-center">Actions</th>
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
                          <RefreshCw className="mx-auto mb-2 w-8 h-8 text-blue-500 animate-spin" />
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
                          className="hover:bg-gray-50 border-gray-100 border-b transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-black text-blue-600 text-lg">
                              #{order.order_id}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex justify-center items-center bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-10 h-10">
                                <User className="w-5 h-5 text-white" />
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
                            <span className="font-black text-gray-900 text-lg">
                              ฿{parseFloat(order.total_price.toString()).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge className="bg-purple-600 px-4 py-1 border-0 text-white text-base">
                              {order.items_count || 0}
                            </Badge>
                          </td>

                          {/* Status Dropdown */}
                          <td className="px-6 py-4">
                            <div className="inline-block relative">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                                className="shadow-md hover:shadow-lg px-4 py-2 pr-8 border-0 rounded-xl font-bold text-white transition-all appearance-none cursor-pointer"
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
                              <div className="top-1/2 right-2 absolute -translate-y-1/2 pointer-events-none transform">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center">
                            <Button
                              onClick={() => handleViewDetails(order.order_id)}
                              className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg rounded-xl text-white transition-all"
                              size="sm"
                            >
                              <Eye className="mr-2 w-4 h-4" />
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
                          <Package className="mx-auto mb-4 w-16 h-16 text-gray-400" />
                          <p className="mb-2 font-bold text-gray-900 text-xl">No orders found</p>
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
