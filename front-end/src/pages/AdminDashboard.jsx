import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Eye
} from 'lucide-react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
      console.error('Dashboard stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-car-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-car-red"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-car-gray rounded-lg p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {change >= 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-car-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats?.overview?.totalRevenue || 0)}
            icon={DollarSign}
            color="bg-green-600"
          />
          <StatCard
            title="Total Orders"
            value={stats?.overview?.totalOrders || 0}
            icon={ShoppingCart}
            color="bg-blue-600"
          />
          <StatCard
            title="Total Products"
            value={stats?.overview?.totalProducts || 0}
            icon={Package}
            color="bg-purple-600"
          />
          <StatCard
            title="Total Users"
            value={stats?.overview?.totalUsers || 0}
            icon={Users}
            color="bg-car-red"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Pending Orders"
            value={stats?.overview?.pendingOrders || 0}
            icon={AlertTriangle}
            color="bg-yellow-600"
          />
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(stats?.overview?.monthlyRevenue || 0)}
            icon={TrendingUp}
            color="bg-green-600"
          />
          <StatCard
            title="Low Stock Items"
            value={stats?.overview?.lowStockProducts || 0}
            icon={Package}
            color="bg-red-600"
          />
        </div>

        {/* Charts and Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Order Status Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-car-gray rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Order Status</h3>
            <div className="space-y-3">
              {stats?.orderStatusStats?.map((status, index) => (
                <div key={status._id} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{status._id}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{status.count}</span>
                    <span className="text-gray-400 text-sm">
                      ({formatCurrency(status.totalValue)})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-car-gray rounded-lg p-6 border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Top Selling Products</h3>
            <div className="space-y-3">
              {stats?.topProducts?.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium truncate">{product.name}</p>
                    <p className="text-gray-400 text-sm">
                      {product.totalSold} sold • {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-car-gray rounded-lg p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Recent Orders</h3>
            <button className="text-car-red hover:text-red-400 transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left text-gray-400 py-3">Order #</th>
                  <th className="text-left text-gray-400 py-3">Customer</th>
                  <th className="text-left text-gray-400 py-3">Total</th>
                  <th className="text-left text-gray-400 py-3">Status</th>
                  <th className="text-left text-gray-400 py-3">Date</th>
                  <th className="text-left text-gray-400 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map((order) => (
                  <tr key={order._id} className="border-b border-gray-700">
                    <td className="py-3 text-white font-medium">{order.orderNumber}</td>
                    <td className="py-3 text-gray-300">{order.customerName}</td>
                    <td className="py-3 text-white">{formatCurrency(order.total)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-green-600 text-white' :
                        order.status === 'shipped' ? 'bg-blue-600 text-white' :
                        order.status === 'processing' ? 'bg-yellow-600 text-black' :
                        'bg-gray-600 text-white'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <button className="text-car-red hover:text-red-400 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
