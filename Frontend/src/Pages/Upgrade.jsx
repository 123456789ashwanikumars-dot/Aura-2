import { motion } from "framer-motion";
import { Sparkles, Lock } from "lucide-react";

export default function Upgrade() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black transition-colors duration-500 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white/20 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10
                   shadow-2xl rounded-3xl p-10 max-w-md w-full text-center"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          className="mx-auto mb-6 w-fit"
        >
          <Sparkles className="w-14 h-14 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]" />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Payment <span className="text-purple-500">Coming Soon</span>
        </h1>

        {/* Sub text */}
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          We are working on a secure and seamless payment experience.
          <br /> Stay tuned! 🚀
        </p>

        {/* Locked Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-not-allowed flex items-center justify-center gap-2 w-full py-3
                     bg-purple-600/80 dark:bg-purple-700/80 text-white rounded-xl shadow-lg 
                     hover:bg-purple-700 dark:hover:bg-purple-800 transition-all duration-300"
        >
          <Lock className="w-5 h-5" />
          Coming Soon
        </motion.button>
      </motion.div>
    </div>
  );
}
