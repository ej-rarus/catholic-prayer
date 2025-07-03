import React, { useState, useEffect } from 'react';
import './App.css';
import { prayers } from './prayers';

function App() {
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [hiddenLines, setHiddenLines] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const populateVoiceList = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const koreanVoices = availableVoices.filter(voice => voice.lang.startsWith('ko'));
      setVoices(koreanVoices.length > 0 ? koreanVoices : availableVoices);

      if (!selectedVoice) {
        const googleVoice = koreanVoices.find(voice => voice.name.includes('Google'));
        if (googleVoice) {
          setSelectedVoice(googleVoice.voiceURI);
        } else if (koreanVoices.length > 0) {
          setSelectedVoice(koreanVoices[0].voiceURI);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].voiceURI);
        }
      }
    };

    populateVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  const selectPrayer = (prayer) => {
    window.speechSynthesis.cancel();
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

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    } else {
      utterance.lang = 'ko-KR'; // Fallback
    }
    window.speechSynthesis.speak(utterance);
  };

  const speakAll = () => {
    window.speechSynthesis.cancel();
    const textToSpeak = selectedPrayer.content.join(' ');
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    } else {
      utterance.lang = 'ko-KR'; // Fallback
    }
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
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
            <button className="back-button" onClick={() => {
              stopSpeaking();
              setSelectedPrayer(null);
            }}>← 뒤로가기</button>
            <h2>{selectedPrayer.title}</h2>
            <div className="prayer-content">
              {selectedPrayer.content.map((line, index) => (
                <div key={index} className="prayer-line-container">
                  <p
                    className={`prayer-line ${hiddenLines[index] ? 'hidden' : ''}`}
                    onClick={() => toggleLine(index)}
                  >
                    {hiddenLines[index] ? '█'.repeat(line.length) : line}
                  </p>
                  <button className="tts-button" onClick={() => speak(line)}>🔊</button>
                </div>
              ))}
            </div>
            <div className="voice-selector-container">
              <label htmlFor="voice-select">목소리 선택: </label>
              <select id="voice-select" value={selectedVoice || ''} onChange={(e) => setSelectedVoice(e.target.value)}>
                {voices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {`${voice.name} (${voice.lang})`}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-buttons">
              <button className="reveal-button" onClick={toggleAllLines}>
                {hiddenLines.some(line => line === true) ? "전체 보기" : "전체 가리기"}
              </button>
              <button className="tts-control-button" onClick={speakAll}>
                전체 듣기
              </button>
              <button className="tts-control-button" onClick={stopSpeaking}>
                멈춤
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;