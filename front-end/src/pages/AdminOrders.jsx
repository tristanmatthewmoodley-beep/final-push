import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    search: '',
    status: '',
    paymentStatus: ''
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllOrders(filters);
      if (response.success) {
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Orders fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, statusData) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, statusData);
      if (response.success) {
        toast.success('Order status updated successfully');
        fetchOrders();
        setShowStatusModal(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Status update error:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-400" />;
      case 'processing':
        return <Package className="h-4 w-4 text-yellow-400" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-600 text-white';
      case 'shipped':
        return 'bg-blue-600 text-white';
      case 'processing':
        return 'bg-yellow-600 text-black';
      case 'cancelled':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const StatusUpdateModal = () => {
    const [newStatus, setNewStatus] = useState(selectedOrder?.status || '');
    const [trackingNumber, setTrackingNumber] = useState(selectedOrder?.trackingNumber || '');
    const [carrier, setCarrier] = useState(selectedOrder?.carrier || '');
    const [adminNotes, setAdminNotes] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleStatusUpdate(selectedOrder._id, {
        status: newStatus,
        trackingNumber,
        carrier,
        adminNotes
      });
    };

    if (!showStatusModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-car-gray rounded-lg p-6 w-full max-w-md border border-gray-700"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Update Order Status</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                required
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {(newStatus === 'shipped' || newStatus === 'delivered') && (
              <>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                    placeholder="Enter tracking number"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Carrier
                  </label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                    placeholder="Enter carrier name"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Admin Notes
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
                rows="3"
                placeholder="Add notes about this status change..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-car-red text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                Update Status
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-car-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Order Management</h1>
          <p className="text-gray-400">Manage and track all customer orders</p>
        </div>

        {/* Filters */}
        <div className="bg-car-gray rounded-lg p-6 border border-gray-700 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full bg-car-black border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white focus:outline-none focus:border-car-red"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value, page: 1 })}
              className="bg-car-black border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-car-red"
            >
              <option value="">All Payment Status</option>
              <option value="pending">Payment Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            <button
              onClick={() => setFilters({ page: 1, limit: 20, search: '', status: '', paymentStatus: '' })}
              className="bg-car-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-car-gray rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-car-red"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-car-black">
                  <tr>
                    <th className="text-left text-gray-400 py-4 px-6">Order #</th>
                    <th className="text-left text-gray-400 py-4 px-6">Customer</th>
                    <th className="text-left text-gray-400 py-4 px-6">Items</th>
                    <th className="text-left text-gray-400 py-4 px-6">Total</th>
                    <th className="text-left text-gray-400 py-4 px-6">Status</th>
                    <th className="text-left text-gray-400 py-4 px-6">Payment</th>
                    <th className="text-left text-gray-400 py-4 px-6">Date</th>
                    <th className="text-left text-gray-400 py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-4 px-6 text-white font-medium">{order.orderNumber}</td>
                      <td className="py-4 px-6 text-gray-300">{order.customerName}</td>
                      <td className="py-4 px-6 text-gray-300">{order.items?.length || 0} items</td>
                      <td className="py-4 px-6 text-white">{formatCurrency(order.total)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(order.status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid' ? 'bg-green-600 text-white' :
                          order.paymentStatus === 'failed' ? 'bg-red-600 text-white' :
                          'bg-yellow-600 text-black'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-300">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowStatusModal(true);
                            }}
                            className="text-car-red hover:text-red-400 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-car-black px-6 py-4 flex items-center justify-between">
              <div className="text-gray-400 text-sm">
                Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                {Math.min(pagination.currentPage * filters.limit, pagination.totalOrders)} of{' '}
                {pagination.totalOrders} orders
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
                  disabled={!pagination.hasPrevPage}
                  className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-gray-300">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
                  disabled={!pagination.hasNextPage}
                  className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <StatusUpdateModal />
    </div>
  );
};

export default AdminOrders;
