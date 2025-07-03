import React, { useState, useEffect } from 'react';

function ScrollButtons() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) { // Show after 300px scroll
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="scroll-buttons-container">
      {isVisible && (
        <button onClick={scrollToTop} className="scroll-button top-button">
          ↑
        </button>
      )}
      {isVisible && (
        <button onClick={scrollToBottom} className="scroll-button bottom-button">
          ↓
        </button>
      )}
    </div>
  );
}

export default ScrollButtons;