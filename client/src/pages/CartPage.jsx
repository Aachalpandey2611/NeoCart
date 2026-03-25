import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShield, FiCreditCard } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';
import { pageTransition, staggerContainer, staggerItem } from '../animations/variants';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const tax = cartTotal * 0.15;
  const shipping = cartTotal > 200 ? 0 : 25;
  const finalTotal = cartTotal + tax + shipping;

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-bg min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black mb-8">Shopping <span className="gradient-text">Cart</span></h1>
        
        {cartItems.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-dark rounded-3xl p-12 text-center border border-white/10 mt-12 shadow-2xl shadow-purple-900/10">
            <span className="text-6xl mb-6 inline-block">🛍️</span>
            <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8">Looks like you haven't found anything to add yet. Explore our collection of futuristic gear.</p>
            <Link to="/products" className="btn-primary">Start Shopping</Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-gray-400 text-sm font-medium">{cartItems.length} items</span>
                <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors flex items-center gap-1">
                  <FiTrash2 className="w-4 h-4" /> Clear Cart
                </button>
              </div>
              
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                    key={item._id}
                    className="glass rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 border-white/5 hover:border-purple-500/30 transition-colors bg-black/40 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Image */}
                    <Link to={`/products/${item._id}`} className="w-full sm:w-32 h-32 rounded-xl overflow-hidden glass mix-blend-screen bg-black/60 flex-shrink-0 relative z-10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 p-2" />
                    </Link>
                    
                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between relative z-10">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-xs text-purple-400 font-bold tracking-wider uppercase mb-1">{item.brand}</p>
                          <Link to={`/products/${item._id}`} className="text-lg font-bold text-white hover:text-purple-300 transition-colors line-clamp-2">
                            {item.name}
                          </Link>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                        <span className="text-xl font-black gradient-text">{formatCurrency(item.price)}</span>
                        
                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 glass-dark rounded-xl p-1 border border-white/10">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${item.quantity <= 1 ? 'text-gray-600' : 'text-white hover:bg-white/10'}`}
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center text-lg font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, Math.min(item.stock, item.quantity + 1))}
                            disabled={item.quantity >= item.stock}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${item.quantity >= item.stock ? 'text-gray-600' : 'text-white hover:bg-white/10'}`}
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="lg:col-span-1">
              <div className="glass-dark rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl shadow-purple-900/20 sticky top-24 bg-gradient-to-b from-white/[0.02] to-transparent">
                <h2 className="text-2xl font-bold mb-6 text-white text-center tracking-tight">Order Details</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-emerald-400 font-bold' : 'text-white font-medium'}>
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400">
                    <span>Est. Tax (15%)</span>
                    <span className="text-white font-medium">{formatCurrency(tax)}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 my-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-300">Total</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-primary py-4 text-lg font-bold shadow-[0_0_30px_rgba(124,58,237,0.4)] flex justify-center items-center gap-2 mb-6 hover:shadow-[0_0_50px_rgba(124,58,237,0.6)]"
                >
                  Checkout <FiArrowRight className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-2 gap-4 text-center mt-6 p-4 glass rounded-2xl border-white/5 bg-black/40">
                  <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <FiShield className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors border-l border-white/10 pl-4">
                    <FiCreditCard className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider">All Cards Accepted</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;
