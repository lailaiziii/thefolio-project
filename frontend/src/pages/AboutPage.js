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
    { type: "text", title: "🖥️ Digital Art", question: "Which color model is used for digital screens?", options: ["CMYK", "RYB", "RGB", "Grayscale"], answer: 2 },
    { type: "color", title: "🎨 Color Scheme", question: "Which pair shows a monochromatic color scheme?", options: [["#0033FF", "#66AAFF"], ["#FF0000", "#00FFFF"], ["#00FF00", "#FF00FF"], ["#0000FF", "#FFFF00"]], answer: 0 },
    { type: "image", title: "⚖️ Principles of Design", question: "What principle of design is shown in the image?", image: "/assets/balance.jpg", options: ["Emphasis", "Balance", "Rhythm", "Contrast"], answer: 1 },
    { type: "image", title: "🎯 Principles of Design", question: "Which principle is clearly used to draw attention to one area?", image: "/assets/emphasis.jpg", options: ["Unity", "Movement", "Emphasis", "Pattern"], answer: 2 },
    { type: "text", title: "🎭 Design Principle", question: "Which principle of design creates a focal point?", options: ["Rhythm", "Balance", "Unity", "Emphasis"], answer: 3 }
  ];

  const handleNext = () => {
    const level = gameLevels[currentLevel];
    if (selectedIndex === level.answer) {
      setScore(s => s + 1);
      setResultColor("green");
      setResultText("Correct! 🎉");
    } else {
      setResultColor("red");
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
    }, 2000);
  };

  return (
    <div className="about-wrapper-custom">
      <section className="content2">
        <h2>What I Love About Digital Illustration</h2>
        <p>Digital illustration allows me to turn thoughts, emotions, and stories into visual form. It gives freedom to experiment with colors, styles, and concepts without limits.</p>
      </section>

      <section className="content2">
        <h2>How Digital Art Became My Passion</h2>
        <p>My passion for digital illustration grew as I realized how powerful visuals can be in expressing emotions and ideas. Unlike traditional art alone, digital tools allowed me to experiment freely, undo mistakes, and explore endless creative possibilities.</p>
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
        <div className="game-container" id="introScreen">
          <h1>🎨 Art Games</h1>
          <p>Test your knowledge of color theory, elements of art, principles of design, and digital art.</p>
          <button id="startGameBtn" onClick={() => setGameState('playing')}>Start Art Game</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-container" id="gameScreen">
          <h2 id="gameTitle">{gameLevels[currentLevel].title}</h2>
          <p id="question">{gameLevels[currentLevel].question}</p>

          <div id="media">
            {gameLevels[currentLevel].type === "image" && (
              <img src={gameLevels[currentLevel].image} className="art-image" alt="Question visual" />
            )}
          </div>

          <div id="options" className="options-grid">
            {gameLevels[currentLevel].options.map((opt, index) => (
              <div 
                key={index}
                className={`option ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => setResultText("") || setSelectedIndex(index)}
              >
                {gameLevels[currentLevel].type === "color" ? (
                  <>
                    <div className="color-box" style={{background: opt[0]}}></div>
                    <div className="color-box" style={{background: opt[1]}}></div>
                  </>
                ) : opt}
              </div>
            ))}
          </div>

          <button id="nextBtn" disabled={selectedIndex === null || resultText !== ""} onClick={handleNext}>Next</button>
          <p id="result" style={{color: resultColor, marginTop: '15px'}}>{resultText}</p>
        </div>
      )}

      {gameState === 'result' && (
        <div className="game-container">
          <h2 id="gameTitle">🏁 Challenge Complete!</h2>
          <p id="result" style={{fontSize: '1.2rem'}}>Your final score: {score} / {gameLevels.length}</p>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}

      <footer>
        <p>© 2026 Illustrated Mind | Educational Portfolio Only</p>
      </footer>
    </div>
  );
};

export default AboutPage;