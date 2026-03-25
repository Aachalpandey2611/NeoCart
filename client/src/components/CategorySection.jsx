import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { slideUp, staggerContainer, staggerItem } from '../animations/variants';
import { FiMonitor, FiHeadphones, FiWatch, FiCpu, FiSpeaker, FiHome } from 'react-icons/fi';

const categories = [
  { name: 'Electronics', icon: <FiMonitor className="w-8 h-8" />, color: 'from-blue-500 to-cyan-500' },
  { name: 'Audio', icon: <FiHeadphones className="w-8 h-8" />, color: 'from-purple-500 to-pink-500' },
  { name: 'Wearables', icon: <FiWatch className="w-8 h-8" />, color: 'from-emerald-500 to-teal-500' },
  { name: 'Gaming', icon: <FiCpu className="w-8 h-8" />, color: 'from-red-500 to-orange-500' },
  { name: 'Accessories', icon: <FiSpeaker className="w-8 h-8" />, color: 'from-indigo-500 to-purple-500' },
  { name: 'Smart Home', icon: <FiHome className="w-8 h-8" />, color: 'from-yellow-500 to-amber-500' },
];

const CategorySection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={slideUp} className="text-4xl md:text-5xl font-bold mb-4">
            Shop by <span className="gradient-text">Category</span>
          </motion.h2>
          <motion.p variants={slideUp} className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our curated collections of next-gen technology.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {categories.map((cat, i) => (
            <motion.div key={cat.name} variants={staggerItem} custom={i}>
              <Link to={`/products?category=${cat.name}`} className="block group">
                <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:border-white/20 transition-all duration-300 relative overflow-hidden bg-black/40 hover:shadow-2xl hover:shadow-purple-900/20">
                  {/* Hover glow background */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10`}>
                    {cat.icon}
                  </div>
                  
                  {/* Name */}
                  <span className="font-semibold text-gray-300 group-hover:text-white transition-colors text-center text-sm md:text-base relative z-10">
                    {cat.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;
