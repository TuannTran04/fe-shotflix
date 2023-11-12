import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import ErrorBoundary from "../components/ErrorBoundary";
import Head from "next/head";
import Script from "next/script";

// analytic
export function reportWebVitals(metric) {
  // console.log("metric in _app",metric)
}
export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Head>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
              integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />

            <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
            <link
              href="https://vjs.zencdn.net/8.5.2/video-js.css"
              rel="stylesheet"
            />

            <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.0/flowbite.min.js" />
            <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
            <script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>
          </Head>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
