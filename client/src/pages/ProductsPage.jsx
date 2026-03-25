import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { getProducts } from '../services/productService';
import { staggerContainer, staggerItem, pageTransition } from '../animations/variants';

const categories = ['All', 'Electronics', 'Wearables', 'Audio', 'Gaming', 'Accessories', 'Smart Home'];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters State
  const initialCategory = searchParams.get('category') || 'All';
  const initialKeyword = searchParams.get('keyword') || '';
  
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [searchInput, setSearchInput] = useState(initialKeyword);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSelectedCat(searchParams.get('category') || 'All');
    setKeyword(searchParams.get('keyword') || '');
    setSearchInput(searchParams.get('keyword') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const catQuery = selectedCat !== 'All' ? selectedCat : '';
        const data = await getProducts({ category: catQuery, keyword, page });
        setProducts(data.products);
        setPages(data.pages);
        setTotal(data.total);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCat, keyword, page]);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [selectedCat, keyword]);

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-bg min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2">Explore <span className="gradient-text">Products</span></h1>
            <p className="text-gray-400 text-sm">Showing {products.length} of {total} results</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input inline */}
            <div className="relative glass rounded-xl overflow-hidden hidden md:flex items-center border border-white/10 w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchParams({ keyword: searchInput, category: selectedCat === 'All' ? '' : selectedCat });
                  }
                }}
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
              <button
                onClick={() => setSearchParams({ keyword: searchInput, category: selectedCat === 'All' ? '' : selectedCat })}
                className="px-3 text-gray-400 hover:text-white"
              >
                <FiSearch />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                showFilters ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'glass text-white'
              }`}
            >
              <FiFilter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        {/* Filter Bar (Collapsible) */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="glass-dark border border-white/10 rounded-2xl p-6 flex flex-wrap gap-3">
                <span className="w-full text-sm font-semibold text-gray-400 mb-2">Categories:</span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCat(cat);
                      setSearchParams({ category: cat === 'All' ? '' : cat, keyword });
                    }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCat === cat
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/40 border-none'
                        : 'glass text-gray-400 hover:text-white border-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {loading ? (
          <div className="py-32 flex justify-center"><Loader size="lg" /></div>
        ) : products.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center">
            <span className="text-6xl mb-4">🛸</span>
            <h2 className="text-2xl font-bold text-white mb-2">No products found</h2>
            <p className="text-gray-400 max-w-md">We couldn't find anything matching your search. Try different keywords or filters.</p>
            <button
              onClick={() => {
                setSearchParams({});
                setSearchInput('');
              }}
              className="mt-6 btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8"
          >
            {products.map((product) => (
              <motion.div key={product._id} variants={staggerItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && pages > 1 && (
          <div className="mt-16 flex justify-center gap-2">
            {[...Array(pages).keys()].map((p) => (
              <button
                key={p + 1}
                onClick={() => setPage(p + 1)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all ${
                  page === p + 1
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-900/40'
                    : 'glass text-gray-400 hover:text-white'
                }`}
              >
                {p + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductsPage;
