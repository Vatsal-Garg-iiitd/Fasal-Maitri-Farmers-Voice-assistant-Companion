import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 

// NOTE: Please ensure this path correctly points to your NewsCard component.
// The name 'newsSlice' suggests it might be a Redux file, not a component.
// Based on our previous conversation, the path might be '../components/NewsCard'.
import NewsCard from '../Components/news/newsSlice'; 

// Helper to get the correct title based on the language code from the URL
const getTitle = (lang) => {
  switch (lang) {
    case 'hi': return "नवीनतम किसान समाचार";
    case 'mr': return "नवीनतम शेतकरी बातम्या";
    case 'pa': return "ਨਵੀਨਤਮ ਕਿਸਾਨ ਖ਼ਬਰਾਂ";
    case 'ta': return "சமீபத்திய உழவர் செய்திகள்";
    case 'en':
    default:
      return "Latest Farmer News";
  }
};

const NewsPage = () => {
  const { lang } = useParams(); // Get the 'lang' parameter from the URL (e.g., 'en', 'hi')
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const title = getTitle(lang);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      
      // FIX 1: Access environment variables using 'import.meta.env' for Vite projects.
      const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

      // Add a check to ensure the API key is loaded
      if (!API_KEY) {
        setError("API Key not found. Make sure you have a .env file with VITE_NEWS_API_KEY set.");
        setLoading(false);
        return;
      }

      // FIX 2: Correctly use the API_KEY variable in the fetch URL.
      const url = `https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=${API_KEY}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch news.');
        }
        const data = await response.json();
        setNews(data.articles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [lang]); // Re-run the effect whenever the 'lang' parameter in the URL changes

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">{title}</h1>
      
      {loading && <p className="text-center text-lg">Loading news...</p>}
      
      {error && <p className="text-center text-red-600 font-bold">Error: {error}</p>}
      
      {!loading && !error && (
        <div>
          {news.length > 0 ? (
            news.map((item, index) => (
              <NewsCard 
                key={index} 
                headline={item.title} 
                content={item.description || 'No content available.'} 
              />
            ))
          ) : (
            <p className="text-center text-gray-600">No news articles found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsPage;
