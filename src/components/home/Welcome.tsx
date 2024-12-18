import { motion } from "framer-motion";

export const Welcome = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-12 px-4 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-500/10 blur-3xl -z-10" />
      <h2 className="text-4xl font-montserrat font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Smart Market Predictions
      </h2>
      <p className="text-xl text-slate-600">
        Choose your investment category and get AI-powered insights
      </p>
    </motion.div>
  );
};