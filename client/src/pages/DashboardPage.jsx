import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiMail, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/orderService';
import { formatCurrency } from '../utils/helpers';
import Loader from '../components/Loader';
import { pageTransition, staggerContainer, staggerItem, slideUp } from '../animations/variants';

const DashboardPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
    window.scrollTo(0, 0);
  }, [user]);

  if (!user) return <div className="min-h-screen page-bg pt-32 text-center text-white text-2xl">Please login to view dashboard.</div>;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-bg min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar / Profile Card */}
          <motion.div variants={slideUp} initial="hidden" animate="visible" className="w-full md:w-1/3 lg:w-1/4">
            <div className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl sticky top-24 pb-12 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-black text-4xl text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] mb-6 border-4 border-black border-opacity-50 relative group cursor-pointer overflow-hidden">
                <span className="relative z-10">{user.name[0].toUpperCase()}</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">{user.name}</h2>
              <p className="text-gray-400 text-sm flex items-center gap-2 mb-6 bg-white/5 py-1.5 px-3 rounded-full border border-white/10"><FiMail /> {user.email}</p>
              
              <div className="w-full space-y-3 mt-4 pt-8 border-t border-white/10">
                <button className="w-full py-3 px-4 glass rounded-xl flex items-center justify-between text-sm font-medium hover:bg-white/10 transition-colors text-white border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-transparent">
                  <span className="flex items-center gap-3"><FiUser className="text-purple-400" /> Account Details</span>
                </button>
                <button className="w-full py-3 px-4 glass rounded-xl flex items-center justify-between text-sm font-medium hover:bg-white/10 transition-colors text-gray-400">
                  <span className="flex items-center gap-3"><FiPackage className="text-cyan-400" /> My Orders</span>
                  <span className="bg-white/10 text-white px-2 py-0.5 rounded text-xs">{orders.length}</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Main Content - Orders */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl font-black mb-8 flex items-center gap-3">Order <span className="gradient-text">History</span></h1>
            
            {loading ? (
              <div className="py-20 flex justify-center"><Loader size="md" /></div>
            ) : orders.length === 0 ? (
              <motion.div variants={slideUp} initial="hidden" animate="visible" className="glass rounded-3xl p-12 text-center border-white/5">
                <FiPackage className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl text-white font-bold mb-2">No orders yet</h3>
                <p className="text-gray-500">When you purchase items, they will appear here.</p>
              </motion.div>
            ) : (
              <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                {orders.map((order) => (
                  <motion.div key={order._id} variants={staggerItem} className="glass-dark rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] overflow-hidden relative group">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-white/10 pb-4 mb-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Order ID</p>
                        <p className="text-gray-300 font-mono text-sm">#{order._id.substring(10).toUpperCase()}</p>
                      </div>
                      <div>
                         <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1"><FiCalendar /> Date</p>
                         <p className="text-gray-300 font-medium text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="md:text-right">
                         <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                         <p className="text-xl font-bold text-white gradient-text">{formatCurrency(order.totalPrice)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/5">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-contain bg-white/5" />
                            <div className="flex-1">
                              <Link to={`/products/${item.product}`} className="text-sm font-medium text-white hover:text-purple-400 line-clamp-1">{item.name}</Link>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-bold text-purple-300">{formatCurrency(item.price)}</p>
                          </div>
                        ))}
                      </div>

                      <div className="w-full md:w-48 flex flex-col gap-3 justify-center border-l-0 md:border-l border-white/10 pt-4 md:pt-0 pl-0 md:pl-6">
                         <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                           <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Status</p>
                           <div className={`flex items-center gap-2 text-sm font-bold ${
                             order.status === 'Delivered' ? 'text-emerald-400' :
                             order.status === 'Shipped' ? 'text-blue-400' :
                             'text-amber-400'
                           }`}>
                             {order.status === 'Delivered' ? <FiCheckCircle /> : <FiClock />} {order.status}
                           </div>
                         </div>
                         <button className="btn-secondary w-full text-xs py-2">Track Order</button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
