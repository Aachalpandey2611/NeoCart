import { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const icons = {
  success: <FiCheck className="w-5 h-5" />,
  error: <FiAlertCircle className="w-5 h-5" />,
  info: <FiInfo className="w-5 h-5" />,
};

const colors = {
  success: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300',
  error: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-300',
  info: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300',
};

const Toast = ({ toast, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: 100, scale: 0.8 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 100, scale: 0.8 }}
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-gradient-to-r backdrop-blur-xl
      shadow-2xl cursor-pointer min-w-[280px] max-w-[380px] ${colors[toast.type] || colors.info}`}
    onClick={() => onRemove(toast.id)}
  >
    <span className="flex-shrink-0">{icons[toast.type] || icons.info}</span>
    <p className="text-sm font-medium flex-1">{toast.message}</p>
    <button className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
      <FiX className="w-4 h-4" />
    </button>
  </motion.div>
);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const removeToast = useCallback((id) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast toast={toast} onRemove={removeToast} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default ToastContext;
