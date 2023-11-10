import Slider from "react-slick";

import { settings } from "./constants";
import Movie from "./components/Movie";

import { useSelector } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
import Heading from "../Heading";

const SliderTrendingFilm = ({ toast }) => {
  const film = useSelector((state) => state.film);
  const { movies } = film;

  return (
    <div className="mt-0 md:mt-20 mb-14 sm:mb-8 -mx-2.5">
      {/* <div>
        <img
          className="block w-full"
          src="https://ax.mpapis.xyz/motchill/uploads/342f50804f3a0bc5d9ff4b9e3b9c9964.gif"
          alt=""
        />
      </div> */}

      <Heading
        content="Top Trending"
        styleDiv="px-2.5 mb-4"
        styleTitle="text-[#da966e] text-3xl font-normal border-l-4 pl-2.5"
      />

      <Slider {...settings}>
        {movies?.trending?.map((item, index) => {
          return <Movie key={item._id} item={item} toast={toast} />;
        })}
      </Slider>
    </div>
  );
};

export default SliderTrendingFilm;
