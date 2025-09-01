import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from './ThemeContext';
import { prayers } from './prayers';

export default function Header() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isLogoGlowing, setIsLogoGlowing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPrayers, setFilteredPrayers] = useState([]);
  const audioRef = useRef(null);

  const goToHome = () => {
    router.push('/');
  };

  const selectRandomPrayer = () => {
    const randomIndex = Math.floor(Math.random() * prayers.length);
    const randomPrayer = prayers[randomIndex];
    router.push(`/prayer/${encodeURIComponent(randomPrayer.title)}`);
  };

  const selectPrayer = (prayer) => {
    router.push(`/prayer/${encodeURIComponent(prayer.title)}`);
    setShowSearch(false);
    setSearchTerm('');
  };

  // 검색어에 따른 기도문 필터링
  React.useEffect(() => {
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

  const handleLogoClick = () => {
    goToHome();

    const newClickCount = logoClickCount + 1;
    setLogoClickCount(newClickCount);

    if (newClickCount === 7) {
      if (audioRef.current) {
        audioRef.current.play();
      }
      setIsLogoGlowing(true);
      setTimeout(() => {
        setIsLogoGlowing(false);
      }, 2000);
      setLogoClickCount(0);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/church-bell.wav" preload="auto"></audio>
      <header className="App-header">
        <div className={`header-main-content ${isLogoGlowing ? 'glow' : ''}`} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" className="App-logo" alt="logo" />
          <h1>베다의 기도</h1>
          <p className="App-subtitle">가톨릭 기도문 암송 도우미</p>
        </div>
        <div className="header-buttons">
          <button onClick={toggleTheme} className="theme-toggle-button">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button onClick={selectRandomPrayer} className="random-prayer-button">
            🔀
          </button>
          <button onClick={() => setShowSearch(!showSearch)} className="search-toggle-button">
            🔍
          </button>
        </div>
        
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
      </header>
    </>
  );
}
