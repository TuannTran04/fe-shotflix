import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { arrSliderRelatedFilm, settings } from "./constant";
import Image from "next/legacy/image";
import MovieRalated from "./components/Movie";
import { useEffect, useState } from "react";
import { getAllMovies } from "../../store/apiRequest";

const SliderRelatedFilm = () => {
  const [arrMovie, setArrMovie] = useState();

  useEffect(() => {
    const renderTopRatingOfWeekMovies = async () => {
      try {
        const res = await getAllMovies();
        // console.log(">>> TOP RATING WEEK Film <<<", res.data.data.movie);
        setArrMovie(res.data.data.movie);
      } catch (err) {
        console.log(err);
      }
    };
    // renderTopRatingOfWeekMovies();
  }, []);

  return (
    <div className="mt-10 mb-8 -mx-2.5">
      <div className="px-2.5 mb-4">
        <h2 className="text-[#da966e] text-3xl font-normal border-l-4 pl-2.5">
          PHIM CÓ RATING CAO NHẤT TUẦN
        </h2>
      </div>
      {/* <Slider {...settings}>
        {arrSliderRelatedFilm.map((item, i) => (
          <div key={item.id} className="h-full overflow-hidden">
            <div className="relative h-full mx-2 overflow-hidden group">
              <Link
                href={`/detail/${item.title.replace(/\s+/g, "-")}`}
                className="absolute h-full w-full group overflow-hidden"
              >
                <Image
                  className="h-full block w-full object-cover group-hover:opacity-70 transition-all duration-500"
                  src={item.image || "/vercel.svg"}
                  alt="error"
                  layout="fill"
                  width={213}
                  height={340}
                  loading="lazy"
                  priority
                />

                <img
                  src={item.image || "/vercel.svg"}
                  alt="user profile avatar"
                  className="h-full block w-full object-cover group-hover:opacity-70 transition-all duration-500"
                />

                <span className="opacity-0 group-hover:opacity-100 absolute top-[40%] inset-x-0 text-white text-center transition-all duration-500">
                  <i className="fa-regular fa-circle-play text-4xl"></i>
                </span>

                <span className="absolute top-[40%] left-[20%] opacity-0 group-hover:opacity-100 duration-500 ease-in-out z-50">
                  <button
                    className="text-white z-50"
                    // onClick={handleLove}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(e.target);
                    }}
                  >
                    {false ? (
                      <i className="fa-solid fa-heart text-2xl"></i>
                    ) : (
                      <i className="fa-regular fa-heart text-2xl"></i>
                    )}
                  </button>
                </span>
                <span className="absolute top-[40%] right-[20%] opacity-0 group-hover:opacity-100 duration-500 ease-in-out z-50">
                  <button
                    className="text-white z-50"
                    // onClick={handleBookmark}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(e.target);
                    }}
                  >
                    {false ? (
                      <i className="fa-solid fa-bookmark text-2xl"></i>
                    ) : (
                      <i className="fa-regular fa-bookmark text-2xl"></i>
                    )}
                  </button>
                </span>

                <span className="p-2 absolute bottom-0 inset-x-0 text-white bg-black bg-opacity-70">
                  <h3 className="whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.title}
                  </h3>
                  <p className="text-sm opacity-50 whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.title}
                  </p>
                </span>
              </Link>
            </div>
          </div>
        ))}
      </Slider> */}

      <Slider {...settings}>
        {arrSliderRelatedFilm.map((item, index) => {
          return <MovieRalated key={item} item={item} />;
        })}
      </Slider>
    </div>
  );
};

export default SliderRelatedFilm;
