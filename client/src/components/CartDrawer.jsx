import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/helpers';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-b from-gray-900 to-black border-l border-white/10 shadow-2xl z-[110] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 glass-dark">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FiShoppingBag className="text-purple-400" />
                <span className="gradient-text">Your Cart</span>
                <span className="text-sm bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full ml-2">
                  {cartItems.length}
                </span>
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <div className="w-24 h-24 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                    <FiShoppingBag className="w-10 h-10 text-purple-400 opacity-50" />
                  </div>
                  <p className="text-xl font-medium text-white mb-2">Your cart is empty</p>
                  <p className="text-sm mb-6">Looks like you haven't added anything yet.</p>
                  <button onClick={onClose} className="btn-secondary">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring' }}
                      key={item._id}
                      className="glass rounded-xl p-4 flex gap-4 group hover:border-purple-500/30 transition-colors relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/40 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between relative z-10">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-medium text-white text-sm line-clamp-2 pr-6">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-gray-500 hover:text-red-400 transition-colors absolute -right-2 -top-2 p-2"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-purple-400">
                            {formatCurrency(item.price)}
                          </span>
                          <div className="flex items-center gap-2 glass rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-1 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white pt-1 pb-1"
                            >
                              <FiPlus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 glass-dark bg-gradient-to-t from-black to-transparent">
                <div className="flex justify-between items-center mb-4 text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-medium">Total</span>
                  <span className="text-2xl font-bold gradient-text">{formatCurrency(cartTotal)}</span>
                </div>
                <Link to="/checkout" onClick={onClose} className="block w-full">
                  <button className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 shadow-2xl shadow-purple-600/30">
                    Proceed to Checkout
                  </button>
                </Link>
                <Link to="/cart" onClick={onClose} className="block text-center mt-4">
                  <span className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    View Cart Page
                  </span>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
