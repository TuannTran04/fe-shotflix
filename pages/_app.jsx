import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import ErrorBoundary from "../components/ErrorBoundary";
import SEO from "../components/SEO";

// analytic
export function reportWebVitals(metric) {
  // console.log("metric in _app",metric)
}
export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SEO />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
