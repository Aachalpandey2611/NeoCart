import { motion } from 'framer-motion';
import { FiCreditCard } from 'react-icons/fi';

const CreditCard = ({ name, number, expiry, cvc }) => {
  return (
    <motion.div
      initial={{ rotateY: 30, scale: 0.9, opacity: 0 }}
      animate={{ rotateY: 0, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 15 }}
      style={{ perspective: 1000 }}
      className="w-full max-w-sm aspect-[1.6/1] rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl bg-gradient-to-br from-purple-600 via-blue-700 to-indigo-900 border border-white/20"
    >
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
      
      {/* Background patterns */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl" />

      <div className="flex justify-between items-start relative z-10">
        <div className="w-12 h-10 bg-yellow-500/80 rounded-lg shadow-inner flex flex-col gap-1 p-1">
           <div className="h-px w-full bg-black/20" />
           <div className="h-px w-full bg-black/20" />
           <div className="h-px w-full bg-black/20" />
        </div>
        <FiCreditCard className="w-10 h-10 text-white/50" />
      </div>

      <div className="relative z-10">
        <p className="text-white text-2xl font-mono tracking-widest mb-6">
          {number || '•••• •••• •••• ••••'}
        </p>
        <div className="flex justify-between items-end">
          <div className="flex-1">
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-tighter mb-0.5">Card Holder</p>
            <p className="text-white text-sm font-bold uppercase truncate pr-4">{name || 'Your Name'}</p>
          </div>
          <div className="text-right">
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-tighter mb-0.5">Expires</p>
            <p className="text-white text-sm font-bold">{expiry || 'MM/YY'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CreditCard;
