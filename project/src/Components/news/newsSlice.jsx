import React from 'react';

const NewsCard = ({ headline, content }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border-l-4 border-green-600">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{headline}</h2>
      <p className="text-gray-600">{content}</p>
    </div>
  );
};

export default NewsCard;
