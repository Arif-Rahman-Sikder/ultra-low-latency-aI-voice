import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ChatInterface } from './components/ChatInterface';
import { Footer } from './components/Footer';

function App() {
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
  };

  if (showChat) {
    return <ChatInterface onBack={() => setShowChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header onStartChat={handleStartChat} />
      <Hero onStartChat={handleStartChat} />
      <Features />
      <Footer />
    </div>
  );
}

export default App;