import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';

// Your existing page components
import Landing from './pages/Landing';
import Home from './pages/Home';
import GovernmentSchemes from './pages/GovernmentScheme';
import Profile from './pages/Profile';
import PlantRecognition from './Components/PlantRecognition'; 

// Components for the news feature
import NewsLanguageSelector from './pages/Newslanguageselector';
import EnglishPage from './pages/EnglishPage'; 
import HindiPage from './pages/HindiPage';     
import MarathiPage from './pages/MarathiPage'; 
import PunjabiPage from './pages/punjabiPage'; 
import TamilPage from './pages/TamilPage';     

import './App.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* --- Your Existing Application Routes --- */}
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/schemes" element={<GovernmentSchemes/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/plant-recognition" element={<PlantRecognition/>}/> 
            
            {/* === MERGED AND UPDATED NEWS ROUTES === */}
            
            {/* 1. This route still leads to the language selection page */}
            <Route path="/news" element={<NewsLanguageSelector />} />
            
            {/* 2. These are the specific routes for each language news page */}
            <Route path="/news/en" element={<EnglishPage />} />
            <Route path="/news/hi" element={<HindiPage />} />
            <Route path="/news/mr" element={<MarathiPage />} />
            <Route path="/news/pa" element={<PunjabiPage />} />
            <Route path="/news/ta" element={<TamilPage />} />

          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
