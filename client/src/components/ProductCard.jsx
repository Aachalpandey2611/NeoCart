import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, calcDiscount } from '../utils/helpers';

const badgeColors = {
  HOT: 'from-red-500 to-orange-500',
  NEW: 'from-emerald-500 to-cyan-500',
  SALE: 'from-purple-500 to-pink-500',
};

const ProductCard = ({ product }) => {
  const [imgError, setImgError] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToast } = useToast();
  const cardRef = useRef(null);

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [12, -12]), { stiffness: 500, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-12, 12]), { stiffness: 500, damping: 30 });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const wishlisted = isWishlisted(product._id);
  const discount = calcDiscount(product.originalPrice, product.price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    addToast(`${product.name} added to cart!`, 'success');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    addToast(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!', wishlisted ? 'info' : 'success');
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative group"
    >
      <Link to={`/products/${product._id}`} className="block">
        <div className="glass rounded-2xl overflow-hidden neon-border hover:border-purple-500/50 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-purple-900/30">
          {/* Image */}
          <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-purple-950/40 to-blue-950/40">
            {product.badge && (
              <div className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${badgeColors[product.badge] || 'from-purple-500 to-blue-500'} text-white shadow-lg`}>
                {product.badge}
              </div>
            )}
            {discount > 0 && (
              <div className="absolute top-3 right-3 z-10 px-2 py-1 rounded-full text-xs font-bold bg-black/60 text-emerald-400 border border-emerald-500/30">
                -{discount}%
              </div>
            )}
            <motion.img
              src={imgError ? `https://placehold.co/400x400/1a1a2e/7c3aed?text=${encodeURIComponent(product.name)}` : product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={{ transformStyle: 'preserve-3d', transform: 'translateZ(20px)' }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Action buttons */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="p-2.5 glass rounded-xl text-white hover:text-purple-300 transition-colors"
              >
                <FiShoppingCart className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                className={`p-2.5 glass rounded-xl transition-colors ${wishlisted ? 'text-pink-400' : 'text-white hover:text-pink-400'}`}
              >
                <FiHeart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.div whileHover={{ scale: 1.1 }} className="p-2.5 glass rounded-xl text-white hover:text-cyan-300 transition-colors">
                <FiEye className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          {/* Info */}
          <div className="p-4" style={{ transform: 'translateZ(10px)' }}>
            <p className="text-xs text-purple-400 font-medium mb-1 uppercase tracking-wider">{product.category}</p>
            <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors">
              {product.name}
            </h3>
            {/* Stars */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
              ))}
              <span className="text-xs text-gray-500 ml-1">({product.numReviews || 0})</span>
            </div>
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold gradient-text">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="text-xs px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/40 transition-all font-medium"
              >
                Add
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
