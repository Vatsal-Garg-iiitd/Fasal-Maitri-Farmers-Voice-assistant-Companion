import React, { useState, useRef, useEffect } from 'react';
import { FiMic, FiMicOff, FiVolume2, FiVolumeX, FiGlobe, FiX, FiLoader } from 'react-icons/fi';

const VoiceAssistant = ({ onClose, userLanguage = 'en' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(userLanguage);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioPlayerRef = useRef(null);

  // Language options
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
  ];

  const API_BASE_URL = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:3000';

  useEffect(() => {
    setSelectedLanguage(userLanguage);
  }, [userLanguage]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
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

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      streamRef.current = stream;
      
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder is not supported in this browser');
      }

      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create MediaRecorder with proper format
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        console.log('Data available:', event.data.size);
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        console.log('Recording stopped, processing audio...');
        
        // Check if we have audio data
        if (audioChunksRef.current.length === 0) {
          showError('No audio data recorded. Please try again.');
          setStatus('idle');
          setIsProcessing(false);
          return;
        }

        // Create blob from recorded chunks - THIS is where audioBlob2 should be created
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm' 
        });
        
        console.log('Audio blob created:', audioBlob.size, 'bytes');
        
        if (audioBlob.size === 0) {
          showError('Recorded audio is empty. Please try again.');
          setStatus('idle');
          setIsProcessing(false);
          return;
        }

        // Process the audio
        await processAudioWithFlask(audioBlob);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        showError(`Recording failed: ${event.error}`);
        setStatus('idle');
        setIsRecording(false);
        setIsProcessing(false);
      };
      
      // Start recording
      mediaRecorder.start(1000); // Collect data every 1 second
      setIsRecording(true);
      setStatus('recording');
      showSuccess('Recording started! 🎤 Speak now...');
      
    } catch (err) {
      console.error('Recording error:', err);
      let errorMessage = 'Microphone access failed. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Please allow microphone permissions and refresh the page.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No microphone found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Audio recording not supported in this browser.';
      } else {
        errorMessage += err.message;
      }
      
      showError(errorMessage);
      setStatus('idle');
      setIsRecording(false);
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    console.log('Stopping recording...');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
    setStatus('processing');
    setIsProcessing(true);
    showSuccess('Processing your voice... 🤖');
  };

  const processAudioWithFlask = async (audioBlob) => {
  try {
    console.log('Processing audio with Flask...', audioBlob.size, 'bytes');
    setIsProcessing(true);
    setStatus('processing');

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('lang', selectedLanguage);

    console.log('Sending request to:', `${API_BASE_URL}/ask_audio`);

    const response = await fetch(`${API_BASE_URL}/ask_audio`, {
      method: 'POST',
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      
      // Check content type first, then read body only once
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const errorData = await response.json(); // Read as JSON
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Failed to parse JSON error:', jsonError);
          errorMessage = `Server error: ${response.status}`;
        }
      } else {
        try {
          const errorText = await response.text(); // Read as text
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error('Failed to read error text:', textError);
          errorMessage = `Server error: ${response.status}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    // For successful responses, check content type
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Unknown server error');
    }

    // Handle audio response - read as blob
    const responseAudioBlob = await response.blob();
    console.log('Received audio response:', responseAudioBlob.size, 'bytes');
    
    if (responseAudioBlob.size === 0) {
      throw new Error('Received empty audio response');
    }
    
    const audioUrl = URL.createObjectURL(responseAudioBlob);
    
    // Play the response audio
    await playAudioResponse(audioUrl);
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, {
      timestamp: new Date().toLocaleString(),
      language: languages.find(lang => lang.code === selectedLanguage)?.nativeName,
      audioUrl: audioUrl,
      id: Date.now()
    }]);

    setStatus('complete');
    showSuccess('Response received! 🎉 Playing audio...');

  } catch (error) {
    console.error('Processing error:', error);
    setStatus('error');
    showError(`Processing failed: ${error.message}`);
  } finally {
    setIsProcessing(false);
  }
};


  const playAudioResponse = (audioUrl) => {
    return new Promise((resolve, reject) => {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onloadstart = () => {
        setIsPlaying(true);
        setStatus('speaking');
      };

      audio.onended = () => {
        setIsPlaying(false);
        setStatus('idle');
        resolve();
      };

      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsPlaying(false);
        setStatus('error');
        showError('Failed to play audio response');
        reject(error);
      };

      audio.play().catch(reject);
    });
  };

  const stopAudio = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
      setIsPlaying(false);
      setStatus('idle');
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  const replayAudio = async (audioUrl) => {
    try {
      await playAudioResponse(audioUrl);
    } catch (error) {
      showError('Failed to replay audio');
    }
  };

  const clearHistory = () => {
    setConversationHistory([]);
    conversationHistory.forEach(item => {
      URL.revokeObjectURL(item.audioUrl);
    });
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'recording': return '🎤 Recording... Click to stop';
      case 'processing': return '🤖 Processing your voice...';
      case 'speaking': return '🔊 Playing response...';
      case 'complete': return '✅ Ready for next question';
      case 'error': return '❌ Error occurred. Try again';
      default: return '🎯 Ready to listen. Click microphone to start';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'recording': return 'bg-red-500 animate-pulse';
      case 'processing': return 'bg-yellow-500 animate-pulse';
      case 'speaking': return 'bg-green-500 animate-pulse';
      case 'complete': return 'bg-blue-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-green-500/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-green-500/30">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">🎤 AI Voice Assistant</h2>
            <div className={`px-3 py-1 rounded-full ${getStatusColor()} text-white text-sm font-medium`}>
              {status}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <FiGlobe className="text-green-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={isRecording || isProcessing}
                className="bg-slate-700 text-white border border-green-500/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mx-6 mt-4 bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}
        
        {success && (
          <div className="mx-6 mt-4 bg-green-500/20 border border-green-500/50 text-green-400 p-3 rounded-lg text-sm">
            ✅ {success}
          </div>
        )}

        {/* Status Display */}
        <div className="p-4 bg-slate-700/50 border-b border-green-500/20">
          <div className="text-center">
            <p className="text-lg font-medium text-white">
              {getStatusMessage()}
            </p>
            {selectedLanguage !== 'en' && (
              <p className="text-sm text-gray-400 mt-1">
                Speaking in: {languages.find(lang => lang.code === selectedLanguage)?.nativeName}
              </p>
            )}
          </div>
        </div>

        {/* Main Voice Interface */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          {/* Large Voice Button */}
          <button
            onClick={toggleRecording}
            disabled={isProcessing && !isRecording}
            className={`relative w-40 h-40 mx-auto mb-8 text-white font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl ${
              isRecording 
                ? 'bg-gradient-to-br from-red-500 to-red-600 animate-pulse' 
                : isPlaying
                ? 'bg-gradient-to-br from-green-500 to-green-600 animate-pulse'
                : isProcessing
                ? 'bg-gradient-to-br from-yellow-500 to-orange-500'
                : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            }`}
            style={{borderRadius: '50%'}}
          >
            {isRecording ? (
              <FiMicOff className="text-5xl mx-auto" />
            ) : isPlaying ? (
              <FiVolume2 className="text-5xl mx-auto" />
            ) : isProcessing ? (
              <FiLoader className="text-5xl mx-auto animate-spin" />
            ) : (
              <FiMic className="text-5xl mx-auto" />
            )}
            
            {isRecording && (
              <div className="absolute -inset-3 border-4 border-red-400 animate-ping" style={{borderRadius: '50%'}}></div>
            )}
            
            {isPlaying && (
              <div className="absolute -inset-3 border-4 border-green-400 animate-ping" style={{borderRadius: '50%'}}></div>
            )}
          </button>

          {/* Control Buttons */}
          <div className="flex gap-4 mb-6">
            {isPlaying && (
              <button
                onClick={stopAudio}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                <FiVolumeX />
                Stop Audio
              </button>
            )}
            
            {conversationHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
              >
                Clear History
              </button>
            )}
          </div>

          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="w-full bg-slate-900/80 rounded-xl p-6 border border-slate-700 max-h-60 overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-4">📋 Conversation History</h3>
              <div className="space-y-4">
                {conversationHistory.slice(-5).reverse().map((item) => (
                  <div key={item.id} className="bg-slate-800 rounded-lg p-4 border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{item.timestamp}</span>
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                          {item.language}
                        </span>
                      </div>
                      <button
                        onClick={() => replayAudio(item.audioUrl)}
                        className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-all"
                      >
                        <FiVolume2 className="text-xs" />
                        Replay
                      </button>
                    </div>
                    <div className="text-sm text-gray-300">
                      Audio response available in {item.language}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-green-500/30 text-center">
          <p className="text-sm text-gray-400">
            💡 Speak clearly and ask questions about farming, agriculture, crops, or plant care
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Powered by Whisper AI, Gemini AI & Google Translate
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
