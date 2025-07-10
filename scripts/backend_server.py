#!/usr/bin/env python3
"""
Backend Server for Conversational AI Assistant
Handles voice processing, form management, and performance monitoring
"""

import json
import time
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConversationalAIHandler(BaseHTTPRequestHandler):
    """HTTP request handler for the conversational AI backend"""
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/health':
            self.handle_health_check()
        elif parsed_path.path == '/api/metrics':
            self.handle_metrics()
        else:
            self.send_error(404, "Endpoint not found")
    
    def do_POST(self):
        """Handle POST requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/voice-process':
            self.handle_voice_processing()
        elif parsed_path.path == '/api/forms':
            self.handle_form_submission()
        else:
            self.send_error(404, "Endpoint not found")
    
    def handle_health_check(self):
        """Health check endpoint"""
        response = {
            "status": "healthy",
            "timestamp": time.time(),
            "version": "1.0.0"
        }
        self.send_json_response(response)
    
    def handle_voice_processing(self):
        """Process voice input and generate AI response"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            user_input = data.get('input', '')
            logger.info(f"Processing voice input: {user_input}")
            
            # Simulate AI processing
            time.sleep(1)  # Simulate processing time
            
            # Generate response based on input
            response_text = self.generate_ai_response(user_input)
            
            response = {
                "response": response_text,
                "confidence": 0.95,
                "processing_time": 1.2,
                "timestamp": time.time()
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            logger.error(f"Error processing voice input: {e}")
            self.send_error(500, f"Voice processing error: {str(e)}")
    
    def handle_form_submission(self):
        """Handle form data submission"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            logger.info(f"Form submission received: {data}")
            
            # Simulate form processing
            form_id = f"form_{int(time.time())}"
            
            response = {
                "success": True,
                "form_id": form_id,
                "message": "Form submitted successfully",
                "timestamp": time.time()
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            logger.error(f"Error processing form: {e}")
            self.send_error(500, f"Form processing error: {str(e)}")
    
    def handle_metrics(self):
        """Return system performance metrics"""
        import psutil
        import random
        
        try:
            # Get real system metrics where possible, simulate others
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            
            metrics = {
                "cpu_usage": cpu_percent,
                "memory_usage": memory.percent,
                "response_time": random.uniform(100, 500),
                "throughput": random.uniform(500, 1000),
                "error_rate": random.uniform(0, 2),
                "active_connections": random.randint(10, 100),
                "timestamp": time.time()
            }
            
            self.send_json_response(metrics)
            
        except ImportError:
            # Fallback if psutil is not available
            metrics = {
                "cpu_usage": random.uniform(20, 80),
                "memory_usage": random.uniform(30, 70),
                "response_time": random.uniform(100, 500),
                "throughput": random.uniform(500, 1000),
                "error_rate": random.uniform(0, 2),
                "active_connections": random.randint(10, 100),
                "timestamp": time.time()
            }
            self.send_json_response(metrics)
        except Exception as e:
            logger.error(f"Error getting metrics: {e}")
            self.send_error(500, f"Metrics error: {str(e)}")
    
    def generate_ai_response(self, user_input):
        """Generate AI response based on user input"""
        user_input_lower = user_input.lower()
        
        # Handle form-related commands
        if "fill a form" in user_input_lower or "open form" in user_input_lower:
            return "I'll help you fill out a form. Please navigate to the Form Manager section and I can assist you with voice input."
        
        if "my name is" in user_input_lower:
            name_match = user_input.split("my name is")
            if len(name_match) > 1:
                name = name_match[1].strip()
                return f"Thank you, {name}. I've noted your name for the form. What's your email address?"
        
        if "my email is" in user_input_lower or "email is" in user_input_lower:
            return "Perfect! I've recorded your email address. What message would you like to include in the form?"
        
        if "submit the form" in user_input_lower or "submit form" in user_input_lower:
            return "I'll submit the form for you now. The form has been successfully submitted!"
        
        if "hello" in user_input_lower or "hi" in user_input_lower:
            return "Hello! I'm your AI assistant. How can I help you today?"
        elif "capabilities" in user_input_lower or "what can you do" in user_input_lower:
            return "I can help with voice conversations, answer questions, process forms, and provide assistance with various tasks. I'm designed to understand natural language and provide helpful responses."
        elif "weather" in user_input_lower:
            return "I don't have access to real-time weather data, but I can help you with other questions or tasks."
        elif "time" in user_input_lower:
            current_time = time.strftime("%I:%M %p")
            return f"The current time is {current_time}."
        elif "help" in user_input_lower:
            return "I'm here to help! You can ask me questions, have conversations, or use the form management features. What would you like assistance with?"
        else:
            return "That's an interesting question. I'm here to help with various tasks and conversations. Could you tell me more about what you need assistance with?"
    
    def send_json_response(self, data, status_code=200):
        """Send JSON response with CORS headers"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        
        response_json = json.dumps(data, indent=2)
        self.wfile.write(response_json.encode('utf-8'))
    
    def log_message(self, format, *args):
        """Override to use our logger"""
        logger.info(f"{self.address_string()} - {format % args}")

def run_server(port=8000):
    """Run the backend server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, ConversationalAIHandler)
    
    logger.info(f"Starting Conversational AI Backend Server on port {port}")
    logger.info(f"Server running at http://localhost:{port}")
    logger.info("Available endpoints:")
    logger.info("  GET  /api/health - Health check")
    logger.info("  GET  /api/metrics - Performance metrics")
    logger.info("  POST /api/voice-process - Voice processing")
    logger.info("  POST /api/forms - Form submission")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        logger.info("Server shutting down...")
        httpd.shutdown()

if __name__ == '__main__':
    import sys
    
    port = 8000
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            logger.error("Invalid port number")
            sys.exit(1)
    
    run_server(port)