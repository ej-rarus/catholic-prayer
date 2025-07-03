import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import './App.css';
import { prayers } from './prayers';
import Footer from './Footer';
import ScrollButtons from './ScrollButtons';
import ShareButtons from './ShareButtons'; // Import ShareButtons
import { useTheme } from './ThemeContext'; // Import useTheme

function PrayerDetail({
  voices,
  selectedVoice,
  setSelectedVoice,
  isSpeaking,
  setIsSpeaking,
}) {
  const { prayerTitle } = useParams();
  const navigate = useNavigate();
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [hiddenLines, setHiddenLines] = useState([]);
  const [currentSpeakingLineIndex, setCurrentSpeakingLineIndex] = useState(-1); // New state for highlighting
  const utteranceRef = useRef(null); // Ref to store the SpeechSynthesisUtterance object

  // Fixed speech rate and pitch
  const speechRate = 0.9;
  const speechPitch = 0.9;

  useEffect(() => {
    const prayer = prayers.find(p => p.title === prayerTitle);
    if (prayer) {
      setSelectedPrayer(prayer);
      setHiddenLines(Array(prayer.content.length).fill(false));
    } else {
      navigate('/'); // Navigate to home if prayer not found
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentSpeakingLineIndex(-1); // Reset highlight on prayer change
  }, [prayerTitle, navigate, setIsSpeaking]);

  const toggleLine = (index) => {
    const newHiddenLines = [...hiddenLines];
    newHiddenLines[index] = !newHiddenLines[index];
    setHiddenLines(newHiddenLines);
  };

  const toggleAllLines = () => {
    const anyHidden = hiddenLines.some(line => line === true);
    setHiddenLines(Array(selectedPrayer.content.length).fill(!anyHidden));
  };

  const goBack = () => {
    navigate(-1);
  }

  const speak = (text, index = -1) => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false); // Stop any ongoing full prayer speech
    setCurrentSpeakingLineIndex(-1); // Clear previous highlight

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    } else {
      utterance.lang = 'ko-KR'; // Fallback
    }
    utterance.rate = speechRate; // Apply fixed speech rate
    utterance.pitch = speechPitch; // Apply fixed speech pitch

    utterance.onstart = () => {
      setCurrentSpeakingLineIndex(index);
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setCurrentSpeakingLineIndex(-1);
      setIsSpeaking(false);
    };
    utterance.onerror = () => {
      setCurrentSpeakingLineIndex(-1);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    utteranceRef.current = utterance; // Store the utterance object
  };

  const toggleSpeakAll = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingLineIndex(-1);
    } else {
      let currentLine = 0;
      const speakNextLine = () => {
        if (currentLine < selectedPrayer.content.length) {
          const text = selectedPrayer.content[currentLine];
          const utterance = new SpeechSynthesisUtterance(text);
          const voice = voices.find(v => v.voiceURI === selectedVoice);
          if (voice) {
            utterance.voice = voice;
          } else {
            utterance.lang = 'ko-KR';
          }
          utterance.rate = speechRate; // Apply fixed speech rate
          utterance.pitch = speechPitch; // Apply fixed speech pitch

          utterance.onstart = () => {
            setCurrentSpeakingLineIndex(currentLine);
            setIsSpeaking(true);
          };
          utterance.onend = () => {
            currentLine++;
            speakNextLine();
          };
          utterance.onerror = () => {
            setCurrentSpeakingLineIndex(-1);
            setIsSpeaking(false);
          };
          window.speechSynthesis.speak(utterance);
          utteranceRef.current = utterance;
        } else {
          setCurrentSpeakingLineIndex(-1);
          setIsSpeaking(false);
        }
      };
      window.speechSynthesis.cancel(); // Cancel any previous speech
      speakNextLine();
    }
  };

  if (!selectedPrayer) {
    return null; // Or a loading spinner
  }

  return (
    <div className="prayer-view">
      <Helmet>
        <title>{selectedPrayer.title} - 가톨릭 기도문 암송 도우미</title>
        <meta name="description" content={`${selectedPrayer.title} 기도문 암송을 도와주는 도우미 앱입니다.`} />
      </Helmet>
      <div className="prayer-title-header">
        <button className="back-button" onClick={goBack}>←</button>
        <h2>{selectedPrayer.title}</h2>
      </div>
      <div className="prayer-content">
        {selectedPrayer.content.map((line, index) => (
          <div key={index} className="prayer-line-container">
            <p
              className={`prayer-line ${hiddenLines[index] ? 'hidden' : ''} ${currentSpeakingLineIndex === index ? 'highlighted-line' : ''}`}
              onClick={() => toggleLine(index)}
            >
              {hiddenLines[index] ? '█'.repeat(line.length) : line}
            </p>
            <button className="tts-button" onClick={() => speak(line, index)}>🔊</button>
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
      {/* Removed Speech Rate and Pitch Controls */}
      <div className="control-buttons">
        <button className="reveal-button" onClick={toggleAllLines}>
          {hiddenLines.some(line => line === true) ? "전체 보기" : "전체 가리기"}
        </button>
        <button className="tts-control-button" onClick={toggleSpeakAll}>
          {isSpeaking ? "멈춤" : "전체 듣기"}
        </button>
      </div>
      <ShareButtons prayerTitle={selectedPrayer.title} />
    </div>
  );
}

function Home({
  selectPrayer,
}) {
  return (
    <div className="prayer-selection">
      <Helmet>
        <title>가톨릭 기도문 암송 도우미</title>
        <meta name="description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다. 다양한 기도문을 선택하고 음성으로 들으며 암송 연습을 할 수 있습니다." />
      </Helmet>
      <h2>기도문 선택</h2>
      <div className="prayer-buttons">
        {prayers.map((prayer, index) => (
          <button key={index} onClick={() => selectPrayer(prayer)}>
            {prayer.title}
          </button>
        ))}
      </div>
      <ShareButtons shareTitle="가톨릭 기도문 암송 도우미" shareDescription="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다. 다양한 기도문을 선택하고 음성으로 들으며 암송 연습을 할 수 있습니다." />
    </div>
  );
}

function App() {
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const [showSearch, setShowSearch] = useState(false); // State for showing/hiding search
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredPrayers, setFilteredPrayers] = useState([]); // State for filtered prayers

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Effect for managing voice synthesis
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
      setIsSpeaking(false);
    };
  }, [selectedVoice]);

  // Effect for filtering prayers based on search term
  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const results = prayers.filter(
        (prayer) =>
          prayer.title.toLowerCase().includes(lowercasedSearchTerm) ||
          prayer.content.some((line) =>
            line.toLowerCase().includes(lowercasedSearchTerm)
          )
      );
      setFilteredPrayers(results);
    } else {
      setFilteredPrayers([]);
    }
  }, [searchTerm]);

  const selectPrayer = (prayer) => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    navigate(`/prayer/${prayer.title}`);
    setShowSearch(false); // Hide search results after selection
    setSearchTerm(''); // Clear search term
  };

  const goToHome = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    navigate('/');
    setShowSearch(false); // Hide search results when going home
    setSearchTerm(''); // Clear search term
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-main-content" onClick={goToHome} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" className="App-logo" alt="logo" />
          <h1>베다의 기도</h1>
          <p className="App-subtitle">가톨릭 기도문 암송 도우미</p>
        </div>
        <div className="header-buttons">
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className="search-toggle-button">
            🔍
          </button>
        </div>
      </header>
      <main>
        {showSearch && (
          <div className="search-container">
            <input
              type="text"
              placeholder="기도문 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && filteredPrayers.length > 0 && (
              <ul className="search-results">
                {filteredPrayers.map((prayer) => (
                  <li key={prayer.title} onClick={() => selectPrayer(prayer)}>
                    {prayer.title}
                  </li>
                ))}
              </ul>
            )}
            {searchTerm && filteredPrayers.length === 0 && (
              <p className="no-results">검색 결과가 없습니다.</p>
            )}
          </div>
        )}
        <Routes>
          <Route path="/" element={<Home selectPrayer={selectPrayer} />} />
          <Route
            path="/prayer/:prayerTitle"
            element={
              <PrayerDetail
                voices={voices}
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
                isSpeaking={isSpeaking}
                setIsSpeaking={setIsSpeaking}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
      <ScrollButtons />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}