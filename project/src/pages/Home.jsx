import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/common/Header';
import Carousel from '../components/carousel/Carousel';
import NewsSection from '../components/news/NewsSection';
import { FiMic, FiEdit3, FiCamera, FiImage, FiSend, FiLoader, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import PlantRecognition from '../Components/PlantRecognition';
import VoiceAssistant from '../Components/VoiceAssistant';

const Home = () => {
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [showPlantRecognition, setShowPlantRecognition] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  
  const navigate = useNavigate();
  const { t, changeLanguage } = useTranslation();

  // Sample crop data
  const cropData = [
    { crop: 'Wheat', price: 2620, change: '+2.5%' },
    { crop: 'Rice', price: 4600, change: '-1.2%' },
    { crop: 'Maize', price: 2443.52, change: '+0.8%' },
    { crop: 'Sugarcane', price: 355, change: '+1.5%' },
    { crop: 'Cotton', price: 6300, change: '-0.5%' },
    { crop: 'Soybean', price: 4680, change: '+3.1%' },
    { crop: 'Potato', price: 1797.31, change: '+4.2%' },
    { crop: 'Onion', price: 1987, change: '-2.1%' },
  ];

  useEffect(() => {
    // Check if user has completed registration
    const storedUserData = localStorage.getItem('userData');
    const userId = localStorage.getItem('userId');
    
    if (!storedUserData || !userId) {
      navigate('/');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      
      // Set the language based on user preference
      if (parsedUserData.language) {
        changeLanguage(parsedUserData.language);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/');
    }
  }, [navigate, changeLanguage]);

  const handleVoiceAssistant = () => {
    setShowVoiceAssistant(true);
  };

  const closeVoiceAssistant = () => {
    setShowVoiceAssistant(false);
  };

  const handleImageUpload = (event) => {
    const image = event.target.files[0];
    if (image) {
      setUploadedFiles(prev => [...prev, { name: image.name, type: 'image' }]);
    }
  };

  const handleQuerySubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        console.log('Query processed:', query);
        console.log('Uploaded files:', uploadedFiles);
      }, 2000);
    }
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openPlantRecognition = () => {
    setShowPlantRecognition(true);
  };

  const closePlantRecognition = () => {
    setShowPlantRecognition(false);
  };

  if (!userData) {
    return <div className="min-h-screen min-w-max bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
    </div>;
  }

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 m-0 p-0">
      <Header userData={userData} />
      <Carousel items={cropData} />
      
      <main className="w-full px-6 py-8">
        {/* Personalized Welcome */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-2">
            {t('common.welcome')}, {userData.name}! 
            <span className="text-gray-400 text-lg ml-2">{userData.location}</span>
          </h2>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent mb-6">
            {t('home.title')}
          </h1>
          <div className="relative">
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
              {t('home.tagline')}
            </p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500"></div>
          </div>
        </div>

        {/* Voice-First Query Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/90 backdrop-blur-sm shadow-2xl border border-green-700 overflow-hidden rounded-xl">
            
            {/* Voice Input Section */}
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-6">AI Voice Assistant</h2>
              
              {/* Large Voice Button */}
              <button
                type="button"
                onClick={handleVoiceAssistant}
                className="relative w-32 h-32 mx-auto mb-6 text-white font-bold text-lg transition-all duration-300 transform hover:scale-110 shadow-2xl bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full"
              >
                <FiMic className="text-4xl mx-auto" />
                <div className="text-sm mt-2">Voice Assistant</div>
              </button>

              {/* Quick Voice Features */}
              <div className="mb-6">
                <p className="text-gray-300 text-sm mb-3">
                  Ask about farming, crops, weather, plant diseases, or agricultural advice
                </p>
              </div>

              {/* Text Input Toggle */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowTextInput(!showTextInput)}
                  className="flex items-center gap-2 mx-auto text-green-400 hover:text-green-300 transition-colors"
                >
                  <FiEdit3 />
                  {t('home.typeToWrite')}
                </button>
              </div>

              {/* Collapsible Text Input */}
              {showTextInput && (
                <div className="animate-slideDown">
                  <form onSubmit={handleQuerySubmit} className="space-y-6">
                    <div className="relative">
                      <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('home.textPrompt')}
                        className="w-full p-4 text-lg border-2 border-green-600 bg-slate-700 text-white focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 resize-none shadow-inner placeholder-gray-400 rounded-lg"
                        rows="3"
                      />
                    </div>

                    {/* File Upload and Camera Options */}
                    <div className="flex flex-wrap gap-4 justify-center">
                      <button
                        type="button"
                        onClick={openPlantRecognition}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 transition-all duration-300 transform hover:scale-105 shadow-md font-bold rounded-lg"
                      >
                        <FiCamera />
                        Plant Recognition
                      </button>

                      <label className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md rounded-md">
                        <FiImage />
                        {t('home.uploadImage')}
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </label>

                      <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-6 py-2 transition-all duration-300 transform hover:scale-105 shadow-md font-semibold rounded-md"
                      >
                        {isLoading ? (
                          <FiLoader className="animate-spin" />
                        ) : (
                          <FiSend />
                        )}
                        {isLoading ? t('home.processing') : t('home.submitQuery')}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Uploaded Files Display */}
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-green-800 px-3 py-2 border border-green-600 rounded-md">
                      <span className="text-sm text-green-200">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeUploadedFile(index)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Voice Assistant Modal */}
        {showVoiceAssistant && (
          <VoiceAssistant 
            onClose={closeVoiceAssistant}
            userLanguage={userData.language || 'en'}
          />
        )}

        {/* Plant Recognition Modal */}

      {/* Plant Recognition Modal */}
      {showPlantRecognition && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 overflow-auto">
          <div className="min-h-screen p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Plant Recognition</h2>
              <button
                onClick={closePlantRecognition}
                className="text-white hover:text-red-400 text-3xl"
              >
                <FiX />
              </button>
            </div>
            {/* Pass the user's language as a prop here */}
            <PlantRecognition 
              onClose={closePlantRecognition} 
              userLanguage={userData.language || 'en'} 
            />
          </div>
        </div>
      )}


        {/* News Section with Language Support */}
        <NewsSection />
      </main>
    </div>
  );
};

export default Home;
