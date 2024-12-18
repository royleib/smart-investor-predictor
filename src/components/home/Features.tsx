import { TrendingUp, Globe, Award } from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Smart Predictions",
      description: "Advanced AI algorithms for accurate market predictions"
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Access predictions for markets worldwide"
    },
    {
      icon: Award,
      title: "Expert Analysis",
      description: "Professional-grade market insights"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-4">
      {features.map((feature, index) => (
        <div 
          key={index}
          className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
            <feature.icon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-montserrat font-semibold mb-2 text-gray-800">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};