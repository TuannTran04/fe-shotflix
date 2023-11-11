import Head from "next/head";
import { useRouter } from "next/router";

const SEO = ({ movieData }) => {
  const router = useRouter();
  return (
    <Head>
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
            : "https://img.freepik.com/free-vector/flat-vertical-hotel-information-flyer-template_23-2148898863.jpg?w=2000"
        }
      ></meta>
      <meta property="og:image:width" content="1200" key="ogimagewidth" />
      <meta property="og:image:height" content="630" key="ogimageheight" />

      <title>{movieData?.title ? movieData?.title : "Shotflix"}</title>
    </Head>
  );
};

export default SEO;
