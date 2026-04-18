import React from 'react';
import '../App.css'; 

const SplashPage = ({ onEnter, isFading }) => {
  return (
    <div id="siteSplash" className={isFading ? 'fade-out' : ''}>
      <div className="splash-inner">
        <div className="splash-logo">🎨</div>
        <h1 className="hero-title">Illustrated Mind</h1>
        <p className="hero-subtitle">Digital Illustration & Visual Storytelling</p>
        
        <div className="hero-actions">
          <button 
            className="splash-btn" 
            onClick={onEnter}
          >
            Enter Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default SplashPage;