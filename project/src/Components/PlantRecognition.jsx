import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PlantRecognition = ({ onClose }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [status, setStatus] = useState('offline');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize Gemini AI - Replace with your API key
  const genAI = new GoogleGenerativeAI(Gemini_api_key);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    // Auto-start camera when component mounts
    startCamera();

    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(''), 5000);
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(''), 3000);
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          videoRef.current.play();
        };
        
        videoRef.current.onplaying = () => {
          console.log('Video started playing');
          setIsStreaming(true);
          setStatus('online');
          showSuccess('Camera started successfully! 📹');
        };
      }
      
    } catch (error) {
      console.error('Camera error:', error);
      let errorMessage = 'Camera access failed. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and refresh the page.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage += 'Camera not supported in this browser.';
      } else {
        errorMessage += error.message;
      }
      
      showError(errorMessage);
      setStatus('offline');
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped');
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
    setStatus('offline');
  };

  const captureAndAnalyze = async () => {
    if (!isStreaming || !videoRef.current || !videoRef.current.videoWidth || !videoRef.current.videoHeight) {
      showError('Camera not ready. Please wait for video to load completely.');
      return;
    }
    
    console.log('Capturing image...');
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // Draw the video frame to canvas
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Get the image data URL for display
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    
    // Show loading state
    setIsAnalyzing(true);
    setStatus('analyzing');
    
    // Update analysis result with loading message
    setAnalysisResult(`🔍 Analyzing Plant...\n\nAI is examining your plant image and will provide detailed analysis including:\n\n• Plant identification\n• Health assessment\n• Care recommendations\n• Treatment suggestions\n\nPlease wait...`);

    try {
      // Convert canvas to base64 for API
      const base64Image = imageDataUrl.split(',')[1];
      
      console.log('Image captured, sending to API...');

      // Enhanced prompt for better analysis
      const prompt = `Analyze this plant image in detail and provide a comprehensive assessment. Please format your response clearly with the following sections:

**🌿 PLANT IDENTIFICATION:**
- Common name and scientific name
- Plant family and type
- Key identifying features

**🩺 HEALTH ASSESSMENT:**
- Overall health status (Excellent/Good/Fair/Poor)
- Any visible diseases, pests, or issues
- Signs of stress, nutrient deficiency, or environmental problems
- Leaf condition, color, and texture analysis

**💡 CARE RECOMMENDATIONS:**
- Immediate actions needed (if any)
- Optimal growing conditions (light, water, soil, humidity)
- Seasonal care tips
- Fertilization recommendations

**🏥 TREATMENT & PREVENTION:**
- Specific treatments for any identified problems
- Prevention methods for common issues
- Timeline for recovery (if treatment needed)
- When to seek professional help

**📋 SUMMARY:**
- Quick assessment in 1-2 sentences
- Priority actions (if any)

Please be specific and practical in your recommendations. If you cannot clearly identify the plant or see any issues, please state that clearly.`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        }
      ]);

      console.log('API Response received');
      
      const textResponse = result.response.text();
      const timestamp = new Date().toLocaleString();
      
      // Display the response with formatting
      const formattedResult = `📅 Analysis completed: ${timestamp}\n\n${textResponse}`;
      setAnalysisResult(formattedResult);
      
      setStatus('online');
      showSuccess('Analysis completed! 🎉');

    } catch (error) {
      console.error('Analysis error:', error);
      showError(`Analysis failed: ${error.message}`);
      setStatus('online');
      
      setAnalysisResult(` XX Analysis Failed\n\n${error.message}\n\nPossible solutions:\n• Check your internet connection\n• Ensure the image shows a clear view of the plant\n• Try capturing again with better lighting\n• Make sure the plant fills most of the frame`);
    }
    
    setIsAnalyzing(false);
  };

  const clearResults = () => {
    setAnalysisResult('');
    setCapturedImage(null);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'analyzing': return 'bg-orange-500 animate-pulse';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-lg">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg mb-4 text-sm">
          ✅ {success}
        </div>
      )}

      {/* Main Camera Section - Google Lens Style */}
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        {/* Camera Preview Section */}
        <div className="flex-1 min-w-0">
          <div className="relative bg-slate-800 rounded-xl overflow-hidden shadow-2xl border border-green-500/30 h-96 lg:h-full">
            {/* Video Stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Camera Overlay */}
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="text-center p-6">
                  <h3 className="text-xl font-bold mb-2">📷 Initializing Camera...</h3>
                  <p className="text-gray-300">Please allow camera permissions</p>
                </div>
              </div>
            )}

            {/* Capture Button Overlay */}
            {isStreaming && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={captureAndAnalyze}
                  disabled={isAnalyzing}
                  className={`w-16 h-16 rounded-full border-4 border-white shadow-2xl transition-all duration-300 ${
                    isAnalyzing 
                      ? 'bg-orange-500 animate-pulse' 
                      : 'bg-green-500 hover:bg-green-600 hover:scale-110'
                  }`}
                >
                  {isAnalyzing ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <div className="text-2xl">📸</div>
                  )}
                </button>
              </div>
            )}

            {/* Status Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className={`w-2 h-2 rounded-full ${getStatusColor()}`}></span>
              <span className="text-xs font-medium">
                {status === 'analyzing' ? 'Analyzing...' : status === 'online' ? 'Live' : 'Offline'}
              </span>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>

        {/* Analysis Results Section - Google Lens Style */}
        <div className="flex-1 min-w-0">
          <div className="bg-slate-800/95 rounded-xl p-4 border border-green-500/30 shadow-2xl h-96 lg:h-full flex flex-col">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-green-500/30">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${getStatusColor()}`}></span>
                <h3 className="text-lg font-bold">🔍 Plant Analysis</h3>
              </div>
              {analysisResult && (
                <button
                  onClick={clearResults}
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Clear
                </button>
              )}
            </div>
            
            {/* Captured Image Preview */}
            {capturedImage && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-green-400">📷 Captured Image:</span>
                </div>
                <img 
                  src={capturedImage} 
                  alt="Captured plant" 
                  className="w-full h-20 object-cover rounded-lg border border-green-500/30"
                />
              </div>
            )}
            
            {/* Analysis Results Area */}
            <div className="flex-1 bg-slate-900/80 rounded-lg p-4 overflow-y-auto border border-slate-700">
              {analysisResult ? (
                <pre className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {analysisResult}
                </pre>
              ) : (
                <div className="text-center text-gray-400 flex flex-col items-center justify-center h-full">
                  <div className="text-4xl mb-4">🌿</div>
                  <h4 className="font-bold mb-2">Ready to Analyze Plants</h4>
                  <p className="text-sm">Point camera at a plant and tap the capture button</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={startCamera}
          disabled={isStreaming}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-all"
        >
          Start Camera
        </button>
        
        <button
          onClick={stopCamera}
          disabled={!isStreaming}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-all"
        >
           Stop Camera
        </button>
        
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium transition-all"
          >
            ✕ Close
          </button>
        )}
      </div>
    </div>
  );
};

export default PlantRecognition;
