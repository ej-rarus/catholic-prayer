import React from 'react';

function ShareButtons({ prayerTitle, shareTitle, shareDescription }) {
  const [currentUrl, setCurrentUrl] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      if (window.Kakao && !window.Kakao.isInitialized()) {
        const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
        if (kakaoKey) window.Kakao.init(kakaoKey);
      }
    }
  }, []);

  const titleToShare = prayerTitle || shareTitle || '가톨릭 기도문 암송 도우미';
  const descriptionToShare =
    shareDescription ||
    '가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다. 다양한 기도문을 선택하고 음성으로 들으며 암송 연습을 할 수 있습니다.';

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => alert('URL이 복사되었습니다!'))
      .catch(() => alert('URL 복사에 실패했습니다.'));
  };

  const shareKakao = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert('카카오 SDK가 로드되지 않았습니다.');
      return;
    }
    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: titleToShare,
          description: descriptionToShare,
          imageUrl: 'https://praywithbeda.com/og-thumbnail.png',
          link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
        },
        buttons: [{ title: '웹으로 보기', link: { mobileWebUrl: currentUrl, webUrl: currentUrl } }],
      });
    } catch {
      alert('카카오톡 공유에 실패했습니다.');
    }
  };

  return (
    <div className="flex items-center gap-3 mt-8">
      <button
        onClick={copyToClipboard}
        className="p-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/10 hover:text-primary transition-colors prayer-card-shadow"
      >
        <span className="material-symbols-outlined">link</span>
      </button>
      <button
        onClick={shareKakao}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-gothic text-sm font-bold shadow-sm"
        style={{ backgroundColor: '#FEE500', color: '#3C1E1E' }}
      >
        <span className="material-symbols-outlined text-lg">chat_bubble</span>
        카카오톡 공유
      </button>
    </div>
  );
}

export default ShareButtons;
