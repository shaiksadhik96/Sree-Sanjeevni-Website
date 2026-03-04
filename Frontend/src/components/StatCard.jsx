import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, accent = "bg-herbal-100 text-herbal-700" }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, shadow: "0 20px 40px rgba(31, 45, 29, 0.2)" }}
      transition={{ duration: 0.3 }}
      className="glass-card relative overflow-hidden px-6 py-5 border border-herbal-100/50 group cursor-pointer"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-herbal-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Decorative elements */}
      <div className="absolute -right-3 -top-3 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <svg
          viewBox="0 0 100 100"
          className="h-24 w-24 text-herbal-600"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="40" />
        </svg>
      </div>
      <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-herbal-200/20 rounded-full blur-xl"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-herbal-600 font-bold mb-1">
            {title}
          </p>
          <motion.p 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-4xl font-bold bg-gradient-to-r from-herbal-700 to-herbal-600 bg-clip-text text-transparent"
          >
            {value}
          </motion.p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`rounded-2xl p-4 shadow-soft group-hover:shadow-glow transition-all ${accent}`}
        >
          {icon}
        </motion.div>
      </div>
      
      {/* Bottom accent line */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-herbal-600 to-herbal-400 rounded-full"
      ></motion.div>
    </motion.div>
  );
};

export default StatCard;
