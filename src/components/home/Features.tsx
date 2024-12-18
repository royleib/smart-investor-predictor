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
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transform hover:shadow-md transition-all duration-300"
        >
          <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <feature.icon className="h-6 w-6 text-gray-700" />
          </div>
          <h3 className="text-xl font-montserrat font-semibold mb-2 text-gray-900">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};