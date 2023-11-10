import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import ErrorBoundary from "../components/ErrorBoundary";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
// analytic
export function reportWebVitals(metric) {
  // console.log("metric in _app",metric)
}
export default function App({ Component, pageProps }) {
  const router = useRouter();
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DefaultSeo
            title="Shotflix" // Tiêu đề mặc định cho trang
            description="Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh..."
            openGraph={{
              type: "website",
              locale: "vi_VN",
              // url: `${window.location.origin}${router.asPath}`, // URL của trang
              // site_name: window.location.origin,
            }}
          />
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
