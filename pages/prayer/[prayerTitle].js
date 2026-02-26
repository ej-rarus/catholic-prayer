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
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
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
        <meta name="description" content={`${selectedPrayer.title} 기도문 암송을 도와주는 도우미 앱입니다. 음성으로 들으며 암송 연습을 할 수 있습니다.`} />
        <meta name="keywords" content={`가톨릭, 기도문, ${selectedPrayer.title}, 암송, 음성재생`} />
        <meta name="author" content="베다의 기도" />
        <meta property="og:title" content={`${selectedPrayer.title} - 가톨릭 기도문 암송 도우미`} />
        <meta property="og:description" content={`${selectedPrayer.title} 기도문 암송을 도와주는 도우미 앱입니다.`} />
        <meta property="og:image" content="/og-thumbnail.png" />
        <meta property="og:url" content={`https://catholic-prayer.vercel.app/prayer/${encodeURIComponent(selectedPrayer.title)}`} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${selectedPrayer.title} - 가톨릭 기도문 암송 도우미`} />
        <meta name="twitter:description" content={`${selectedPrayer.title} 기도문 암송을 도와주는 도우미 앱입니다.`} />
        <meta name="twitter:image" content="/og-thumbnail.png" />
        <link rel="canonical" href={`https://catholic-prayer.vercel.app/prayer/${encodeURIComponent(selectedPrayer.title)}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": selectedPrayer.title,
              "description": `${selectedPrayer.title} 기도문 암송을 도와주는 도우미 앱입니다.`,
              "url": `https://catholic-prayer.vercel.app/prayer/${encodeURIComponent(selectedPrayer.title)}`,
              "author": {
                "@type": "Organization",
                "name": "베다의 기도"
              },
              "publisher": {
                "@type": "Organization",
                "name": "베다의 기도",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://catholic-prayer.vercel.app/logo.png"
                }
              },
              "datePublished": "2024-12-19",
              "dateModified": "2024-12-19",
              "inLanguage": "ko-KR",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://catholic-prayer.vercel.app/prayer/${encodeURIComponent(selectedPrayer.title)}`
              },
              "articleSection": "가톨릭 기도문",
              "keywords": `가톨릭, 기도문, ${selectedPrayer.title}, 암송, 음성재생`,
              "text": selectedPrayer.content.join(' ')
            })
          }}
        />
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

