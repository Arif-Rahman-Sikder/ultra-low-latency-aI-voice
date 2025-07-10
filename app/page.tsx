import React from 'react';
import VoiceAgent from '../components/voice-agent';
import FormManager from '../components/form-manager';
import PerformanceMonitor from '../components/performance-monitor';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conversational AI Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered conversational interface with voice capabilities,
            performance monitoring, and intelligent form management.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Voice Agent
            </h2>
            <VoiceAgent />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Form Manager
            </h2>
            <FormManager />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Performance Monitor
          </h2>
          <PerformanceMonitor />
        </div>
      </div>
    </div>
  );
}