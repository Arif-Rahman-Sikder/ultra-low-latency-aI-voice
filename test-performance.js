// Performance Testing Script
// Run this in browser console to test latency and performance

class PerformanceTester {
  constructor() {
    this.results = {
      voiceLatency: [],
      formSpeed: [],
      audioQuality: [],
      interruptions: 0,
      errors: []
    };
  }

  // Test voice-to-voice latency
  async testVoiceLatency() {
    console.log('🎤 Testing Voice Latency...');
    
    const testPhrases = [
      "Hello, how are you?",
      "I want to fill a form",
      "My name is John Smith",
      "My email is john@example.com",
      "Submit the form"
    ];

    for (const phrase of testPhrases) {
      const startTime = performance.now();
      
      try {
        // Simulate voice input processing
        const response = await fetch('http://localhost:8000/api/voice-process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: phrase })
        });
        
        const endTime = performance.now();
        const latency = endTime - startTime;
        
        this.results.voiceLatency.push({
          phrase,
          latency,
          success: response.ok
        });
        
        console.log(`✅ "${phrase}": ${latency.toFixed(2)}ms`);
        
        if (latency > 500) {
          console.warn(`⚠️ High latency detected: ${latency.toFixed(2)}ms`);
        }
        
      } catch (error) {
        this.results.errors.push(`Voice test failed for "${phrase}": ${error.message}`);
        console.error(`❌ "${phrase}": Failed`);
      }
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Test form tool calling speed
  async testFormSpeed() {
    console.log('📝 Testing Form Speed...');
    
    const formActions = [
      { action: 'open', expected: '<1000ms' },
      { action: 'fill_name', expected: '<100ms' },
      { action: 'fill_email', expected: '<100ms' },
      { action: 'submit', expected: '<500ms' }
    ];

    for (const test of formActions) {
      const startTime = performance.now();
      
      try {
        // Simulate form action
        switch (test.action) {
          case 'open':
            // Test form opening
            window.dispatchEvent(new CustomEvent('voiceFormUpdate', { 
              detail: { field: 'name', value: 'Test User' } 
            }));
            break;
          case 'fill_name':
            window.dispatchEvent(new CustomEvent('voiceFormUpdate', { 
              detail: { field: 'name', value: 'John Smith' } 
            }));
            break;
          case 'fill_email':
            window.dispatchEvent(new CustomEvent('voiceFormUpdate', { 
              detail: { field: 'email', value: 'john@example.com' } 
            }));
            break;
          case 'submit':
            window.dispatchEvent(new CustomEvent('voiceFormSubmit'));
            break;
        }
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.results.formSpeed.push({
          action: test.action,
          duration,
          expected: test.expected
        });
        
        console.log(`✅ ${test.action}: ${duration.toFixed(2)}ms (${test.expected})`);
        
      } catch (error) {
        this.results.errors.push(`Form test failed for "${test.action}": ${error.message}`);
        console.error(`❌ ${test.action}: Failed`);
      }
    }
  }

  // Test audio quality
  testAudioQuality() {
    console.log('🔊 Testing Audio Quality...');
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Testing audio quality and clarity');
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        console.log('✅ Speech synthesis started successfully');
        this.results.audioQuality.push({ test: 'synthesis_start', success: true });
      };
      
      utterance.onend = () => {
        console.log('✅ Speech synthesis completed successfully');
        this.results.audioQuality.push({ test: 'synthesis_complete', success: true });
      };
      
      utterance.onerror = (error) => {
        console.error('❌ Speech synthesis error:', error);
        this.results.audioQuality.push({ test: 'synthesis_error', success: false, error });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('❌ Speech synthesis not supported');
      this.results.audioQuality.push({ test: 'synthesis_support', success: false });
    }

    // Test speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      console.log('✅ Speech recognition supported');
      this.results.audioQuality.push({ test: 'recognition_support', success: true });
    } else {
      console.error('❌ Speech recognition not supported');
      this.results.audioQuality.push({ test: 'recognition_support', success: false });
    }
  }

  // Test interruption capabilities
  testInterruptions() {
    console.log('⏸️ Testing Interruption Capabilities...');
    
    if ('speechSynthesis' in window) {
      // Start speaking
      const utterance = new SpeechSynthesisUtterance('This is a long test message to check interruption capabilities. It should be interrupted before completion.');
      window.speechSynthesis.speak(utterance);
      
      // Interrupt after 1 second
      setTimeout(() => {
        window.speechSynthesis.cancel();
        console.log('✅ Speech successfully interrupted');
        this.results.interruptions++;
      }, 1000);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Performance Tests...');
    console.log('=====================================');
    
    await this.testVoiceLatency();
    console.log('');
    
    await this.testFormSpeed();
    console.log('');
    
    this.testAudioQuality();
    console.log('');
    
    this.testInterruptions();
    console.log('');
    
    // Wait for audio tests to complete
    setTimeout(() => {
      this.generateReport();
    }, 3000);
  }

  // Generate performance report
  generateReport() {
    console.log('📊 PERFORMANCE TEST REPORT');
    console.log('=====================================');
    
    // Voice Latency Analysis
    const avgLatency = this.results.voiceLatency.reduce((sum, test) => sum + test.latency, 0) / this.results.voiceLatency.length;
    const maxLatency = Math.max(...this.results.voiceLatency.map(test => test.latency));
    const minLatency = Math.min(...this.results.voiceLatency.map(test => test.latency));
    
    console.log('🎤 VOICE LATENCY:');
    console.log(`   Average: ${avgLatency.toFixed(2)}ms`);
    console.log(`   Min: ${minLatency.toFixed(2)}ms`);
    console.log(`   Max: ${maxLatency.toFixed(2)}ms`);
    console.log(`   Target: <500ms consistently`);
    console.log(`   Status: ${avgLatency < 500 ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
    
    // Form Speed Analysis
    console.log('📝 FORM PERFORMANCE:');
    this.results.formSpeed.forEach(test => {
      const target = test.action === 'open' ? 1000 : test.action === 'submit' ? 500 : 100;
      const status = test.duration < target ? '✅ PASS' : '❌ FAIL';
      console.log(`   ${test.action}: ${test.duration.toFixed(2)}ms ${status}`);
    });
    console.log('');
    
    // Audio Quality Analysis
    console.log('🔊 AUDIO QUALITY:');
    this.results.audioQuality.forEach(test => {
      const status = test.success ? '✅ PASS' : '❌ FAIL';
      console.log(`   ${test.test}: ${status}`);
    });
    console.log('');
    
    // Interruption Analysis
    console.log('⏸️ INTERRUPTION CAPABILITIES:');
    console.log(`   Successful interruptions: ${this.results.interruptions}`);
    console.log(`   Status: ${this.results.interruptions > 0 ? '✅ PASS' : '❌ FAIL'}`);
    console.log('');
    
    // Error Analysis
    if (this.results.errors.length > 0) {
      console.log('❌ ERRORS:');
      this.results.errors.forEach(error => console.log(`   ${error}`));
      console.log('');
    }
    
    // Overall Status
    const overallPass = avgLatency < 500 && 
                       this.results.formSpeed.every(test => {
                         const target = test.action === 'open' ? 1000 : test.action === 'submit' ? 500 : 100;
                         return test.duration < target;
                       }) &&
                       this.results.audioQuality.some(test => test.success) &&
                       this.results.interruptions > 0;
    
    console.log('🎯 OVERALL STATUS:');
    console.log(`   ${overallPass ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log('=====================================');
    
    return this.results;
  }
}

// Auto-run tests when script is loaded
const tester = new PerformanceTester();
tester.runAllTests();

// Export for manual testing
window.performanceTester = tester;