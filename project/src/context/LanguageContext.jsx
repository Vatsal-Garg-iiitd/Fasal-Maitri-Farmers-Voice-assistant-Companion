import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  const availableLanguages = [
    { code: 'hi', name: 'हिंदी', displayName: 'Hindi' },
    { code: 'en', name: 'English', displayName: 'English' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', displayName: 'Punjabi' },
    { code: 'gu', name: 'ગુજરાતી', displayName: 'Gujarati' },
    { code: 'mr', name: 'मराठी', displayName: 'Marathi' },
    { code: 'ta', name: 'தமிழ்', displayName: 'Tamil' },
    { code: 'te', name: 'తెలుగు', displayName: 'Telugu' },
    { code: 'kn', name: 'ಕನ್ನಡ', displayName: 'Kannada' },
    { code: 'ml', name: 'മലയാളം', displayName: 'Malayalam' },
    { code: 'bn', name: 'বাংলা', displayName: 'Bengali' }
  ];

  // Load translations for a specific language
  const loadTranslations = async (languageCode) => {
    try {
      setLoading(true);
      const response = await fetch(`/locales/${languageCode}.json`);
      
      if (!response.ok) {
        console.warn(`Translation file for ${languageCode} not found, falling back to English`);
        const fallbackResponse = await fetch('/locales/en.json');
        const fallbackData = await fallbackResponse.json();
        setTranslations(fallbackData);
        return;
      }
      
      const data = await response.json();
      setTranslations(data);
    } catch (error) {
      console.error('Error loading translations:', error);
      // Fallback to English if loading fails
      try {
        const fallbackResponse = await fetch('/locales/en.json');
        const fallbackData = await fallbackResponse.json();
        setTranslations(fallbackData);
      } catch (fallbackError) {
        console.error('Error loading fallback translations:', fallbackError);
        setTranslations({});
      }
    } finally {
      setLoading(false);
    }
  };

  // Change language
  const changeLanguage = async (languageCode) => {
    setCurrentLanguage(languageCode);
    await loadTranslations(languageCode);
    localStorage.setItem('selectedLanguage', languageCode);
  };

  // Get translation by key (supports nested keys like 'home.title')
  const t = (key, fallback = key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key '${key}' not found for language '${currentLanguage}'`);
        return fallback;
      }
    }
    
    return value || fallback;
  };

  // Initialize language on component mount
  useEffect(() => {
    const initializeLanguage = async () => {
      // Get language from localStorage or user data
      const savedLanguage = localStorage.getItem('selectedLanguage');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const initialLanguage = savedLanguage || userData.language || 'en';
      
      setCurrentLanguage(initialLanguage);
      await loadTranslations(initialLanguage);
    };

    initializeLanguage();
  }, []);

  const value = {
    currentLanguage,
    availableLanguages,
    translations,
    loading,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
