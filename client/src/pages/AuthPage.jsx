import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { loginUser, registerUser } from '../services/authService';
import { pageTransition, fadeIn } from '../animations/variants';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const { login, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (user) navigate(redirect);
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const data = await loginUser(formData.email, formData.password);
        login(data, data.token);
        addToast('Welcome back to NeoCart!', 'success');
      } else {
        const data = await registerUser(formData.name, formData.email, formData.password);
        login(data, data.token);
        addToast('Account created successfully!', 'success');
      }
      navigate(redirect);
    } catch (error) {
      addToast(error.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit" className="page-bg min-h-screen flex items-center justify-center pt-24 pb-20 px-4 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 150, repeat: Infinity, ease: 'linear' }} className="w-[800px] h-[800px] bg-gradient-to-br from-purple-900/10 to-blue-900/10 rounded-full blur-[100px] absolute" />
      </div>

      <div className="w-full max-w-md relative z-10 glass-dark rounded-[2rem] p-8 shadow-[0_0_50px_rgba(124,58,237,0.15)] border border-white/10 before:absolute before:inset-0 before:rounded-[2rem] before:p-[1px] before:bg-gradient-to-br before:from-purple-500/30 before:to-transparent before:-z-10">
        
        {/* Header Tabs */}
        <div className="flex mb-8 bg-black/40 p-1 rounded-2xl">
          <button onClick={() => setIsLogin(true)} className={`flex-1 py-3 text-sm font-bold tracking-wider uppercase rounded-xl transition-all ${isLogin ? 'bg-white/10 text-white shadow-lg shadow-black/50' : 'text-gray-500 hover:text-gray-300'}`}>Sign In</button>
          <button onClick={() => setIsLogin(false)} className={`flex-1 py-3 text-sm font-bold tracking-wider uppercase rounded-xl transition-all ${!isLogin ? 'bg-white/10 text-white shadow-lg shadow-black/50' : 'text-gray-500 hover:text-gray-300'}`}>Register</button>
        </div>

        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mx-auto shadow-2xl shadow-purple-900/50 mb-4 border border-white/20">
            <span className="text-white font-black text-2xl">N</span>
          </motion.div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm mt-2">{isLogin ? 'Enter your details to access your dashboard' : 'Join the future of e-commerce today'}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'register'}
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {!isLogin && (
              <div>
                <div className="relative group">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-600 outline-none focus:border-purple-500/50 focus:bg-white/5 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-600 outline-none focus:border-blue-500/50 focus:bg-white/5 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 focus:bg-white/5 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 mt-4 shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:shadow-[0_0_50px_rgba(124,58,237,0.5)] bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 overflow-hidden relative"
            >
              {loading ? (
                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'} <FiArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </motion.form>
        </AnimatePresence>

      </div>
    </motion.div>
  );
};

export default AuthPage;
