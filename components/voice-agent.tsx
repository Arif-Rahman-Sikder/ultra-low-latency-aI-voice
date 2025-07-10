import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, Settings } from 'lucide-react';

interface VoiceAgentProps {}

const VoiceAgent: React.FC<VoiceAgentProps> = () => {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [language, setLanguage] = useState('en-US');

  const audioRef = useRef<HTMLAudioElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          processVoiceInput(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };
    }

    // Simulate connection to backend
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const startListening = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    try {
      setIsListening(true);
      setIsProcessing(true);
      setTranscript('');
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsProcessing(false);
  };

  const processVoiceInput = async (input: string) => {
    setIsProcessing(true);
    const startTime = Date.now();
    
    try {
      // Check for form-related commands
      if (input.toLowerCase().includes('fill a form') || input.toLowerCase().includes('open form')) {
        setResponse("I'll open the form for you. Please navigate to the Form Manager section to fill out your information.");
        setIsProcessing(false);
        return;
      }
      
      // Check for name input
      if (input.toLowerCase().includes('my name is')) {
        const nameMatch = input.match(/my name is (.+)/i);
        if (nameMatch) {
          const name = nameMatch[1].trim();
          setResponse(`Thank you, ${name}. I've noted your name. What else would you like to tell me?`);
          // Trigger form update event
          window.dispatchEvent(new CustomEvent('voiceFormUpdate', { 
            detail: { field: 'name', value: name } 
          }));
          setIsProcessing(false);
          return;
        }
      }
      
      // Check for email input
      if (input.toLowerCase().includes('my email is') || input.toLowerCase().includes('email is')) {
        const emailMatch = input.match(/(?:my )?email is (.+)/i);
        if (emailMatch) {
          const email = emailMatch[1].trim();
          setResponse(`Got it! I've recorded your email as ${email}. Is there anything else you'd like to add?`);
          // Trigger form update event
          window.dispatchEvent(new CustomEvent('voiceFormUpdate', { 
            detail: { field: 'email', value: email } 
          }));
          setIsProcessing(false);
          return;
        }
      }
      
      // Check for submit command
      if (input.toLowerCase().includes('submit the form') || input.toLowerCase().includes('submit form')) {
        setResponse("I'll submit the form for you now. Please check the Form Manager to confirm submission.");
        // Trigger form submit event
        window.dispatchEvent(new CustomEvent('voiceFormSubmit'));
        setIsProcessing(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/voice-process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      
      const processingTime = Date.now() - startTime;
      
      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.response || "I'm an advanced AI assistant capable of natural conversation, voice interaction, and helping with various tasks. How can I assist you today?";
        setResponse(aiResponse);
        
        // Log performance metrics
        console.log(`Voice processing latency: ${processingTime}ms`);
        
        // Auto-play response if not muted
        if (!isMuted && synthRef.current) {
          speakText(aiResponse);
        }
      } else {
        const fallbackResponse = "I'm an advanced AI assistant capable of natural conversation, voice interaction, and helping with various tasks. How can I assist you today?";
        setResponse(fallbackResponse);
        if (!isMuted && synthRef.current) {
          speakText(fallbackResponse);
        }
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      const fallbackResponse = "Sorry, I'm having trouble processing your request right now. Please try again.";
      setResponse(fallbackResponse);
      if (!isMuted && synthRef.current) {
        speakText(fallbackResponse);
      }
    }
    
    setIsProcessing(false);
  };

  const speakText = (text: string) => {
    if (!synthRef.current || isMuted) return;

    // Stop any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = volume;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    synthRef.current.speak(utterance);
  };

  const togglePlayback = () => {
    if (!response) return;

    if (isPlaying) {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsPlaying(false);
    } else {
      speakText(response);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted && synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    if (recognitionRef.current) {
      recognitionRef.current.lang = e.target.value;
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setResponse('');
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 
            'bg-red-500'
          }`}></div>
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
          </span>
        </div>
        <button 
          onClick={toggleSettings}
          className={`p-2 rounded-lg transition-colors ${
            showSettings ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Voice Settings</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
                <option value="de-DE">German</option>
                <option value="it-IT">Italian</option>
                <option value="pt-BR">Portuguese</option>
                <option value="ja-JP">Japanese</option>
                <option value="ko-KR">Korean</option>
                <option value="zh-CN">Chinese (Mandarin)</option>
              </select>
            </div>

            <button
              onClick={clearTranscript}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Conversation
            </button>
          </div>
        </div>
      )}

      {/* Voice Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={connectionStatus !== 'connected'}
          className={`p-4 rounded-full transition-all duration-200 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={isListening ? 'Stop Listening' : 'Start Listening'}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>

        <button
          onClick={togglePlayback}
          disabled={!response || connectionStatus !== 'connected'}
          className="p-4 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title={isPlaying ? 'Stop Playback' : 'Play Response'}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={toggleMute}
          className={`p-4 rounded-full transition-all duration-200 ${
            isMuted ? 'bg-gray-500 hover:bg-gray-600' : 'bg-purple-500 hover:bg-purple-600'
          } text-white`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-gray-600">
            {isListening ? 'Listening... (Speak now)' : 'Processing your request...'}
          </span>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">You said:</h4>
          <p className="text-gray-900">{transcript}</p>
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-700">AI Response:</h4>
            <button
              onClick={() => speakText(response)}
              disabled={isMuted}
              className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
              title="Replay Response"
            >
              <Play className="w-4 h-4" />
            </button>
          </div>
          <p className="text-blue-900">{response}</p>
        </div>
      )}

      {/* Audio Waveform Visualization */}
      <div className="bg-gray-100 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-1 h-16">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-blue-400 rounded-full transition-all duration-150 ${
                isListening ? 'animate-pulse' : ''
              }`}
              style={{
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${i * 50}ms`
              }}
            ></div>
          ))}
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
};

export default VoiceAgent;