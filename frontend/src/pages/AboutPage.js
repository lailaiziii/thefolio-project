import React, { useState } from 'react';

const AboutPage = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('intro'); 
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [resultText, setResultText] = useState("");
  const [resultColor, setResultColor] = useState("");

  const gameLevels = [
    { type: "color", title: "🎨 Color Harmony", question: "Which pair shows complementary colors?", options: [["#FF0000", "#00FF00"], ["#FF0000", "#FF6600"], ["#0000FF", "#00FFFF"], ["#FF0000", "#00FFFF"]], answer: 3 },
    { type: "image", title: "🖼️ Elements of Art", question: "Which element of art is most visible in this image?", image: "/assets/texture.jpg", options: ["Line", "Texture", "Color", "Space"], answer: 1 },
    { type: "text", title: "📘 Art Theory", question: "Which element of art refers to lightness or darkness?", options: ["Hue", "Texture", "Value", "Shape"], answer: 2 },
    { type: "color", title: "🌈 Color Theory", question: "Which pair represents analogous colors?", options: [["#FF0000", "#0000FF"], ["#00FF00", "#FF0000"], ["#FF6600", "#FF0000"], ["#FFFF00", "#0000FF"]], answer: 2 },
    { type: "image", title: "📏 Elements of Art", question: "This artwork mainly demonstrates which element?", image: "/assets/line.jpg", options: ["Form", "Line", "Value", "Texture"], answer: 1 },
    { type: "text", title: "📘 Digital Art", question: "Which color model is used for digital screens?", options: ["CMYK", "RYB", "RGB", "Grayscale"], answer: 2 },
    { type: "color", title: "🎨 Color Scheme", question: "Which pair shows a monochromatic color scheme?", options: [["#0033FF", "#66AAFF"], ["#FF0000", "#00FFFF"], ["#00FF00", "#FF00FF"], ["#0000FF", "#FFFF00"]], answer: 0 },
    { type: "image", title: "⚖️ Principles of Design", question: "What principle of design is shown in the image?", image: "/assets/balance.jpg", options: ["Emphasis", "Balance", "Rhythm", "Contrast"], answer: 1 },
    { type: "image", title: "🎯 Principles of Design", question: "Which principle is clearly used to draw attention to one area?", image: "/assets/emphasis.jpg", options: ["Unity", "Movement", "Emphasis", "Pattern"], answer: 2 },
    { type: "text", title: "🎭 Design Principle", question: "Which principle of design creates a focal point?", options: ["Rhythm", "Balance", "Unity", "Emphasis"], answer: 3 }
  ];

  const handleNext = () => {
    const level = gameLevels[currentLevel];
    if (selectedIndex === level.answer) {
      setScore(s => s + 1);
      setResultColor("#27ae60"); // Better Green
      setResultText("Correct! 🎉");
    } else {
      setResultColor("#e74c3c"); // Better Red
      setResultText("Incorrect, but keep going!");
    }

    setTimeout(() => {
      if (currentLevel + 1 < gameLevels.length) {
        setCurrentLevel(prev => prev + 1);
        setSelectedIndex(null);
        setResultText("");
      } else {
        setGameState('result');
      }
    }, 1500);
  };

  const restartGame = () => {
    setCurrentLevel(0);
    setScore(0);
    setGameState('playing');
    setSelectedIndex(null);
    setResultText("");
  };

  return (
    <div className="about-wrapper-custom">
      <section className="content2">
        <h2>What I Love About Digital Illustration</h2>
        <p>Digital illustration allows me to turn thoughts, emotions, and stories into visual form. It gives freedom to experiment with colors, styles, and concepts without limits.</p>
      </section>

      <section className="gallery">
        <div className="art-card">
          <img src="/assets/sketch_art.jpg" alt="Early digital sketch" />
          <p>Early Digital Sketch</p>
        </div>
        <div className="art-card">
          <img src="/assets/process_art.png" alt="Illustration process" />
          <p>Illustration Process</p>
        </div>
      </section>

      {/* --- Game Implementation --- */}
      {gameState === 'intro' && (
        <div className="game-container">
          <h1>🎨 Art Games</h1>
          <p>Test your knowledge of color theory, elements of art, and design principles.</p>
          <button className="game-btn" onClick={() => setGameState('playing')}>Start Art Game</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-container">
          <div className="game-header">
            <span>Question {currentLevel + 1} of {gameLevels.length}</span>
            <span>Score: {score}</span>
          </div>
          <h2>{gameLevels[currentLevel].title}</h2>
          <p>{gameLevels[currentLevel].question}</p>

          <div className="media-box">
            {gameLevels[currentLevel].type === "image" && (
              <img src={gameLevels[currentLevel].image} className="art-image" alt="Question visual" />
            )}
          </div>

          <div className="options-grid">
            {gameLevels[currentLevel].options.map((opt, index) => (
              <div 
                key={index}
                className={`option-card ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => resultText === "" && setSelectedIndex(index)}
              >
                {gameLevels[currentLevel].type === "color" ? (
                  <div className="color-pair">
                    <div className="color-box" style={{background: opt[0]}}></div>
                    <div className="color-box" style={{background: opt[1]}}></div>
                  </div>
                ) : opt}
              </div>
            ))}
          </div>

          <button 
            className="game-btn" 
            disabled={selectedIndex === null || resultText !== ""} 
            onClick={handleNext}
          >
            Next
          </button>
          <p className="result-msg" style={{color: resultColor}}>{resultText}</p>
        </div>
      )}

      {gameState === 'result' && (
        <div className="game-container">
          <h2>🏁 Challenge Complete!</h2>
          <p style={{fontSize: '1.4rem'}}>Your final score: <strong>{score} / {gameLevels.length}</strong></p>
          <button className="game-btn" onClick={restartGame}>Play Again</button>
        </div>
      )}

      <footer>
        <p>© 2026 Illustrated Mind | Educational Portfolio Only</p>
      </footer>
    </div>
  );
};

export default AboutPage;