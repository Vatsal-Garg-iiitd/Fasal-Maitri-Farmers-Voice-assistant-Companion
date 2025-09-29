import { useLanguage } from '../context/LanguageContext';

export const useTranslation = () => {
  const { t, currentLanguage, changeLanguage, loading, availableLanguages } = useLanguage();
  
  return {
    t,
    currentLanguage,
    changeLanguage,
    loading,
    availableLanguages
  };
};
