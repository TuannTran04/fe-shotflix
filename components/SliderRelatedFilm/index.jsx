import Slider from "react-slick";

import { settings } from "./constant";
import Image from "next/legacy/image";
import MovieRalated from "./components/Movie";

import Heading from "../Heading";

const SliderTopRatingofWeek = ({ movies, toast }) => {
  // console.log("topRatingofWeek", movies);

  return (
    <div className="mt-10 mb-8">
      <Heading
        content={"Phim có rating cao nhất tuần"}
        styleDiv="mb-4"
        styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
      />

      <Slider {...settings}>
        {movies?.map((item, index) => {
          return <MovieRalated key={item._id} item={item} toast={toast} />;
        })}
      </Slider>
    </div>
  );
};

export default SliderTopRatingofWeek;

{
  /* <Slider {...settings}>
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
      </Slider> */
}
