import { motion } from 'framer-motion';

const Loader = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-20 h-20' };
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizes[size]}`}>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-500/20"
          style={{ borderTopColor: '#7c3aed' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-cyan-500/20"
          style={{ borderBottomColor: '#06b6d4' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-600/20" />
      </div>
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-sm text-gray-400 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center page-bg">
    <div className="text-center">
      <Loader size="lg" />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 gradient-text text-xl font-semibold"
      >
        NeoCart
      </motion.p>
    </div>
  </div>
);

export default Loader;
