// import { Inter } from "next/font/google";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArrowGotoUp from "./ArrowGoToUp";
import { useRouter } from "next/router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextSeo } from "next-seo";
// const inter = Inter({ subsets: ["latin"] });

const LayoutRoot = ({ children, categories, movieData }) => {
  // console.log("arr category", categories);\\
  const router = useRouter();

  console.log(
    movieData?.photo?.[1]
      ? `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/poster/${
          movieData.folderOnFirebase
        }/${movieData.photo?.[1]?.trim()}`
      : "poster"
  );

  // console.log(movieData?.photo?.[0]);
  return (
    <div className="w-full">
      <NextSeo
        title={movieData?.title ? movieData?.title : "Shotflix"}
        description={
          movieData?.desc
            ? movieData?.desc
            : "Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh..."
        }
        canonical={window.location.origin}
        openGraph={{
          type: "website",
          locale: "vi_VN",
          url: `${window.location.origin}${router.asPath}`,
          title: movieData?.title ? movieData?.title : "Shotflix",
          description: movieData?.desc
            ? movieData?.desc
            : "Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh...",
          images: [
            {
              url: movieData?.photo?.[1]
                ? `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/poster/${
                    movieData.folderOnFirebase
                  }/${movieData.photo?.[1]?.trim()}`
                : "poster",
              width: 1200,
              height: 630,
              alt: "Og Image Alt",
              // type: "image/jpeg",
            },
          ],
          siteName: window.location.origin,
        }}
        // twitter={{
        //   handle: "@handle",
        //   site: "@site",
        //   cardType: "summary_large_image",
        // }}
      />

      {/* <Head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta
          name="description"
          content={
            movieData?.desc
              ? movieData?.desc
              : "Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh..."
          }
        />
        <meta name="author" content={movieData?.author} />
        <meta
          name="keywords"
          content="Shotflix, shotflix, web phim ngắn shotflix"
        />
        <meta property="og:title" content="Shotflix" key="title" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content={window.location.origin} />
        <meta
          property="og:url"
          content={`${window.location.origin}${router.asPath}`}
        />
        <meta
          property="og:description"
          content={
            movieData?.desc
              ? movieData?.desc
              : "Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh..."
          }
        />

        <meta
          property="og:image"
          content={
            movieData?.photo?.[1]
              ? `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/poster/${
                  movieData.folderOnFirebase
                }/${movieData.photo?.[1]?.trim()}`
              : "poster"
          }
        ></meta>
        <meta property="og:image:width" content="1200" key="ogimagewidth" />
        <meta property="og:image:height" content="630" key="ogimageheight" />

        <title>{movieData?.title ? movieData?.title : "Shotflix"}</title>
      </Head> */}
      <Header categories={categories} />
      <div className="bg-[#424040]">
        <div className="w-full md:max-w-[1200px] mx-auto bg-[#151414] p-3 sm:p-7">
          {children}
        </div>
      </div>
      <ArrowGotoUp />
      <Footer />
    </div>
  );
};

export default LayoutRoot;
