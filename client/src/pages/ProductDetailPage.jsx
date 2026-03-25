import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar, FiTruck, FiShield, FiRotateCcw, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import { getProductById, createProductReview } from '../services/productService';
import { formatCurrency, calcDiscount, renderStars } from '../utils/helpers';
import { pageTransition, slideUp, fadeIn } from '../animations/variants';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="page-bg min-h-screen pt-32 pb-20 flex justify-center"><Loader size="lg" /></div>;
  if (!product) return <div className="page-bg min-h-screen pt-32 text-center"><h1 className="text-3xl text-white">Product Not Found</h1><Link to="/products" className="btn-primary mt-6 inline-block">Back to Products</Link></div>;

  const wishlisted = isWishlisted(product._id);
  const discount = calcDiscount(product.originalPrice, product.price);
  const stars = renderStars(product.rating || 0);

  const handleAddToCart = () => {
    addToCart(product, qty);
    addToast(`${product.name} (x${qty}) added to cart!`, 'success');
  };

  const submitReviewHandler = async () => {
    if (!comment) return addToast('Please enter a comment', 'error');
    setSubmitting(true);
    try {
      await createProductReview(id, { rating, comment });
      addToast('Review submitted!', 'success');
      setComment('');
      // Refresh product
      const updatedProduct = await getProductById(id);
      setProduct(updatedProduct);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-bg min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-gray-400 mb-8 whitespace-nowrap overflow-x-auto pb-2">
          <Link to="/" className="hover:text-purple-400">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-purple-400">Products</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-300 truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          
          {/* Image Gallery */}
          <motion.div variants={fadeIn} className="relative aspect-square rounded-3xl overflow-hidden glass border-white/10 flex items-center justify-center p-8 bg-black/40 shadow-2xl shadow-purple-900/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5 mix-blend-overlay" />
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20 }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(124,58,237,0.3)] group-hover:scale-105 transition-transform duration-700"
            />
            {discount > 0 && (
              <div className="absolute top-6 left-6 z-20 px-4 py-1.5 rounded-full text-sm font-bold bg-purple-600/90 backdrop-blur-md text-white border border-purple-500 shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                Save {discount}%
              </div>
            )}
            <button
              onClick={() => { toggleWishlist(product); addToast('Wishlist updated', 'info'); }}
              className={`absolute top-6 right-6 z-20 w-12 h-12 rounded-full glass flex items-center justify-center transition-colors shadow-xl ${wishlisted ? 'bg-pink-500/20 text-pink-500 border-pink-500/30' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              <FiHeart className={`w-6 h-6 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </motion.div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-6">
              <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 tracking-wider uppercase mb-2 block">{product.brand}</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(stars.full)].map((_, i) => <FiStar key={`f${i}`} className="w-4 h-4 text-yellow-500 fill-current" />)}
                  {stars.half && <FiStar className="w-4 h-4 text-yellow-500 fill-current opacity-50" />}
                  {[...Array(stars.empty)].map((_, i) => <FiStar key={`e${i}`} className="w-4 h-4 text-gray-600" />)}
                </div>
                <span className="text-sm text-gray-400">{product.numReviews} Reviews</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span>
                <span className="text-sm text-emerald-400 flex items-center gap-1.5"><FiCheck /> In Stock ({product.stock})</span>
              </div>
            </motion.div>

            <motion.div variants={slideUp} initial="hidden" animate="visible" className="mb-8 p-6 rounded-2xl glass-dark border border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
              <div className="flex items-end gap-4 mb-2">
                <span className="text-5xl font-black gradient-text tracking-tight">{formatCurrency(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through mb-1.5 font-medium">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>
              <p className="text-sm text-gray-400 font-medium">+ Free shipping & returns</p>
            </motion.div>

            {/* Actions */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="flex items-center justify-between glass rounded-xl p-2 w-full sm:w-36">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-lg flex items-center justify-center transition-colors">-</button>
                <span className="font-bold text-lg">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-lg flex items-center justify-center transition-colors">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all ${
                  product.stock > 0 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-600/30' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                }`}
              >
                <FiShoppingCart className="w-5 h-5" /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </motion.div>

            {/* Guarantees */}
            <motion.div variants={slideUp} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {[
                { i: <FiTruck className="w-6 h-6 text-purple-400" />, t: 'Free Global Delivery', d: 'On orders over $200' },
                { i: <FiShield className="w-6 h-6 text-blue-400" />, t: '1 Year Warranty', d: 'Manufacturer guarantee' },
                { i: <FiRotateCcw className="w-6 h-6 text-cyan-400" />, t: '30 Days Return', d: 'No questions asked' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center mb-1 bg-white/5">{item.i}</div>
                  <h4 className="text-white text-sm font-semibold">{item.t}</h4>
                  <p className="text-gray-500 text-xs">{item.d}</p>
                </div>
              ))}
            </motion.div>

          </div>
        </div>

        {/* Tabs */}
        <div className="border border-white/10 rounded-3xl glass-dark overflow-hidden bg-black/40">
          <div className="flex overflow-x-auto border-b border-white/10 no-scrollbar">
            {['Description', 'Specifications', 'Reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`flex-1 py-6 px-8 text-sm font-bold tracking-wider uppercase transition-colors whitespace-nowrap ${
                  activeTab === tab.toLowerCase() ? 'text-white border-b-2 border-purple-500 bg-white/5' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-8 md:p-12 min-h-[300px]">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="prose prose-invert max-w-none">
                <h3 className="text-2xl font-bold mb-6 text-white">About the {product.name}</h3>
                <p className="text-gray-300 leading-root text-lg">{product.description}</p>
              </motion.div>
            )}
            {activeTab === 'specifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                {[['Brand', product.brand], ['Category', product.category], ['Stock', `${product.stock} units left`], ['Release Date', new Date(product.createdAt).toLocaleDateString()]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-4 border-b border-white/5">
                    <span className="text-gray-500">{k}</span>
                    <span className="text-white font-medium text-right">{v}</span>
                  </div>
                ))}
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Review Form */}
                <div className="glass-dark p-6 rounded-2xl mb-12 border border-white/5">
                  <h4 className="text-xl font-bold mb-4 text-white">Share Your Thoughts</h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map((s) => (
                         <button
                           key={s}
                           onClick={() => setRating(s)}
                           className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                             rating >= s ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'bg-white/5 text-gray-500'
                           }`}
                         >
                           <FiStar className={rating >= s ? 'fill-current' : ''} />
                         </button>
                       ))}
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Your review helps others discover the future..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 min-h-[100px]"
                    />
                    <button
                      onClick={submitReviewHandler}
                      disabled={submitting}
                      className="btn-primary self-start px-8"
                    >
                      {submitting ? 'Submitting...' : 'Post Review'}
                    </button>
                  </div>
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map((r, i) => (
                      <div key={i} className="glass p-6 rounded-2xl flex gap-4">
                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center font-bold text-white flex-shrink-0">
                           {r.name[0].toUpperCase()}
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-white font-medium">{r.name}</h4>
                              <div className="flex items-center text-yellow-500 text-xs ml-2">
                                {[...Array(r.rating)].map((_, idx) => <FiStar key={idx} className="fill-current" />)}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 mb-3 block">{new Date(r.createdAt).toLocaleDateString()}</span>
                            <p className="text-gray-300 text-sm leading-relaxed">{r.comment}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p className="mb-4 text-lg">No reviews yet.</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
