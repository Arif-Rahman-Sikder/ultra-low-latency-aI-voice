import React from 'react';
import { Brain, Shield, Globe, Cpu, Headphones, BarChart } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Engine',
      description: 'Powered by state-of-the-art machine learning models for intelligent responses.',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'End-to-end encryption and secure data handling to protect your conversations.',
      color: 'green'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Communicate in over 50 languages with real-time translation capabilities.',
      color: 'purple'
    },
    {
      icon: Cpu,
      title: 'High Performance',
      description: 'Optimized for speed and efficiency with sub-second response times.',
      color: 'orange'
    },
    {
      icon: Headphones,
      title: 'Voice & Audio',
      description: 'Natural voice synthesis and speech recognition for immersive experiences.',
      color: 'pink'
    },
    {
      icon: BarChart,
      title: 'Analytics Dashboard',
      description: 'Track conversations, insights, and performance metrics in real-time.',
      color: 'indigo'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      pink: 'bg-pink-100 text-pink-600',
      indigo: 'bg-indigo-100 text-indigo-600'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the advanced capabilities that make our conversational AI assistant 
            the perfect solution for your communication needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(feature.color)}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};