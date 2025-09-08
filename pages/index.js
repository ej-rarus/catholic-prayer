import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { prayers } from '../src/prayers';
import ShareButtons from '../src/ShareButtons';
import { useTheme } from '../src/ThemeContext';
import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const [favorites, setFavorites] = useState([]);

  // localStorage에서 즐겨찾기 불러오기 (클라이언트 사이드에서만)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    }
  }, []);

  // 즐겨찾기 변경 시 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined' && (favorites.length > 0 || localStorage.getItem('favorites'))) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (prayerTitle) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(prayerTitle)) {
        return prevFavorites.filter(title => title !== prayerTitle);
      } else {
        return [...prevFavorites, prayerTitle];
      }
    });
  };



  const selectPrayer = (prayer) => {
    router.push(`/prayer/${encodeURIComponent(prayer.title)}`);
    setShowSearch(false);
    setSearchTerm('');
  };

  const goToHome = () => {
    router.push('/');
    setShowSearch(false);
    setSearchTerm('');
  };

  const selectRandomPrayer = () => {
    const randomIndex = Math.floor(Math.random() * prayers.length);
    const randomPrayer = prayers[randomIndex];
    selectPrayer(randomPrayer);
  };

  return (
    <>
      <Analytics />
      <Head>
        <title>베다의 기도 - 가톨릭 기도문 암송 도우미</title>
        <meta name="description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다. 다양한 기도문을 선택하고 음성으로 들으며 암송 연습을 할 수 있습니다." />
        <meta name="keywords" content="가톨릭, 기도문, 암송, 성호경, 주님의 기도, 성모송, 사도신경, 묵주기도" />
        <meta name="author" content="베다의 기도" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="베다의 기도 - 가톨릭 기도문 암송 도우미" />
        <meta property="og:description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다." />
        <meta property="og:image" content="/og-thumbnail.png" />
        <meta property="og:url" content="https://catholic-prayer.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="베다의 기도 - 가톨릭 기도문 암송 도우미" />
        <meta name="twitter:description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다." />
        <meta name="twitter:image" content="/og-thumbnail.png" />
        <link rel="canonical" href="https://catholic-prayer.vercel.app/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "베다의 기도",
              "description": "가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다.",
              "url": "https://catholic-prayer.vercel.app/",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "author": {
                "@type": "Organization",
                "name": "베다의 기도"
              },
              "inLanguage": "ko-KR",
              "isAccessibleForFree": true,
              "featureList": [
                "가톨릭 기도문 암송 연습",
                "음성 재생 기능",
                "즐겨찾기 기능",
                "반응형 웹 디자인"
              ]
            })
          }}
        />
      </Head>
      


      <div className="prayer-selection">
        <h2>기도문 선택</h2>
        <div className="filter-buttons">
          <button className="active">전체</button>
          <button>즐겨찾기</button>
        </div>
        <div className="prayer-buttons">
          {prayers.map((prayer, index) => (
            <div key={index} className="prayer-button-container">
              <button onClick={() => selectPrayer(prayer)}>
                {prayer.title}
              </button>
              <span 
                className={`favorite-icon ${favorites.includes(prayer.title) ? 'favorited' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(prayer.title);
                }}
              >
                ★
              </span>
            </div>
          ))}
        </div>
        <ShareButtons shareTitle="가톨릭 기도문 암송 도우미" shareDescription="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다. 다양한 기도문을 선택하고 음성으로 들으며 암송 연습을 할 수 있습니다." />
      </div>
    </>
  );
}
