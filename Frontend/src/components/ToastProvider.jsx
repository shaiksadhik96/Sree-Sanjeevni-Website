import { createContext, useContext, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

const stylesByType = {
  success: "bg-gradient-to-r from-herbal-600 to-herbal-700 text-white border-herbal-400 shadow-glow",
  error: "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-400 shadow-lg",
  info: "bg-gradient-to-r from-herbal-700 to-herbal-800 text-white border-herbal-600 shadow-lg",
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  };

  const value = useMemo(
    () => ({
      showToast,
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-10 z-[100] flex flex-col items-center gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 200, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className={`pointer-events-auto flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold border-2 backdrop-blur-sm
                ${stylesByType[toast.type] || stylesByType.info}
              `}
            >
              {toast.type === 'success' && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
              {toast.type === 'error' && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.div>
              )}
              {toast.type === 'info' && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
              )}
              <span className="tracking-wide">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};
