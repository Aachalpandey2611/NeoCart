import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiPackage } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const OrderSuccessModal = ({ isOpen, onClose, orderId }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative glass-dark w-full max-w-lg rounded-[2.5rem] p-12 text-center border border-white/10 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
      >
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8 border border-emerald-500/30">
          <FiCheck className="w-12 h-12 text-emerald-400" />
        </div>
        
        <h2 className="text-4xl font-black text-white mb-2 italic uppercase">Success!</h2>
        <p className="text-gray-400 mb-8 font-medium">Your futuristic gear is being prepared for hyper-speed delivery.</p>
        
        <div className="bg-white/5 rounded-2xl p-4 mb-10 border border-white/5 inline-block mx-auto">
           <span className="text-xs text-gray-500 uppercase font-bold tracking-widest block mb-1">Order ID</span>
           <span className="text-white font-mono text-sm tracking-tighter">#{orderId?.substring(10).toUpperCase()}</span>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary py-4 flex items-center justify-center gap-2 shadow-emerald-500/20 hover:shadow-emerald-500/40"
          >
            Track Order <FiPackage />
          </button>
          <button
            onClick={() => navigate('/products')}
            className="text-gray-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
          >
            Continue Shopping <FiArrowRight />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessModal;
