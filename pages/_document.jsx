import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.0/flowbite.min.css"
          rel="stylesheet"
          crossOrigin="anonymous"
          referrerPolicy="no-re"
        /> */}
        <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
      </Head>
      <body>
        <div id="fb-root"></div>
        <Script src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v17.0&appId=285996387018931&autoLogAppEvents=1" />
        {/* <div className="fixed inset-x-0 inset-y-0 bg-slate-500 opacity-50 z-50">
          <div className="absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 bg-red-400 opacity-100 z-[500] h-[500px] w-[500px]"></div>
        </div> */}
        <Main />
        <NextScript />

        {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.0/flowbite.min.js"></script> */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.0/flowbite.min.js" />
      </body>
    </Html>
  );
}
