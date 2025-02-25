import { TrendingUp, Globe, Award } from 'lucide-react';
import { motion } from "framer-motion";
import { translations, type Language } from "@/utils/i18n";

interface FeaturesProps {
  lang: Language;
}

export const Features = ({ lang }: FeaturesProps) => {
  const t = translations[lang];
  
  const features = [
    {
      icon: TrendingUp,
      title: "Smart Predictions",
      description: t.chooseInvestment
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: t.stocks
    },
    {
      icon: Award,
      title: "Expert Analysis",
      description: t.analysis
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass-effect rounded-xl p-8 card-3d"
        >
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
            <feature.icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-montserrat font-semibold mb-3 text-slate-800">
            {feature.title}
          </h3>
          <p className="text-slate-600">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  );
};