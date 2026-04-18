import React, { useState } from 'react';

const ArtGame = () => {
  // Game state management
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('intro'); // 'intro', 'playing', 'result'
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', color: '' });

  const gameLevels = [
    { type: "color", title: "🎨 Color Harmony", question: "Which pair shows complementary colors?", options: [["#FF0000", "#00FF00"], ["#FF0000", "#FF6600"], ["#0000FF", "#00FFFF"], ["#FF0000", "#00FFFF"]], answer: 3 },
    { type: "image", title: "🖼️ Elements of Art", question: "Which element of art is most visible in this image?", image: "/assets/texture.jpg", options: ["Line", "Texture", "Color", "Space"], answer: 1 },
    { type: "text", title: "📘 Art Theory", question: "Which element of art refers to lightness or darkness?", options: ["Hue", "Texture", "Value", "Shape"], answer: 2 },
    { type: "color", title: "🌈 Color Theory", question: "Which pair represents analogous colors?", options: [["#FF0000", "#0000FF"], ["#00FF00", "#FF0000"], ["#FF6600", "#FF0000"], ["#FFFF00", "#0000FF"]], answer: 2 },
    { type: "image", title: "📏 Elements of Art", question: "This artwork mainly demonstrates which element?", image: "/assets/line.jpg", options: ["Form", "Line", "Value", "Texture"], answer: 1 },
    { type: "text", title: "🖥️ Digital Art", question: "Which color model is used for digital screens?", options: ["CMYK", "RYB", "RGB", "Grayscale"], answer: 2 },
    { type: "color", title: "🎨 Color Scheme", question: "Which pair shows a monochromatic color scheme?", options: [["#0033FF", "#66AAFF"], ["#FF0000", "#00FFFF"], ["#00FF00", "#FF00FF"], ["#0000FF", "#FFFF00"]], answer: 0 },
    { type: "image", title: "⚖️ Principles of Design", question: "What principle of design is shown in the image?", image: "/assets/balance.jpg", options: ["Emphasis", "Balance", "Rhythm", "Contrast"], answer: 1 },
    { type: "image", title: "🎯 Principles of Design", question: "Which principle is clearly used to draw attention to one area?", image: "/assets/emphasis.jpg", options: ["Unity", "Movement", "Emphasis", "Pattern"], answer: 2 },
    { type: "text", title: "🎭 Design Principle", question: "Which principle of design creates a focal point?", options: ["Rhythm", "Balance", "Unity", "Emphasis"], answer: 3 }
  ];

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const handleNext = () => {
    const isCorrect = selectedIndex === gameLevels[currentLevel].answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ text: "Correct! 🎉", color: "green" });
    } else {
      setFeedback({ text: "Incorrect, but keep going!", color: "red" });
    }

    // Delay to show feedback before moving to next question
    setTimeout(() => {
      if (currentLevel + 1 < gameLevels.length) {
        setCurrentLevel(prev => prev + 1);
        setSelectedIndex(null);
        setFeedback({ text: '', color: '' });
      } else {
        setGameState('result');
      }
    }, 2000);
  };

  if (gameState === 'intro') return (
    <div className="game-container">
      <h1>🎨 Art Games</h1>
      <p>Test your knowledge of color theory, elements of art, principles of design, and digital art.</p>
      <button className="btn-primary" onClick={() => setGameState('playing')}>Start Art Game</button>
    </div>
  );

  if (gameState === 'result') return (
    <div className="game-container">
      <h1>🏁 Challenge Complete!</h1>
      <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>Your final score: {score} / {gameLevels.length}</p>
      <button className="btn-secondary" onClick={() => window.location.reload()}>Play Again</button>
    </div>
  );

  const level = gameLevels[currentLevel];

  return (
    <div className="game-container">
      <h2>{level.title}</h2>
      <p>{level.question}</p>

      <div className="media-area">
        {level.type === 'image' && <img src={level.image} alt="Art Question" className="art-image" />}
      </div>

      <div className="options-grid">
        {level.options.map((opt, index) => (
          <div 
            key={index} 
            className={`option ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleSelect(index)}
          >
            {level.type === "color" ? (
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <div className="color-box" style={{ background: opt[0], width: '30px', height: '30px', borderRadius: '4px' }}></div>
                <div className="color-box" style={{ background: opt[1], width: '30px', height: '30px', borderRadius: '4px' }}></div>
              </div>
            ) : opt}
          </div>
        ))}
      </div>

      <button 
        className="btn-primary" 
        disabled={selectedIndex === null || feedback.text !== ''} 
        onClick={handleNext}
      >
        Next
      </button>
      
      {feedback.text && <p style={{ color: feedback.color, marginTop: '1rem', fontWeight: 'bold' }}>{feedback.text}</p>}
    </div>
  );
};

export default ArtGame;