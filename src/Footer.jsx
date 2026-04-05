import React from 'react';

function Footer() {
  return (
    <footer className="w-full py-12 px-8 mt-auto" style={{ backgroundColor: 'var(--footer-bg)' }}>
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-myeongjo text-lg font-bold text-on-surface">베다의 기도</span>
          <p className="font-gothic text-sm" style={{ color: 'var(--footer-text)' }}>
            &copy; 2025 Bede&apos;s Prayer. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 font-gothic text-sm">
          <span style={{ color: 'var(--footer-text)' }}>
            v2.0.3 Developed by{' '}
            <a
              href="https://leeeunjae.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ej_rarus
            </a>
          </span>
          <a
            href="https://maria.catholic.or.kr/mi_pr/prayer/prayer.asp?pgubun=3&sgubun=w"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
            style={{ color: 'var(--footer-text)' }}
          >
            가톨릭 공식 기도서
          </a>
          <a
            href="mailto:lpl2001@naver.com"
            className="hover:text-primary transition-colors"
            style={{ color: 'var(--footer-text)' }}
          >
            문의
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
