import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CategorySection from '../components/CategorySection';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getFeaturedProducts } from '../services/productService';
import { slideUp, staggerContainer, staggerItem } from '../animations/variants';

const LandingPage = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getFeaturedProducts();
        setFeatured(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-bg"
    >
      <HeroSection />
      
      <CategorySection />

      {/* Featured Products Secton */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Featured <span className="gradient-text">Drops</span>
              </h2>
              <p className="text-gray-400">Discover handpicked selections for you.</p>
            </motion.div>
            <Link to="/products" className="hidden sm:inline-flex text-purple-400 hover:text-purple-300 font-medium pb-2 border-b border-purple-500/30 hover:border-purple-400 transition-colors">
              View All Products
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader size="lg" text="Loading drops..." />
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8"
            >
              {featured.map((product) => (
                <motion.div key={product._id} variants={staggerItem}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="mt-12 text-center sm:hidden">
            <Link to="/products">
              <button className="btn-secondary w-full">View All Products</button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Banner Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl overflow-hidden relative min-h-[400px] flex items-center"
          >
            <img 
              src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=1200&h=600&fit=crop" 
              alt="Cyber Space" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
            <div className="relative z-10 p-8 md:p-16 max-w-2xl">
              <span className="text-cyan-400 font-bold tracking-wider uppercase text-sm mb-4 block">New Arrival</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Quantum VR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Headset</span></h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl">Immerse yourself in infinite realities with 16K resolution dual displays and full haptic sensory feedback.</p>
              <Link to="/products">
                <button className="btn-primary shadow-cyan-500/30 hover:shadow-cyan-500/50">Explore Now</button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
