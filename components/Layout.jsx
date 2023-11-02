import { Inter } from "next/font/google";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArrowGotoUp from "./ArrowGoToUp";
const inter = Inter({ subsets: ["latin"] });

const LayoutRoot = ({ children, categories, movieData }) => {
  // console.log("arr category", categories);
  return (
    <div className="w-full">
      <Head>
        <title>{movieData?.title ? movieData?.title : "Shotflix"}</title>
        <meta
          name="description"
          content={
            movieData?.desc
              ? movieData?.desc
              : "Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh..."
          }
        />
        <meta name="author" content={movieData?.author} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="Shotflix, shotflix, web phim ngắn shotflix"
        />
        <meta property="og:title" content="Shotflix" key="title" />
        <meta property="og:type" content="video.movie" />

        {/* /favicon.ico */}
        <meta
          property="og:image"
          content={
            movieData?.photo?.[0]
              ? movieData?.photo?.[0]
              : "https://img.freepik.com/free-vector/flat-vertical-hotel-information-flyer-template_23-2148898863.jpg?w=2000"
          }
        ></meta>
      </Head>
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
