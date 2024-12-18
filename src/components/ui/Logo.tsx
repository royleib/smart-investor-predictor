import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <img 
        src="/lovable-uploads/cc87ba05-5a6d-4c8b-8693-f6264e5bca47.png" 
        alt="Markets Prophet Logo" 
        className="h-12 w-12"
      />
      <span className="text-2xl font-montserrat font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
        Markets Prophet
      </span>
    </motion.div>
  );
};