import { Html, Head, Main, NextScript } from "next/document";

// This project had no custom _document.tsx before — added so the
// marketplace preview's fonts (Satoshi, Space Grotesk) actually load.
// Declaring them here loads them for every page, but that's additive only:
// nothing else in this project sets a font-family that depends on either
// one being absent, so no other page's typography changes.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@variable&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
