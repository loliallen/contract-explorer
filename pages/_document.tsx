// pages/_document.js
import NextDocument, { Html, Head, Main, NextScript } from "next/document";

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="shortcut icon" href="logo.png" type="image/png" />
        </Head>
        <body>
          {/* 👇 Here's the script */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
