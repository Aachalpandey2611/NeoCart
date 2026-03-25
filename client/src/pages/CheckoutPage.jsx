import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheck, FiCreditCard, FiMapPin, FiBox, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/helpers';
import { pageTransition, fadeIn, slideUp } from '../animations/variants';

const steps = [
  { id: 1, name: 'Shipping', icon: <FiMapPin /> },
  { id: 2, name: 'Payment', icon: <FiCreditCard /> },
  { id: 3, name: 'Review', icon: <FiBox /> },
];

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '', address: '', city: '', postalCode: '', country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  if (cartItems.length === 0) {
    return (
      <div className="page-bg min-h-screen pt-32 text-center text-white">
        <h2 className="text-3xl mb-4">Your cart is empty</h2>
        <Link to="/products" className="btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const taxPrice = cartTotal * 0.15;
  const shippingPrice = cartTotal > 200 ? 0 : 25;
  const totalPrice = cartTotal + taxPrice + shippingPrice;

  const handleNext = (e) => {
    e?.preventDefault();
    if (currentStep < 3) setCurrentStep((prev) => prev + 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      if (!user) {
        addToast('Please login to place an order', 'error');
        navigate('/auth?redirect=checkout');
        return;
      }
      const orderData = {
        items: cartItems.map((i) => ({ ...i, product: i._id })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cartTotal,
        taxPrice,
        shippingPrice,
        totalPrice,
      };
      await createOrder(orderData);
      addToast('Order placed successfully!', 'success');
      clearCart();
      navigate('/dashboard');
    } catch (err) {
      addToast(err.message || 'Error placing order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-bg min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4"><span className="gradient-text">Secure</span> Checkout</h1>
        </div>

        {/* Stepper */}
        <div className="flex justify-center items-center mb-12 relative max-w-2xl mx-auto">
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3/4 h-1 bg-white/10 -z-10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep - 1) * 50}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between w-full relative z-10 px-8">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: currentStep >= step.id ? '#7c3aed' : '#1f2937',
                    borderColor: currentStep >= step.id ? '#a78bfa' : '#374151',
                    scale: currentStep === step.id ? 1.2 : 1,
                  }}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-white transition-colors duration-300 ${currentStep >= step.id ? 'shadow-[0_0_20px_rgba(124,58,237,0.5)]' : ''}`}
                >
                  {currentStep > step.id ? <FiCheck className="w-6 h-6" /> : step.icon}
                </motion.div>
                <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.form key="step1" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" onSubmit={handleNext} className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Shipping Destination</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                      <input required type="text" value={shippingAddress.fullName} onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                      <input required type="text" value={shippingAddress.address} onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
                      <input required type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Postal Code</label>
                      <input required type="text" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                      <input required type="text" value={shippingAddress.country} onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all" />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button type="submit" className="btn-primary py-3 px-8 flex items-center gap-2">Continue <FiArrowRight /></button>
                  </div>
                </motion.form>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div key="step2" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Payment Method</h3>
                  <div className="space-y-4">
                    {['Credit Card', 'PayPal', 'Crypto (NeoCoin)'].map((method) => (
                      <label key={method} className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border ${paymentMethod === method ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_20px_rgba(124,58,237,0.2)]' : 'border-white/10 glass bg-black/40 hover:bg-white/5'}`}>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === method ? 'border-purple-500' : 'border-gray-500'}`}>
                          {paymentMethod === method && <div className="w-3 h-3 rounded-full bg-purple-500" />}
                        </div>
                        <span className={`text-lg font-medium ${paymentMethod === method ? 'text-white font-bold' : 'text-gray-300'}`}>{method}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <button onClick={() => setCurrentStep(1)} className="btn-secondary py-3 px-8">Back</button>
                    <button onClick={handleNext} className="btn-primary py-3 px-8 flex items-center gap-2">Review Order <FiArrowRight /></button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div key="step3" variants={fadeIn} initial="hidden" animate="visible" exit="hidden" className="glass-dark rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">Review Order</h3>
                  <div className="mb-8 p-6 rounded-2xl bg-black/40 border border-white/5">
                    <h4 className="text-purple-400 font-bold mb-4 uppercase tracking-wider text-sm">Shipping Info</h4>
                    <p className="text-gray-300 pb-2"><span className="text-gray-500 w-24 inline-block">Name:</span> {shippingAddress.fullName}</p>
                    <p className="text-gray-300 pb-2"><span className="text-gray-500 w-24 inline-block">Address:</span> {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}</p>
                    <p className="text-gray-300"><span className="text-gray-500 w-24 inline-block">Country:</span> {shippingAddress.country}</p>
                  </div>
                  <div className="mb-8 p-6 rounded-2xl bg-black/40 border border-white/5">
                    <h4 className="text-cyan-400 font-bold mb-4 uppercase tracking-wider text-sm">Payment Info</h4>
                    <p className="text-gray-300 font-medium flex items-center gap-2"><FiCreditCard /> {paymentMethod}</p>
                  </div>
                  <div className="mb-8 p-6 rounded-2xl bg-black/40 border border-white/5">
                    <h4 className="text-white font-bold mb-4 border-b border-white/10 pb-2">Order Items</h4>
                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {cartItems.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 text-sm bg-white/[0.02] p-2 rounded-lg">
                          <img src={item.image} alt="product" className="w-12 h-12 rounded object-cover" />
                          <div className="flex-1">
                            <p className="text-white font-medium line-clamp-1">{item.name}</p>
                            <p className="text-gray-500">{item.quantity} x {formatCurrency(item.price)}</p>
                          </div>
                          <p className="text-purple-400 font-bold">{formatCurrency(item.quantity * item.price)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <button onClick={() => setCurrentStep(2)} className="btn-secondary py-3 px-8">Back</button>
                    {!user ? (
                      <Link to="/auth?redirect=checkout" className="btn-primary py-3 px-8 flex items-center justify-center min-w-[200px]">Login to Pay</Link>
                    ) : (
                      <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary py-3 px-8 flex items-center gap-2 justify-center min-w-[200px] shadow-emerald-500/30">
                        {loading ? 'Processing...' : 'Place Order'}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div variants={slideUp} initial="hidden" animate="visible" className="lg:col-span-1">
            <div className="glass-dark rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl sticky top-24 bg-gradient-to-b from-purple-900/10 to-transparent">
              <h3 className="text-xl font-bold mb-6 text-white text-center">Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Items ({cartItems.length})</span>
                  <span className="text-white font-medium">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className={shippingPrice === 0 ? 'text-emerald-400 font-bold' : 'text-white font-medium'}>
                    {shippingPrice === 0 ? 'Free' : formatCurrency(shippingPrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Tax</span>
                  <span className="text-white font-medium">{formatCurrency(taxPrice)}</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center bg-black/20 p-4 rounded-xl mt-4">
                  <span className="text-lg font-bold text-gray-300">Total</span>
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
