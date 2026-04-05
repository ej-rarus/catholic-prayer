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

  React.useEffect(() => {
    if (searchTerm) {
      const lowercased = searchTerm.toLowerCase();
      const results = prayers.filter(
        (prayer) =>
          prayer.title.toLowerCase().includes(lowercased) ||
          prayer.content.some((line) => line.toLowerCase().includes(lowercased))
      );
      setFilteredPrayers(results);
    } else {
      setFilteredPrayers([]);
    }
  }, [searchTerm]);

  const handleLogoClick = () => {
    goToHome();
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    if (newCount === 7) {
      if (audioRef.current) audioRef.current.play();
      setIsLogoGlowing(true);
      setTimeout(() => setIsLogoGlowing(false), 2000);
      setLogoClickCount(0);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/church-bell.wav" preload="auto" />
      <header className="fixed top-0 w-full z-50 glass-nav border-b border-outline-variant/10 transition-all duration-500">
        <div className="flex justify-between items-center w-full px-6 md:px-8 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <button
            type="button"
            className={`cursor-pointer flex items-center gap-3 bg-transparent border-none p-0 ${isLogoGlowing ? 'glow' : ''}`}
            onClick={handleLogoClick}
          >
            <span className="text-xl md:text-2xl font-bold font-myeongjo text-primary tracking-tight">
              베다의 기도
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            <a
              onClick={goToHome}
              className="text-primary font-bold border-b-2 border-primary pb-1 font-gothic text-sm tracking-tight cursor-pointer"
            >
              기도문
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity"
            >
              {theme === 'light' ? 'dark_mode' : 'light_mode'}
            </button>
            <button
              onClick={selectRandomPrayer}
              className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity"
            >
              casino
            </button>
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity"
            >
              {showSearch ? 'close' : 'search'}
            </button>
          </div>
        </div>

        {/* Search Panel */}
        {showSearch && (
          <div className="w-full bg-surface-container-low border-t border-outline-variant/10">
            <div className="max-w-4xl mx-auto px-6 md:px-8 py-6">
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-primary">search</span>
                <input
                  type="text"
                  placeholder="기도문 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-lg font-gothic text-lg text-on-surface focus:ring-1 focus:ring-primary outline-none shadow-sm"
                />
              </div>
              {searchTerm && filteredPrayers.length > 0 && (
                <div className="mt-3 bg-surface-container-lowest rounded-lg overflow-hidden shadow-lg border border-outline-variant/15 max-h-64 overflow-y-auto">
                  {filteredPrayers.map((prayer) => (
                    <div
                      key={prayer.title}
                      onClick={() => selectPrayer(prayer)}
                      className="p-5 border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors cursor-pointer group flex justify-between items-center"
                    >
                      <span className="font-myeongjo text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                        {prayer.title}
                      </span>
                      <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-sm transition-colors">
                        arrow_forward_ios
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {searchTerm && filteredPrayers.length === 0 && (
                <p className="mt-4 text-center font-gothic text-sm text-secondary italic">
                  검색 결과가 없습니다.
                </p>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
