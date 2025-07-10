import React from 'react';
import { Bot, Mic, MessageSquare, Zap } from 'lucide-react';

interface HeroProps {
  onStartChat: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartChat }) => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <Bot className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Next-Generation
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Conversational AI
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience the future of AI communication with our advanced conversational assistant. 
            Powered by cutting-edge technology for natural, intelligent interactions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onStartChat}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Start Conversation</span>
            </button>
            
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-blue-600 flex items-center justify-center space-x-2">
              <Mic className="w-5 h-5" />
              <span>Voice Demo</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Natural Conversations</h3>
              <p className="text-gray-600">Engage in fluid, context-aware dialogues that feel naturally human.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Mic className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Integration</h3>
              <p className="text-gray-600">Seamless voice input and output for hands-free interaction.</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Responses</h3>
              <p className="text-gray-600">Lightning-fast AI responses with advanced processing capabilities.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};