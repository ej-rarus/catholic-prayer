import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다." />
        <meta property="og:title" content="베다의 기도 - 가톨릭 기도문 암송 도우미" />
        <meta property="og:description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다." />
        <meta property="og:image" content="/og-thumbnail.png" />
        <meta property="og:type" content="website" />
        <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

