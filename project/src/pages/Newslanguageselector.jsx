import React from 'react';
import { Link } from 'react-router-dom';

const languages = [
  { code: 'en', name: 'English', path: '/news/en' },
  { code: 'hi', name: 'हिन्दी', path: '/news/hi' },
  { code: 'mr', name: 'मराठी', path: '/news/mr' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', path: '/news/pa' },
  { code: 'ta', name: 'தமிழ்', path: '/news/ta' },
];

const LanguageCard = ({ name, path }) => (
  <Link to={path} className="block bg-white shadow-lg rounded-lg p-8 text-center transition-transform transform hover:scale-105 hover:shadow-xl border-t-4 border-green-600">
    <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
  </Link>
);

const NewsLanguageSelector = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        Select a Language to View News
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {languages.map((lang) => (
          <LanguageCard key={lang.code} name={lang.name} path={lang.path} />
        ))}
      </div>
    </div>
  );
};

export default NewsLanguageSelector;

