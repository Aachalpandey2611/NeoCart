import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { pageTransition, staggerContainer, staggerItem } from '../animations/variants';

const CATEGORIES = ['All', 'Smartphones', 'Laptops', 'Wearables', 'Gaming', 'Audio', 'Accessories'];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');

  const initialCategory = searchParams.get('category') || 'All';
  const initialKeyword = searchParams.get('keyword') || '';
  const initialPage = Number(searchParams.get('page')) || 1;

  const [category, setCategory] = useState(initialCategory);
  const [keyword, setKeyword] = useState(initialKeyword);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const catQuery = category === 'All' ? '' : category;
        const data = await getProducts({ keyword, page, category: catQuery, sort });
        setProducts(data.products);
        setTotalPages(data.pages);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [keyword, page, category, sort]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
    const params = Object.fromEntries([...searchParams]);
    params.sort = e.target.value;
    params.page = 1;
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = { page: 1 };
    if (keyword) params.keyword = keyword;
    if (category !== 'All') params.category = category;
    setSearchParams(params);
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setPage(1);
    const params = { page: 1 };
    if (keyword) params.keyword = keyword;
    if (cat !== 'All') params.category = cat;
    setSearchParams(params);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setCategory('All');
    setKeyword('');
    setPage(1);
    setSearchParams({});
    setIsFilterOpen(false);
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-bg min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black mb-2">Our <span className="gradient-text">Future Tech</span></h1>
            <p className="text-gray-400 font-medium">Explore the most advanced devices in the galaxy.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative w-full md:w-64 group">
              <input
                type="text"
                placeholder="Search..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-full pl-5 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                <FiSearch className="w-4 h-4" />
              </button>
            </form>

            <select
              value={sort}
              onChange={handleSortChange}
              className="bg-black/40 border border-white/10 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors cursor-pointer appearance-none hover:bg-white/5"
            >
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Highest Rated</option>
            </select>

            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden w-12 h-12 rounded-full glass flex items-center justify-center text-white"
            >
              <FiFilter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <div className={`w-full md:w-64 glass-dark rounded-3xl p-6 border border-white/10 md:sticky md:top-24 h-max transition-all duration-300 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><FiFilter /> Filters</h3>
              <button onClick={clearFilters} className="text-xs text-purple-400 hover:text-purple-300 uppercase font-bold tracking-wider">Clear</button>
            </div>
            
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Categories</h4>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      category === cat 
                        ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* In a real scenario, Price/Brand filters would go here and passed to API */}
            <div>
               <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">Pricing Range</h4>
               <input type="range" min="0" max="5000" className="w-full accent-purple-500" />
               <div className="flex justify-between text-xs text-gray-400 mt-2">
                 <span>$0</span>
                 <span>$5000+</span>
               </div>
            </div>
            
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="py-32 flex justify-center"><Loader size="lg" /></div>
            ) : products.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-dark rounded-3xl p-16 text-center border border-white/10">
                <FiSearch className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-6 max-w-sm mx-auto">We couldn't find anything matching your current filters. Try adjusting your search criteria.</p>
                <button onClick={clearFilters} className="btn-secondary">Clear all filters</button>
              </motion.div>
            ) : (
              <>
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                >
                  {products.map((product) => (
                    <motion.div key={product._id} variants={staggerItem}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setPage(i + 1);
                          setSearchParams({ keyword, category: category !== 'All' ? category : '', page: i + 1 });
                        }}
                        className={`w-10 h-10 rounded-xl font-bold transition-all ${
                          page === i + 1 
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                            : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ProductsPage;
