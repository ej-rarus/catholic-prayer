import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { prayers } from '../src/prayers';
import ShareButtons from '../src/ShareButtons';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favorites');
      if (stored) setFavorites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && (favorites.length > 0 || localStorage.getItem('favorites'))) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (title) => {
    setFavorites((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const filteredPrayers = filter === 'all' ? prayers : prayers.filter((p) => favorites.includes(p.title));

  const selectPrayer = (prayer) => {
    router.push(`/prayer/${encodeURIComponent(prayer.title)}`);
  };

  return (
    <>
      <Analytics />
      <Head>
        <title>베다의 기도 - 가톨릭 기도문 암송 도우미</title>
        <meta name="description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다." />
        <meta name="keywords" content="가톨릭, 기도문, 암송, 성호경, 주님의 기도, 성모송, 사도신경, 묵주기도" />
        <meta property="og:title" content="베다의 기도 - 가톨릭 기도문 암송 도우미" />
        <meta property="og:description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다." />
        <meta property="og:image" content="/og-thumbnail.png" />
        <meta property="og:url" content="https://praywithbeda.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ko_KR" />
        <link rel="canonical" href="https://praywithbeda.com/" />
      </Head>

      <div className="pb-20 px-6 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12 pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
            <div>
              <span className="text-primary font-bold tracking-widest text-xs mb-4 block font-gothic uppercase">
                Daily Prayer
              </span>
              <h2 className="text-3xl md:text-5xl font-myeongjo leading-tight text-on-surface">
                오늘의 마음을
                <br />
                기도로 채우는 시간
              </h2>
            </div>
            {/* Filter Tabs */}
            <div className="flex p-1 bg-surface-container-low rounded-lg">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 md:px-8 py-2.5 rounded-md text-sm font-gothic transition-all ${
                  filter === 'all'
                    ? 'font-bold bg-surface-container-highest text-primary shadow-sm'
                    : 'font-medium text-on-surface-variant hover:text-primary'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilter('favorites')}
                className={`px-6 md:px-8 py-2.5 rounded-md text-sm font-gothic transition-all ${
                  filter === 'favorites'
                    ? 'font-bold bg-surface-container-highest text-primary shadow-sm'
                    : 'font-medium text-on-surface-variant hover:text-primary'
                }`}
              >
                즐겨찾기
              </button>
            </div>
          </div>

          {/* Prayer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {filteredPrayers.map((prayer, index) => {
              const isFavorited = favorites.includes(prayer.title);
              const isFirst = index === 0 && filter === 'all';
              return (
                <article
                  key={prayer.id}
                  onClick={() => selectPrayer(prayer)}
                  className={`group relative bg-surface-container-lowest rounded-xl border border-outline-variant/10 prayer-card-shadow p-6 md:p-8 flex flex-col justify-between transition-all hover:-translate-y-1 cursor-pointer ${
                    isFirst ? 'lg:col-span-2' : ''
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prayer.title);
                        }}
                        className={`material-symbols-outlined cursor-pointer transition-colors ${
                          isFavorited ? 'text-primary-container' : 'text-outline-variant/40'
                        }`}
                        style={isFavorited ? { fontVariationSettings: "'FILL' 1" } : {}}
                      >
                        star
                      </span>
                    </div>
                    <h3
                      className={`font-myeongjo text-on-surface leading-snug mb-3 group-hover:text-primary transition-colors ${
                        isFirst ? 'text-2xl md:text-3xl' : 'text-xl'
                      }`}
                    >
                      {prayer.title}
                    </h3>
                    <p className="text-sm font-myeongjo text-on-surface-variant line-clamp-2 leading-relaxed opacity-80">
                      {prayer.content.slice(0, 2).join(' ')}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant/10 flex items-center justify-end">
                    <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                      arrow_forward
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {filter === 'favorites' && filteredPrayers.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-outline-variant text-5xl mb-4 block">
                bookmark_add
              </span>
              <p className="font-gothic text-on-surface-variant">
                즐겨찾기한 기도문이 없습니다.
                <br />
                기도문에서 별표를 눌러 추가해보세요.
              </p>
            </div>
          )}
        </section>

        {/* Quote Section */}
        <section className="py-16 md:py-24 text-center border-t border-outline-variant/20 mt-8">
          <div className="max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-primary-container text-4xl mb-6 block">
              auto_awesome
            </span>
            <p className="text-xl md:text-2xl font-myeongjo leading-loose text-on-surface italic">
              &ldquo;기도는 영혼의 호흡이며,
              <br />
              하느님과 나누는 고요한 대화입니다.&rdquo;
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <ShareButtons
              shareTitle="가톨릭 기도문 암송 도우미"
              shareDescription="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다."
            />
          </div>
        </section>
      </div>
    </>
  );
}
