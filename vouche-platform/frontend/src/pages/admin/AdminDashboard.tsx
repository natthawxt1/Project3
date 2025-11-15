import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  Tag,
  Gift,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Clock,
  ArrowRight,
  Calendar,
  Activity,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import adminService from '@/services/adminService';
import { toast } from 'sonner';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalGiftCodes: number;
  totalCategories: number;
}

interface RecentOrder {
  order_id: number;
  user_name: string;
  total_price: number;
  status: string;
  order_date: string;
  items_count: number;
}

const AdminDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalGiftCodes: 0,
    totalCategories: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [ordersData, productsData, giftCodesData, categoriesData] = await Promise.all([
        adminService.getOrders(),
        adminService.getProducts(),
        adminService.getGiftCodes({}),
        adminService.getCategories(),
      ]);

      // Calculate stats
      const orders = ordersData.orders || [];
      const products = productsData.products || [];
      const giftCodes = giftCodesData.gift_codes || [];
      const categories = categoriesData.categories || [];

      // Calculate revenue from paid orders
      const paidOrders = orders.filter((o: any) => o.status === 'paid');
      const totalRevenue = paidOrders.reduce(
        (sum: number, order: any) => sum + parseFloat(order.total_price),
        0
      );

      // Get unique customers
      const uniqueCustomers = new Set(orders.map((o: any) => o.user_id)).size;

      // Get recent orders (last 5)
      const recent = orders
        .sort((a: any, b: any) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
        .slice(0, 5);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: uniqueCustomers,
        totalGiftCodes: giftCodes.length,
        totalCategories: categories.length,
      });

      setRecentOrders(recent);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `฿${stats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 via-emerald-500 to-teal-600',
      lightColor: 'from-green-50 to-emerald-50',
      description: 'from paid orders',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 via-cyan-500 to-sky-600',
      lightColor: 'from-blue-50 to-cyan-50',
      description: 'all time orders',
    },
    {
      title: 'Products',
      value: stats.totalProducts.toString(),
      change: '+3',
      trend: 'up',
      icon: Package,
      color: 'from-purple-500 via-violet-500 to-pink-600',
      lightColor: 'from-purple-50 to-pink-50',
      description: 'active products',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers.toString(),
      change: '+18.3%',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 via-amber-500 to-yellow-600',
      lightColor: 'from-orange-50 to-yellow-50',
      description: 'registered users',
    },
  ];

  const quickActions = [
    {
      title: 'Product Management',
      description: 'Add, edit, or remove products',
      icon: Package,
      href: '/admin/products',
      color: 'from-purple-500 via-violet-500 to-pink-600',
      badge: `${stats.totalProducts} items`,
    },
    {
      title: 'Category Management',
      description: 'Manage product categories',
      icon: Tag,
      href: '/admin/categories',
      color: 'from-blue-500 via-cyan-500 to-sky-600',
      badge: `${stats.totalCategories} categories`,
    },
    {
      title: 'Order Management',
      description: 'View and process orders',
      icon: ShoppingCart,
      href: '/admin/orders',
      color: 'from-green-500 via-emerald-500 to-teal-600',
      badge: `${stats.totalOrders} orders`,
    },
    {
      title: 'Gift Code Management',
      description: 'Manage gift code inventory',
      icon: Gift,
      href: '/admin/gift-codes',
      color: 'from-orange-500 via-amber-500 to-yellow-600',
      badge: `${stats.totalGiftCodes} codes`,
    },
  ];

  const getStatusBadge = (status: string) => {
    const config: any = {
      pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
      paid: { label: 'Paid', color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700' },
      refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-700' },
    };
    const cfg = config[status] || config.pending;
    return <Badge className={`${cfg.color} border-0`}>{cfg.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="rounded-full h-20 w-20 border-4 border-purple-600 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* 🎨 Premium Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                </div>
                <p className="text-gray-600 text-lg ml-[60px]">
                  Welcome back! Here's what's happening with your store today.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-primary-100 to-pink-100 rounded-2xl">
                  <Clock className="h-5 w-5 text-primary-600" />
                  <div className="text-right">
                    <div className="text-sm font-semibold text-primary-700">
                      {currentTime.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-xs text-primary-600">
                      {currentTime.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 📊 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.lightColor} opacity-50`}></div>
                <div
                  className={`absolute -right-8 -top-8 w-40 h-40 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`}
                ></div>

                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge
                      className={`${
                        stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      } border-0`}
                    >
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </Badge>
                  </div>

                  <div className="text-sm font-medium text-gray-600 mb-2">{stat.title}</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary-600" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Link to={action.href}>
                      <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm overflow-hidden">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                        ></div>

                        <CardContent className="p-6 relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div
                              className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                            >
                              <action.icon className="h-7 w-7 text-white" />
                            </div>
                            <Badge className="bg-gray-100 text-gray-700 border-0">{action.badge}</Badge>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">{action.description}</p>

                          <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm group-hover:gap-4 transition-all">
                            <span>Manage</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Orders Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary-600" />
                Recent Orders
              </h2>
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order, index) => (
                        <motion.div
                          key={order.order_id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-gradient-to-br from-primary-100 to-pink-100">
                            <ShoppingCart className="h-4 w-4 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-bold text-gray-900">
                                Order #{order.order_id}
                              </p>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-xs text-gray-600">{order.user_name}</p>
                            <p className="text-sm font-semibold text-primary-600">
                              ฿{parseFloat(order.total_price.toString()).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.order_date).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No recent orders</p>
                      </div>
                    )}
                  </div>
                  

                  <Link to="/admin/orders">
                    <Button className="w-full mt-6 rounded-full bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 shadow-lg">
                      View All Orders
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
