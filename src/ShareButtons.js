import React from 'react';

function ShareButtons({ prayerTitle }) {
  const currentUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        alert('URL이 복사되었습니다!');
      })
      .catch(err => {
        console.error('URL 복사 실패:', err);
        alert('URL 복사에 실패했습니다.');
      });
  };

  const shareKakao = () => {
    if (window.Kakao) {
      const Kakao = window.Kakao;
      if (!Kakao.isInitialized()) {
        console.error('Kakao SDK is not initialized. Please check your JavaScript Key.');
        alert('카카오 SDK 초기화에 실패했습니다. 개발자 키를 확인해주세요.');
        return;
      }

      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `가톨릭 기도문: ${prayerTitle}`,
          description: `${prayerTitle} 기도문을 함께 암송해요.`, 
          imageUrl:
            '%PUBLIC_URL%/logo512.png', // Replace with your app's logo URL
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: currentUrl,
              webUrl: currentUrl,
            },
          },
        ],
      });
    } else {
      alert('카카오 SDK가 로드되지 않았습니다.');
    }
  };

  return (
    <div className="share-buttons-container">
      <button onClick={copyToClipboard} className="share-button copy-button">
        URL 복사
      </button>
      <button onClick={shareKakao} className="share-button kakao-button">
        카카오톡 공유
      </button>
    </div>
  );
}

export default ShareButtons;