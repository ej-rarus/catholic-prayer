import React, { useState, useEffect } from 'react';

function ScrollButtons() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <aside className="fixed bottom-10 right-6 md:right-10 flex flex-col gap-3 z-40">
      <button
        onClick={scrollToTop}
        className="w-12 h-12 rounded-full bg-surface-container-highest shadow-lg flex items-center justify-center hover:bg-primary-container transition-all group border border-outline-variant/30"
      >
        <span className="material-symbols-outlined text-on-surface group-hover:text-on-primary-container">
          arrow_upward
        </span>
      </button>
      <button
        onClick={scrollToBottom}
        className="w-12 h-12 rounded-full bg-surface-container-highest shadow-lg flex items-center justify-center hover:bg-primary-container transition-all group border border-outline-variant/30"
      >
        <span className="material-symbols-outlined text-on-surface group-hover:text-on-primary-container">
          arrow_downward
        </span>
      </button>
    </aside>
  );
}

export default ScrollButtons;
