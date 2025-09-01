import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { prayers } from '../../src/prayers';
import ShareButtons from '../../src/ShareButtons';
import { useTheme } from '../../src/ThemeContext';

export default function PrayerDetail() {
  const router = useRouter();
  const { prayerTitle } = router.query;
  const { theme } = useTheme();
  
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [hiddenLines, setHiddenLines] = useState([]);
  const [currentSpeakingLineIndex, setCurrentSpeakingLineIndex] = useState(-1);
  const [favorites, setFavorites] = useState([]);
  const utteranceRef = useRef(null);

  // 고정된 음성 속도와 피치
  const speechRate = 0.9;
  const speechPitch = 0.9;

  // 기도문 데이터 설정
  useEffect(() => {
    if (prayerTitle) {
      const decodedTitle = decodeURIComponent(prayerTitle);
      const prayer = prayers.find(p => p.title === decodedTitle);
      if (prayer) {
        setSelectedPrayer(prayer);
        setHiddenLines(Array(prayer.content.length).fill(false));
      } else {
        router.push('/');
      }
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setCurrentSpeakingLineIndex(-1);
    }
  }, [prayerTitle, router]);

  // localStorage에서 즐겨찾기 불러오기
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // 음성 합성 설정
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const populateVoiceList = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        const koreanVoices = availableVoices.filter(voice => voice.lang.startsWith('ko'));
        setVoices(koreanVoices.length > 0 ? koreanVoices : availableVoices);

        if (!selectedVoice) {
          const googleVoice = koreanVoices.find(voice => voice.name === 'Google 한국의');
          const appleVoice = koreanVoices.find(voice => voice.name === 'Yuna');

          if (googleVoice) {
            setSelectedVoice(googleVoice.voiceURI);
          } else if (appleVoice) {
            setSelectedVoice(appleVoice.voiceURI);
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
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
      };
    }
  }, [selectedVoice]);

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
    router.back();
  };

  const toggleFavorite = (prayerTitle) => {
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(prayerTitle)
        ? prevFavorites.filter(title => title !== prayerTitle)
        : [...prevFavorites, prayerTitle];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const speak = (text, index = -1) => {
    if (typeof window === 'undefined') return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentSpeakingLineIndex(-1);

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    } else {
      utterance.lang = 'ko-KR';
    }
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

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
    utteranceRef.current = utterance;
  };

  const toggleSpeakAll = () => {
    if (typeof window === 'undefined') return;
    
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
          utterance.rate = speechRate;
          utterance.pitch = speechPitch;

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
      window.speechSynthesis.cancel();
      speakNextLine();
    }
  };

  if (!selectedPrayer) {
    return (
      <div className="App">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{selectedPrayer.title} - 가톨릭 기도문 암송 도우미</title>
        <meta name="description" content={`${selectedPrayer.title} 기도문 암송을 도와주는 도우미 앱입니다.`} />
        <meta property="og:title" content={`${selectedPrayer.title} - 가톨릭 기도문 암송 도우미`} />
        <meta property="og:description" content={`${selectedPrayer.title} 기도문 암송을 도와주는 도우미 앱입니다.`} />
      </Head>

      <div className="prayer-view">
        <div className="prayer-title-header">
          <button className="back-button" onClick={goBack}>←</button>
          <h2>{selectedPrayer.title}</h2>
          <span 
            className={`favorite-icon-detail ${favorites.includes(selectedPrayer.title) ? 'favorited' : ''}`}
            onClick={() => toggleFavorite(selectedPrayer.title)}
          >
            ★
          </span>
        </div>
        
        <div className="prayer-content">
          {selectedPrayer.content.map((line, index) => (
            <div key={index} className="prayer-line-container">
              <p
                className={`prayer-line ${hiddenLines[index] ? 'hidden' : ''} ${currentSpeakingLineIndex === index ? 'highlighted' : ''}`}
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
    </>
  );
}

