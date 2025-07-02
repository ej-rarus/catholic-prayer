import React, { useState } from 'react';
import './App.css';
import { prayers } from './prayers';

function App() {
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [hiddenLines, setHiddenLines] = useState([]);

  const selectPrayer = (prayer) => {
    setSelectedPrayer(prayer);
    setHiddenLines(Array(prayer.content.length).fill(true));
  };

  const toggleLine = (index) => {
    const newHiddenLines = [...hiddenLines];
    newHiddenLines[index] = !newHiddenLines[index];
    setHiddenLines(newHiddenLines);
  };

  const toggleAllLines = () => {
    const anyHidden = hiddenLines.some(line => line === true);
    setHiddenLines(Array(selectedPrayer.content.length).fill(!anyHidden));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>가톨릭 기도문 암송 도우미</h1>
      </header>
      <main>
        {!selectedPrayer ? (
          <div className="prayer-selection">
            <h2>기도문 선택</h2>
            <div className="prayer-buttons">
              {prayers.map((prayer, index) => (
                <button key={index} onClick={() => selectPrayer(prayer)}>
                  {prayer.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="prayer-view">
            <button className="back-button" onClick={() => setSelectedPrayer(null)}>← 뒤로가기</button>
            <h2>{selectedPrayer.title}</h2>
            <div className="prayer-content">
              {selectedPrayer.content.map((line, index) => (
                <p 
                  key={index} 
                  className={`prayer-line ${hiddenLines[index] ? 'hidden' : ''}`}
                  onClick={() => toggleLine(index)}
                >
                  {hiddenLines[index] ? '█'.repeat(line.length) : line}
                </p>
              ))}
            </div>
            <button className="reveal-button" onClick={toggleAllLines}>
              {hiddenLines.some(line => line === true) ? "전체 보기" : "전체 가리기"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;