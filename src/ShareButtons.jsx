import React from 'react';

function ShareButtons({ shareTitle, shareDescription }) {
  const [currentUrl, setCurrentUrl] = React.useState('');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const defaultTitle = "가톨릭 기도문 암송 도우미";
  const defaultDescription = "가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다. 다양한 기도문을 선택하고 음성으로 들으며 암송 연습을 할 수 있습니다.";

  const titleToShare = shareTitle || defaultTitle;
  const descriptionToShare = shareDescription || defaultDescription;

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
          title: titleToShare,
          description: descriptionToShare, 
          imageUrl:
            "https://praywithbeda.com/og-thumbnail.png", // Use absolute URL for image
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