import React from 'react';
import NewsCard from '../Components/news/newsSlice';
import { newsData } from '../data/newsData';

const HindiPage = () => {
  const { title, news } = newsData.hi;
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">{title}</h1>
      <div>
        {news.map(item => (
          <NewsCard key={item.id} headline={item.headline} content={item.content} />
        ))}
      </div>
    </div>
  );
};
export default HindiPage;
