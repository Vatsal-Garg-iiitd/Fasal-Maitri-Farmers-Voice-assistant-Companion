import React, { useState, useEffect } from 'react';
import { FiClock, FiExternalLink, FiTrendingUp } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, currentLanguage } = useTranslation();

  // Sample news data based on language
  const getNewsData = (lang) => {
    const newsData = {
      hi: [
        {
          id: 1,
          title: "सरकार ने जैविक खेती के लिए नई सब्सिडी की घोषणा की",
          summary: "कृषि मंत्रालय ने भारत भर में जैविक खेती प्रथाओं को बढ़ावा देने के लिए ₹5000 करोड़ की योजना शुरू की।",
          category: t('news.categories.policy'),
          time: "2 घंटे पहले",
          source: "कृषि समाचार आज",
          trending: true
        },
        {
          id: 2,
          title: "निर्यात मांग के कारण गेहूं की कीमतों में 12% वृद्धि",
          summary: "अंतर्राष्ट्रीय मांग से गेहूं की कीमतें बढ़ीं, जिससे पंजाब और हरियाणा क्षेत्र के किसानों को फायदा हुआ।",
          category: t('news.categories.market'),
          time: "4 घंटे पहले",
          source: "फार्म बिजनेस",
          trending: true
        }
      ],
      en: [
        {
          id: 1,
          title: "Government Announces New Subsidy for Organic Farming",
          summary: "Ministry of Agriculture launches ₹5000 crore scheme to promote organic farming practices across India.",
          category: t('news.categories.policy'),
          time: "2 hours ago",
          source: "AgriNews Today",
          trending: true
        },
        {
          id: 2,
          title: "Wheat Prices Rise 12% Due to Export Demand",
          summary: "International demand pushes wheat prices higher, benefiting farmers in Punjab and Haryana regions.",
          category: t('news.categories.market'),
          time: "4 hours ago",
          source: "Farm Business",
          trending: true
        }
      ],
      pa: [
        {
          id: 1,
          title: "ਸਰਕਾਰ ਨੇ ਜੈਵਿਕ ਖੇਤੀ ਲਈ ਨਵੀਂ ਸਬਸਿਡੀ ਦਾ ਐਲਾਨ ਕੀਤਾ",
          summary: "ਕਿਸਾਨੀ ਮੰਤਰਾਲੇ ਨੇ ਭਾਰਤ ਵਿੱਚ ਜੈਵਿਕ ਖੇਤੀ ਨੂੰ ਅੱਗੇ ਵਧਾਉਣ ਲਈ ₹5000 ਕਰੋੜ ਦੀ ਸਕੀਮ ਸ਼ੁਰੂ ਕੀਤੀ।",
          category: t('news.categories.policy'),
          time: "2 ਘੰਟੇ ਪਹਿਲਾਂ",
          source: "ਖੇਤੀਬਾੜੀ ਸਮਾਚਾਰ ਅੱਜ",
          trending: true
        }
      ]
    };
    return newsData[lang] || newsData['en'];
  };

  useEffect(() => {
    setTimeout(() => {
      setNews(getNewsData(currentLanguage));
      setLoading(false);
    }, 1000);
  }, [currentLanguage, t]);

  const getCategoryColor = (category) => {
    const colors = {
      [t('news.categories.policy')]: 'bg-blue-600',
      [t('news.categories.market')]: 'bg-green-600',
      [t('news.categories.technology')]: 'bg-purple-600',
      [t('news.categories.weather')]: 'bg-orange-600'
    };
    return colors[category] || 'bg-gray-600';
  };

  if (loading) {
    return (
      <div className="mt-16 max-w-6xl mx-auto">
        <div className="bg-slate-800/90 backdrop-blur-sm shadow-2xl border border-green-700 p-8" style={{borderRadius: '12px'}}>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-600 mb-6" style={{borderRadius: '4px'}}></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-700" style={{borderRadius: '8px'}}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 max-w-6xl mx-auto">
      <div className="bg-slate-800/90 backdrop-blur-sm shadow-2xl border border-green-700 overflow-hidden" style={{borderRadius: '12px'}}>
        <div className="bg-gradient-to-r from-green-700 to-emerald-700 p-6">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <FiTrendingUp className="text-green-300" />
            {t('news.title')}
          </h2>
          <p className="text-green-200 mt-2">{t('news.subtitle')}</p>
        </div>

        <div className="p-6 bg-slate-800">
          <div className="grid gap-4">
            {news.map((article) => (
              <div
                key={article.id}
                className="bg-slate-700 hover:bg-slate-600 transition-all duration-300 transform hover:scale-[1.02] border border-slate-600 hover:border-green-500 p-6 cursor-pointer group"
                style={{borderRadius: '8px'}}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-xs font-semibold text-white ${getCategoryColor(article.category)}`} style={{borderRadius: '4px'}}>
                        {article.category}
                      </span>
                      {article.trending && (
                        <span className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                          <FiTrendingUp className="text-xs" />
                          {t('news.trending')}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-gray-400 text-xs">
                        <FiClock className="text-xs" />
                        {article.time}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-400 mb-3 leading-relaxed">
                      {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Source: {article.source}
                      </span>
                      <FiExternalLink className="text-gray-500 group-hover:text-green-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg" style={{borderRadius: '8px'}}>
              {t('news.loadMore')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;

