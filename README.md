# ultra-low-latency-aI-voice
Created as a part of internship assesment

# Conversational AI Assistant

A modern, full-featured conversational AI assistant application built with React, TypeScript, and Python backend integration. This application provides real-time voice interaction, intelligent form management, and comprehensive performance monitoring capabilities.

## 🌟 Features

### Core Capabilities
- **Real-time Voice Conversation**: Natural speech-to-text and text-to-speech capabilities
- **Intelligent Form Management**: Voice-controlled form filling and submission
- **Performance Monitoring**: Real-time system metrics and analytics
- **Multi-language Support**: Support for 10+ languages including English, Spanish, French, German, and more
- **Cross-browser Compatibility**: Optimized for Chrome, Edge, Safari, and Firefox

### Advanced Features
- **Voice Commands**: Control forms and interface through natural voice commands
- **Real-time Analytics**: Monitor CPU usage, memory consumption, response times, and throughput
- **Error Handling**: Comprehensive fallback mechanisms for robust operation
- **Data Export/Import**: Export conversation data and performance metrics
- **Responsive Design**: Fully responsive interface that works on all device sizes

## 🚀 Live Demo

Visit the live application: [https://chimerical-rabanadas-7e8a9c.netlify.app](https://chimerical-rabanadas-7e8a9c.netlify.app)

## 📋 Prerequisites

Before running this project locally, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.7 or higher) - [Download here](https://python.org/)
- **Modern web browser** (Chrome, Edge, or Safari recommended for full voice features)

## 🛠️ Installation & Setup

### Step 1: Clone or Download the Project

```bash
# If you have git, clone the repository
git clone <repository-url>
cd conversational-ai-assistant

# Or download and extract the project files
```

### Step 2: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install psutil requests flask
```

**Alternative**: Use the automated installation script:
```bash
# Make the script executable and run it
chmod +x scripts/install_dependencies.sh
./scripts/install_dependencies.sh
```

### Step 3: Start the Backend Server

```bash
# Start the Python backend server
npm run backend

# OR manually start it
python scripts/backend_server.py
```

The backend server will start on `http://localhost:8000` and provide the following endpoints:
- `GET /api/health` - Health check
- `GET /api/metrics` - Performance metrics
- `POST /api/voice-process` - Voice processing
- `POST /api/forms` - Form submission

### Step 4: Start the Frontend Development Server

```bash
# In a new terminal window, start the frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Step 5: Access the Application

1. Open your browser and navigate to `http://localhost:5173`
2. **Important**: Allow microphone permissions when prompted
3. Click "Start Chat" to access the conversational interface

## 🎤 Voice Features Setup

### Browser Compatibility
- **Chrome**: Full support ✅
- **Edge**: Full support ✅  
- **Safari**: Full support ✅
- **Firefox**: Limited support ⚠️

### Enabling Microphone Permissions

1. When you first click the microphone button, your browser will request permission
2. Click "Allow" to enable voice features
3. If you accidentally denied permission:
   - **Chrome/Edge**: Click the microphone icon in the address bar
   - **Safari**: Go to Safari > Settings > Websites > Microphone

### Voice Commands

Try these voice commands to test the functionality:

| Command | Expected Result |
|---------|----------------|
| "I want to fill a form" | Opens the form interface |
| "My name is John Smith" | Updates the name field |
| "My email is john@example.com" | Updates the email field |
| "Submit the form" | Submits the completed form |

## 🧪 Testing & Performance

### Automated Performance Testing

The application includes built-in performance testing capabilities:

1. Open browser console (F12)
2. Run the performance tests:
   ```javascript
   window.performanceTester.runAllTests()
   ```

### Performance Targets

The application is optimized to meet these performance benchmarks:

- ✅ **Voice Latency**: < 500ms consistently
- ✅ **Form Updates**: < 100ms response time
- ✅ **Audio Quality**: Clear and natural speech synthesis
- ✅ **Interruption Capability**: Immediate response to stop commands
- ✅ **Form Opening**: < 1 second from voice command

### Manual Testing Scenarios

1. **Voice Recognition Test**:
   - Click the microphone button
   - Speak clearly: "Hello, how are you?"
   - Verify the transcript appears and AI responds

2. **Form Integration Test**:
   - Say: "I want to fill a form"
   - Say: "My name is [Your Name]"
   - Say: "My email is [your-email@example.com]"
   - Say: "Submit the form"
   - Verify each step updates the form correctly

3. **Performance Monitor Test**:
   - Navigate to the Performance Monitor section
   - Click "Start Monitoring"
   - Observe real-time metrics updates

## 🏗️ Project Structure

```
conversational-ai-assistant/
├── app/
│   └── page.tsx                 # Main application page
├── components/
│   ├── form-manager.tsx         # Form management component
│   ├── performance-monitor.tsx  # Performance monitoring
│   └── voice-agent.tsx          # Voice interaction component
├── scripts/
│   ├── backend_server.py        # Python backend server
│   └── install_dependencies.sh  # Dependency installation script
├── src/
│   ├── components/              # Landing page components
│   ├── App.tsx                  # Main app component
│   └── main.tsx                 # App entry point
├── test-performance.js          # Performance testing utilities
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## 🔧 Configuration

### Voice Settings
- **Language**: Configurable in voice agent settings (10+ languages supported)
- **Volume**: 0-100% adjustable
- **Speech Rate**: Optimized for clarity and naturalness

### Backend Configuration
- **Port**: 8000 (configurable in `backend_server.py`)
- **CORS**: Enabled for localhost development
- **Logging**: Comprehensive request/response logging

### Performance Monitoring
- **Refresh Interval**: Configurable (500ms - 10s)
- **Data Points**: Configurable history length
- **Alert Thresholds**: Customizable for CPU, memory, response time, and error rate

## 🛠️ Available Scripts

```bash
npm run dev          # Start frontend development server
npm run backend      # Start Python backend server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run install-deps # Install all dependencies
```

## 🚨 Troubleshooting

### Microphone Not Working
1. **Check browser support**: Use Chrome, Edge, or Safari for best results
2. **Check permissions**: Ensure microphone access is allowed
3. **Check hardware**: Verify microphone is connected and working
4. **Check HTTPS**: Some browsers require HTTPS for microphone access in production

### Backend Connection Issues
1. Ensure Python backend is running on port 8000
2. Check console for connection errors
3. Verify Python dependencies are installed
4. Restart both frontend and backend if needed

### Performance Issues
1. Close unnecessary browser tabs
2. Check network connection stability
3. Monitor system resources using the built-in performance monitor
4. Clear browser cache if needed

### Common Error Messages

| Error | Solution |
|-------|----------|
| "Speech recognition not supported" | Use Chrome, Edge, or Safari |
| "Backend not available" | Start the Python backend server |
| "Microphone permission denied" | Allow microphone access in browser settings |
| "Form submission failed" | Check backend server status |

## 🔒 Security & Privacy

- **Local Processing**: All voice processing happens locally when possible
- **No Data Storage**: Conversations are not permanently stored
- **Secure Communication**: HTTPS recommended for production deployment
- **Privacy First**: No personal data is transmitted without explicit user action

## 🌐 Deployment

### Production Deployment

The application is production-ready and can be deployed to any static hosting service:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service (Netlify, Vercel, etc.)

3. **Deploy the backend** to a cloud service (Heroku, AWS, etc.)

4. **Update API endpoints** in the frontend to point to your production backend

### Environment Variables

For production deployment, configure these environment variables:

```bash
VITE_API_URL=https://your-backend-url.com
VITE_ENVIRONMENT=production
```

## 📞 Support & Contact

**Developer**: Arif Rahman Sikder  
**Email**: arifrahman78640@gmail.com  
**GitHub**: 

## 🎯 Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Python 3, Flask, psutil
- **Voice**: Web Speech API, Speech Synthesis API
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Deployment**: Netlify (frontend), Python server (backend)

## 📈 Performance Metrics

The application continuously monitors and reports:

- **CPU Usage**: Real-time processor utilization
- **Memory Usage**: RAM consumption tracking
- **Response Time**: API and voice processing latency
- **Throughput**: Requests processed per second
- **Error Rate**: Failed request percentage
- **Active Connections**: Concurrent user sessions

## 🎉 Getting Started

1. **Install dependencies** using the provided script
2. **Start both servers** (frontend and backend)
3. **Allow microphone permissions** in your browser
4. **Test voice commands** using the provided examples
5. **Explore the features** including form management and performance monitoring

The application is designed to work out of the box with minimal configuration. For the best experience, use Chrome or Edge browsers and ensure a stable internet connection.

---

**Enjoy your conversational AI assistant! 🤖✨**
