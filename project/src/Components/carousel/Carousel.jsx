import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import './Carousel.css'; // We'll create this CSS file

const Carousel = ({ items }) => {
  return (
    <div className="bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100 border-y-2 border-green-200 overflow-hidden shadow-inner">
      <div className="py-4">
        <div className="flex animate-scroll whitespace-nowrap">
          {/* Duplicate items for seamless loop */}
          {[...items, ...items].map((item, index) => (
            <div
              key={index}
              className="inline-flex items-center mx-6 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-max border border-green-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {item.crop.charAt(0)}
                  </span>
                </div>
                <div className="text-left">
                  <div className="font-bold text-green-900 text-lg">{item.crop}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-700 font-semibold">₹{item.price}/quintal</span>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      item.change.startsWith('+') 
                        ? 'text-green-700 bg-green-100' 
                        : 'text-red-700 bg-red-100'
                    }`}>
                      {item.change.startsWith('+') ? <FiTrendingUp /> : <FiTrendingDown />}
                      {item.change}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;


