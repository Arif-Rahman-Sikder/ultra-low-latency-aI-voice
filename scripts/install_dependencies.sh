#!/bin/bash

# Install Dependencies Script for Conversational AI Assistant
# This script installs all required dependencies for the project

set -e  # Exit on any error

echo "🚀 Installing Conversational AI Assistant Dependencies..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ Python version: $(python3 --version)"

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip3 install --user psutil

# Optional: Install additional Python packages for enhanced functionality
echo "🔧 Installing optional Python packages..."
pip3 install --user requests flask

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p logs
mkdir -p data
mkdir -p temp

# Set executable permissions for scripts
echo "🔐 Setting executable permissions..."
chmod +x scripts/backend_server.py
chmod +x scripts/install_dependencies.sh

# Verify installations
echo "🔍 Verifying installations..."

# Check Node.js packages
if npm list react &> /dev/null; then
    echo "✅ React installed successfully"
else
    echo "❌ React installation failed"
    exit 1
fi

if npm list typescript &> /dev/null; then
    echo "✅ TypeScript installed successfully"
else
    echo "❌ TypeScript installation failed"
    exit 1
fi

# Check Python packages
if python3 -c "import psutil" &> /dev/null; then
    echo "✅ psutil installed successfully"
else
    echo "❌ psutil installation failed"
    exit 1
fi

echo ""
echo "🎉 All dependencies installed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Start the backend server: npm run backend"
echo "3. Open your browser to http://localhost:5173"
echo ""
echo "🔗 Useful commands:"
echo "  npm run dev      - Start frontend development server"
echo "  npm run backend  - Start Python backend server"
echo "  npm run build    - Build for production"
echo "  npm run preview  - Preview production build"
echo ""
echo "📚 For more information, check the README.md file"