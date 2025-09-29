import React, { useState } from 'react';
import { FiUser, FiMapPin, FiGlobe, FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE

const Landing = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    language: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { t, availableLanguages, changeLanguage } = useTranslation();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${API_BASE}/api/users`, formData);
      
      // Store both userId and complete user data
      localStorage.setItem('userId', res.data._id);
      
      // Store the complete user data including the language preference
      const userData = {
        _id: res.data._id,
        name: formData.name,
        location: formData.location,
        language: formData.language
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Navigate to home page
      navigate('/home');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed! Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setFormData({
      ...formData,
      language: selectedLanguage
    });
    
    // Change the UI language immediately
    if (selectedLanguage) {
      changeLanguage(selectedLanguage);
    }
  };

  const isFormValid = formData.name && formData.location && formData.language;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300 bg-clip-text text-transparent mb-4">
            {t('landing.title')}
          </h1>
          <p className="text-gray-300 text-lg">
            {t('landing.subtitle')}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto mt-2" style={{borderRadius: '2px'}}></div>
        </div>

        {/* Registration Form */}
        <div className="bg-slate-800/90 backdrop-blur-sm shadow-2xl border border-green-700 overflow-hidden" style={{borderRadius: '12px'}}>
          <div className="bg-gradient-to-r from-green-700 to-emerald-700 p-6 text-center">
            <h2 className="text-2xl font-bold text-white">{t('landing.welcomeMessage')}</h2>
            <p className="text-green-200 mt-1">{t('landing.description')}</p>
          </div>

          <div className="p-6 bg-slate-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FiUser className="inline mr-2" />
                  {t('landing.nameLabel')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('landing.namePlaceholder')}
                  className="w-full p-4 bg-slate-700 border-2 border-green-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                  style={{borderRadius: '8px'}}
                  required
                />
              </div>

              {/* Location Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FiMapPin className="inline mr-2" />
                  {t('landing.locationLabel')}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder={t('landing.locationPlaceholder')}
                  className="w-full p-4 bg-slate-700 border-2 border-green-600 text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                  style={{borderRadius: '8px'}}
                  required
                />
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <FiGlobe className="inline mr-2" />
                  {t('landing.languageLabel')}
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleLanguageChange}
                  className="w-full p-4 bg-slate-700 border-2 border-green-600 text-white focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                  style={{borderRadius: '8px'}}
                  required
                >
                  <option value="">{t('landing.languageSelect')}</option>
                  {availableLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name} ({lang.displayName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-4 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{borderRadius: '8px'}}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('landing.settingUp')}
                  </>
                ) : (
                  <>
                    {t('landing.continueButton')}
                    <FiArrowRight className="text-xl" />
                  </>
                )}
              </button>
            </form>

            {/* Info Text */}
            <div className="mt-6 text-center text-gray-400 text-sm">
              <p>{t('landing.infoText')}</p>
            </div>
          </div>
        </div>

        {/* Bottom Quote */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm italic">
            "{t('landing.tagline')}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
