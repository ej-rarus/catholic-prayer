import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다." />
        <meta property="og:title" content="베다의 기도 - 가톨릭 기도문 암송 도우미" />
        <meta property="og:description" content="가톨릭 기도문 암송을 도와주는 웹 애플리케이션입니다." />
        <meta property="og:image" content="/og-thumbnail.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="베다의 기도 - 가톨릭 기도문 암송 도우미" />
        <meta property="og:type" content="website" />
        <meta name="twitter:image:alt" content="베다의 기도 - 가톨릭 기도문 암송 도우미" />
        <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

