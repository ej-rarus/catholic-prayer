import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { prayers } from '../../src/prayers';
import ShareButtons from '../../src/ShareButtons';

export default function PrayerDetail() {
  const router = useRouter();
  const { prayerTitle } = router.query;

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [hiddenLines, setHiddenLines] = useState([]);
  const [currentSpeakingLineIndex, setCurrentSpeakingLineIndex] = useState(-1);
  const [favorites, setFavorites] = useState([]);
  const utteranceRef = useRef(null);

  const speechRate = 0.9;
  const speechPitch = 0.9;

  useEffect(() => {
    if (prayerTitle) {
      const decoded = decodeURIComponent(prayerTitle);
      const prayer = prayers.find((p) => p.title === decoded);
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favorites');
      if (stored) setFavorites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const populateVoiceList = () => {
        const all = window.speechSynthesis.getVoices();
        const korean = all.filter((v) => v.lang.startsWith('ko'));
        setVoices(korean.length > 0 ? korean : all);
        if (!selectedVoice) {
          const google = korean.find((v) => v.name === 'Google 한국의');
          const apple = korean.find((v) => v.name === 'Yuna');
          if (google) setSelectedVoice(google.voiceURI);
          else if (apple) setSelectedVoice(apple.voiceURI);
          else if (korean.length > 0) setSelectedVoice(korean[0].voiceURI);
          else if (all.length > 0) setSelectedVoice(all[0].voiceURI);
        }
      };
      populateVoiceList();
      if (window.speechSynthesis.onvoiceschanged !== undefined)
        window.speechSynthesis.onvoiceschanged = populateVoiceList;
      return () => {
        window.speechSynthesis?.cancel();
        setIsSpeaking(false);
      };
    }
  }, [selectedVoice]);

  const toggleLine = (index) => {
    const next = [...hiddenLines];
    next[index] = !next[index];
    setHiddenLines(next);
  };

  const toggleAllLines = () => {
    const anyHidden = hiddenLines.some((l) => l);
    setHiddenLines(Array(selectedPrayer.content.length).fill(!anyHidden));
  };

  const toggleFavorite = (title) => {
    setFavorites((prev) => {
      const next = prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  const speak = (text, index = -1) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentSpeakingLineIndex(-1);
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.voiceURI === selectedVoice);
    if (voice) utterance.voice = voice;
    else utterance.lang = 'ko-KR';
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;
    utterance.onstart = () => { setCurrentSpeakingLineIndex(index); setIsSpeaking(true); };
    utterance.onend = () => { setCurrentSpeakingLineIndex(-1); setIsSpeaking(false); };
    utterance.onerror = () => { setCurrentSpeakingLineIndex(-1); setIsSpeaking(false); };
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
      const speakNext = () => {
        if (currentLine < selectedPrayer.content.length) {
          const text = selectedPrayer.content[currentLine];
          const utterance = new SpeechSynthesisUtterance(text);
          const voice = voices.find((v) => v.voiceURI === selectedVoice);
          if (voice) utterance.voice = voice;
          else utterance.lang = 'ko-KR';
          utterance.rate = speechRate;
          utterance.pitch = speechPitch;
          utterance.onstart = () => { setCurrentSpeakingLineIndex(currentLine); setIsSpeaking(true); };
          utterance.onend = () => { currentLine++; speakNext(); };
          utterance.onerror = () => { setCurrentSpeakingLineIndex(-1); setIsSpeaking(false); };
          window.speechSynthesis.speak(utterance);
          utteranceRef.current = utterance;
        } else {
          setCurrentSpeakingLineIndex(-1);
          setIsSpeaking(false);
        }
      };
      window.speechSynthesis.cancel();
      speakNext();
    }
  };

  if (!selectedPrayer) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-gothic text-on-surface-variant">로딩 중...</p>
      </div>
    );
  }

  const isFavorited = favorites.includes(selectedPrayer.title);
  const anyHidden = hiddenLines.some((l) => l);

  return (
    <>
      <Head>
        <title>{selectedPrayer.title} - 베다의 기도</title>
        <meta name="description" content={`${selectedPrayer.title} 기도문 암송 도우미`} />
        <meta property="og:title" content={`${selectedPrayer.title} - 베다의 기도`} />
        <meta property="og:description" content={`${selectedPrayer.title} 기도문 암송 도우미`} />
        <meta property="og:image" content="/og-thumbnail.png" />
        <link rel="canonical" href={`https://praywithbeda.com/prayer/${encodeURIComponent(selectedPrayer.title)}`} />
      </Head>

      <div className="pb-20 px-4 md:px-8 max-w-4xl mx-auto pt-8">
        {/* Title Bar */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-surface-container transition-colors rounded-full"
          >
            <span className="material-symbols-outlined text-on-surface">arrow_back</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-myeongjo font-bold text-primary tracking-tight">
            {selectedPrayer.title}
          </h1>
          <button
            onClick={() => toggleFavorite(selectedPrayer.title)}
            className="p-2 rounded-full hover:bg-surface-container transition-all"
          >
            <span
              className="material-symbols-outlined text-primary"
              style={isFavorited ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              star
            </span>
          </button>
        </div>

        {/* Controls */}
        <section className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="font-gothic text-sm text-on-surface-variant">목소리 선택:</label>
              <div className="relative">
                <select
                  value={selectedVoice || ''}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="appearance-none bg-surface-container-lowest border-none outline-none ring-1 ring-outline-variant/30 font-gothic text-sm px-4 py-2 pr-10 rounded-lg focus:ring-primary text-on-surface"
                  style={{ backgroundColor: 'var(--surface-container-lowest)' }}
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant text-sm">
                  expand_more
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAllLines}
                className="flex items-center gap-2 bg-surface-container-low hover:bg-surface-container-high px-5 py-2.5 rounded-lg transition-all border border-outline-variant/20 font-gothic text-sm text-on-surface"
              >
                <span className="material-symbols-outlined text-sm">
                  {anyHidden ? 'visibility' : 'visibility_off'}
                </span>
                {anyHidden ? '전체 보기' : '전체 가리기'}
              </button>
              <button
                onClick={toggleSpeakAll}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-gothic text-sm font-bold ${
                  isSpeaking
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'sacred-gradient text-on-primary border border-primary/20'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isSpeaking ? 'pause' : 'play_circle'}
                </span>
                {isSpeaking ? '멈춤' : '전체 듣기'}
              </button>
            </div>
          </div>
          <ShareButtons prayerTitle={selectedPrayer.title} />
        </section>

        {/* Prayer Card */}
        <article className="relative elegant-paper p-8 md:p-16 rounded-lg prayer-card-shadow border border-outline-variant/10 overflow-hidden">
          {/* Left accent bar */}
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-container/20" />

          <div className="space-y-1 max-w-2xl mx-auto prayer-text">
            {selectedPrayer.content.map((line, index) => {
              const isHidden = hiddenLines[index];
              const isHighlighted = currentSpeakingLineIndex === index;

              return (
                <div
                  key={index}
                  className={`group flex items-center justify-between py-2 px-4 rounded-lg transition-all cursor-pointer ${
                    isHighlighted
                      ? 'prayer-line-highlighted'
                      : 'hover:bg-primary-container/5'
                  }`}
                  onClick={() => toggleLine(index)}
                >
                  <p
                    className={`text-lg md:text-[1.35rem] break-keep font-medium flex-grow ${
                      isHidden
                        ? 'prayer-line-hidden'
                        : 'text-on-surface'
                    }`}
                  >
                    {isHidden ? line.replace(/./g, '\u2588') : line}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(line, index);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-primary ml-2 flex-shrink-0"
                  >
                    <span className="material-symbols-outlined">volume_up</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Decorative church icon */}
          <div className="mt-16 flex justify-center opacity-10">
            <span className="material-symbols-outlined text-4xl">church</span>
          </div>
        </article>
      </div>
    </>
  );
}
