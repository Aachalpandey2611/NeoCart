import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { slideUp, fadeIn, staggerContainer, staggerItem } from '../animations/variants';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 flex-col">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <div className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-blue-600 rounded-full blur-[100px] mix-blend-screen opacity-40 -translate-x-1/2 translate-y-1/4 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[80px] mix-blend-screen opacity-30 translate-x-1/2 -translate-y-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto flex flex-col items-center justify-center"
        >
          <motion.div variants={staggerItem} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 mb-8 mx-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-200 tracking-wide uppercase">New Era of Shopping</span>
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-gray-400 drop-shadow-2xl"
          >
            Experience The <br />
            <span className="gradient-text">Future</span> Today.
          </motion.h1>

          <motion.p variants={staggerItem} className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover cutting-edge technology, wearables, and smart devices curated for the modern visionary.
            Welcome to NeoCart.
          </motion.p>

          <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                Shop Now
              </motion.button>
            </Link>
            <Link to="/products?category=Gaming">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Explore Gaming
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating 3D-like elements */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 border-2 border-gray-600 rounded-full flex justify-center p-1"
        >
          <motion.div className="w-1 h-2 bg-purple-500 rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
