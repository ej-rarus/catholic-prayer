# 베다의 기도 - 가톨릭 기도문 암송 도우미

![베다의 기도 로고](public/logo.png)

**베다의 기도**는 가톨릭 신자들이 다양한 기도문을 쉽게 찾아보고, 듣고, 따라하며 암송하는 것을 돕기 위해 만들어진 웹 애플리케이션입니다. 깔끔하고 직관적인 인터페이스를 통해 사용자가 기도에 더 깊이 집중할 수 있도록 설계되었습니다.

## ✨ 주요 기능

*   **다양한 기도문 제공**: 성호경, 주님의 기도 등 기본 기도문부터 묵주기도의 신비, 삼종 기도까지 다양한 기도문을 포함하고 있습니다.
*   **암송 연습 도우미**: 각 기도문의 구절을 클릭하여 개별적으로 가리거나 다시 볼 수 있어, 효과적인 암송 연습이 가능합니다.
*   **음성 재생 (TTS)**: Web Speech API를 활용하여 각 구절 또는 전체 기도문을 음성으로 들을 수 있습니다.
*   **목소리 선택**: 사용자의 기기에 지원되는 다양한 한국어 목소리 중 원하는 목소리를 선택하여 들을 수 있습니다.
*   **즐겨찾기**: 자주 바치는 기도를 즐겨찾기에 추가하여 메인 화면에서 필터링하여 볼 수 있습니다. (데이터는 브라우저의 `localStorage`에 저장됩니다.)
*   **기도문 검색**: 기도문의 제목이나 내용의 일부를 검색하여 원하는 기도를 빠르게 찾을 수 있습니다.
*   **랜덤 기도 추천**: 헤더의 🔀 버튼을 눌러 어떤 기도를 바칠지 임의로 추천받을 수 있습니다.
*   **테마 변경**: 라이트 모드와 다크 모드를 모두 지원하여 사용자가 편안한 환경에서 앱을 사용할 수 있습니다.
*   **공유 기능**: 현재 보고 있는 기도문이나 앱 자체를 다른 사람에게 쉽게 공유할 수 있습니다.

## 🛠️ 기술 스택

*   **Frontend**: React.js
*   **Routing**: React Router
*   **State Management**: React Hooks (`useState`, `useEffect`, `useRef`)
*   **Styling**: CSS
*   **Core Web APIs**: Web Speech API (Text-to-Speech), Local Storage

## 🚀 시작하기

프로젝트를 로컬 환경에서 실행하려면 다음 단계를 따르세요.

1.  **저장소 복제(Clone)**
    ```bash
    git clone https://github.com/your-username/catholic-prayer.git
    cd catholic-prayer
    ```

2.  **의존성 설치**
    ```bash
    npm install
    ```

3.  **개발 서버 실행**
    ```bash
    npm start
    ```
    이제 브라우저에서 `http://localhost:3000`으로 접속하여 앱을 확인할 수 있습니다.

## 🤫 숨겨진 기능

앱의 로고 혹은 "베다의 기도" 제목을 7번 클릭해보세요. 작은 축복이 당신을 기다립니다.