# Conversational AI Assistant Application

A modern conversational AI assistant built with React, TypeScript, and Python backend integration.

## Features

- Real-time voice conversation capabilities
- Performance monitoring and analytics
- Form management for user interactions
- Backend server with Python integration
- Modern React frontend with TypeScript

## Project Structure

```
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
├── package.json                 # Project dependencies
└── README.md                    # Project documentation
```

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- Python 3.7+
- Modern web browser (Chrome, Edge, or Safari recommended for voice features)

### Step 1: Clone/Download the Project
```bash
# If you have the project files, navigate to the project directory
cd conversational-ai-assistant
```

### Step 2: Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
pip install psutil requests flask
```

### Step 3: Start the Backend Server
```bash
# Start the Python backend server
npm run backend
# OR manually:
python scripts/backend_server.py
```
The backend will start on `http://localhost:8000`

### Step 4: Start the Frontend Development Server
```bash
# In a new terminal, start the frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### Step 5: Access the Application
1. Open your browser and go to `http://localhost:5173`
2. **Important**: Allow microphone permissions when prompted
3. Click "Start Chat" to access the conversational interface

## 🎤 Voice Features Setup

### Browser Compatibility
- **Chrome**: Full support ✅
- **Edge**: Full support ✅
- **Safari**: Full support ✅
- **Firefox**: Limited support ⚠️

### Microphone Permissions
1. When you first click the microphone button, your browser will ask for permission
2. Click "Allow" to enable voice features
3. If you accidentally denied permission:
   - **Chrome/Edge**: Click the microphone icon in the address bar
   - **Safari**: Go to Safari > Settings > Websites > Microphone

### Testing Voice Commands
Try these voice commands:
- "I want to fill a form" → Opens form
- "My name is John Smith" → Updates name field
- "My email is john@example.com" → Updates email field
- "Submit the form" → Submits the form

## 🧪 Testing & Performance

### Run Performance Tests
1. Open browser console (F12)
2. The performance tests will run automatically
3. Or manually run: `window.performanceTester.runAllTests()`

### Performance Targets
- ✅ Voice latency < 500ms
- ✅ Form updates < 100ms
- ✅ Audio quality: Clear and natural
- ✅ Interruption capability: Immediate

## 🛠️ Troubleshooting

### Microphone Not Working
1. **Check browser support**: Use Chrome, Edge, or Safari
2. **Check permissions**: Allow microphone access
3. **Check microphone**: Ensure it's connected and working
4. **Check HTTPS**: Some browsers require HTTPS for microphone access

### Backend Connection Issues
1. Ensure Python backend is running on port 8000
2. Check console for connection errors
3. Restart both frontend and backend if needed

### Performance Issues
1. Close other browser tabs
2. Check network connection
3. Monitor performance using the built-in performance monitor

## 📝 Available Scripts

```bash
npm run dev          # Start frontend development server
npm run backend      # Start Python backend server
npm run build        # Build for production
npm run preview      # Preview production build
npm run install-deps # Install all dependencies
```

## 🔧 Configuration

### Voice Settings
- Language: Configurable in voice agent settings
- Volume: 0-100% adjustable
- Speech rate: Optimized for clarity

### Backend Configuration
- Port: 8000 (configurable in backend_server.py)
- CORS: Enabled for localhost development
- Endpoints: /api/voice-process, /api/forms, /api/metrics

## 📞 Contact

**Developer**: Arif Rahman Sikder  
**Email**: arifrahman78640@gmail.com  


## 🎯 Key Features Implemented

1. **Voice Recognition**: Real-time speech-to-text
2. **Voice Synthesis**: Natural text-to-speech
3. **Form Integration**: Voice commands control forms
4. **Performance Monitoring**: Real-time metrics
5. **Error Handling**: Comprehensive fallbacks
6. **Cross-browser Support**: Works on major browsers

## 🚨 Important Notes

- **Microphone Permission**: Required for voice features
- **HTTPS**: May be required in production for microphone access
- **Browser Support**: Best experience on Chrome/Edge/Safari
- **Network**: Backend must be running for full functionality

Enjoy your conversational AI assistant! 🤖✨
