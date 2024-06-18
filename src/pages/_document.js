import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Standard favicon */}
          <link rel="icon" href="/favicon.ico" />
          
          {/* Apple Touch Icon */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          
          {/* Android Chrome Icon */}
          <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
          
          {/* Other sizes */}
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          
          {/* Manifest for Progressive Web App (optional) */}
          <link rel="manifest" href="/site.webmanifest" />
          <script src="https://www.google.com/recaptcha/api.js" async defer></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;