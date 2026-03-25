import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { pageTransition, staggerContainer, staggerItem } from '../animations/variants';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-bg min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 flex items-center gap-3">
              Your <span className="gradient-text-pink">Wishlist</span>
              <span className="text-2xl">❤️</span>
            </h1>
            <p className="text-gray-400 font-medium tracking-wide">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>

        {wishlist.length === 0 ? (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-dark rounded-3xl p-16 text-center shadow-2xl max-w-2xl mx-auto border-pink-500/20 shadow-pink-900/10">
             <div className="w-24 h-24 rounded-full bg-pink-500/10 flex items-center justify-center mx-auto mb-6 text-pink-500 text-4xl">
               ❤️
             </div>
             <h2 className="text-2xl font-bold text-white mb-4">Your wishlist is lonely</h2>
             <p className="text-gray-400 mb-8 max-w-sm mx-auto">
               You haven't saved any items yet. Find something you love and save it for later.
             </p>
             <Link to="/products" className="btn-primary !bg-gradient-to-r !from-pink-600 !to-purple-600 shadow-pink-500/30 hover:shadow-pink-500/50">
               Discover Products
             </Link>
           </motion.div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {wishlist.map((product) => (
                <motion.div 
                  key={product._id} 
                  variants={staggerItem}
                  layoutId={`wishlist-${product._id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring' }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WishlistPage;
