import Image from "next/legacy/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFavoriteMovies,
  getWatchLaterMovies,
  addBookmarkMovie,
  addFavoriteMovie,
} from "../../../store/apiRequest";
import { createAxios } from "../../../utils/createInstance";

const Movie = ({ item, toast }) => {
  let { _id, title, slug, photo } = item;
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const dispatch = useDispatch();
  const accessToken = user?.accessToken;

  const [showMenu, setShowMenu] = useState(false);
  const handleShowMenuMovie = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
    console.log("toggle");
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }
      const res = await addFavoriteMovie(userId, _id);
      console.log(">>> addFavoriteMovie <<<", res);
      toast(res?.data?.message);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }
      const res = await addBookmarkMovie(userId, _id);
      console.log(res);
      toast(res?.data?.message);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  return (
    <div className="h-full">
      <div className="relative overflow-hidden h-full mx-2.5 group">
        <Link className="block h-full w-full z-20" href={`/playFilm/${slug}`}>
          <Image
            className="h-full block w-full object-cover group-hover:scale-110 transition-all duration-300 group-hover:opacity-50"
            src={photo?.[0] || "/vercel.svg"}
            alt={photo?.[0]}
            layout="fill"
            // width={213}
            // height={340}
            // loading="lazy"
            priority
          />
          <span className="flex justify-center absolute top-[43%] inset-x-0">
            <i className="fa-solid fa-circle-play text-5xl text-white scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-80 duration-500 ease-in-out"></i>
          </span>

          <span className="h-[20px] w-[20px] absolute top-0 right-0 bg-white cursor-pointer z-30">
            <i
              className="fa-solid fa-ellipsis-vertical flex justify-center items-center flex-1 w-full h-full text-center z-30"
              onClick={handleShowMenuMovie}
            ></i>
            {showMenu && (
              <span className="py-1 absolute top-0 right-[100%] bg-white  min-w-[100px] z-40">
                <span
                  className="px-2 flex justify-start items-center hover:bg-[rgba(0,0,0,0.3)] z-50"
                  onClick={handleFavorite}
                >
                  <p className="flex-1 w-full whitespace-nowrap">Yêu thích</p>
                  <i className="fa-regular fa-heart my-auto"></i>
                </span>
                <span
                  className="px-2 flex justify-start items-center mt-1 hover:bg-[rgba(0,0,0,0.3)] z-50"
                  onClick={handleBookmark}
                >
                  <p className="flex-1 w-full whitespace-nowrap">Xem sau</p>
                  <i className="fa-regular fa-clock my-auto"></i>
                </span>
              </span>
            )}
          </span>
        </Link>

        <div className="absolute bottom-0 left-0 right-0 text-center p-2 bg-black bg-opacity-70">
          <span className=" block text-white">
            <h3 className="whitespace-nowrap text-ellipsis overflow-hidden">
              <Link
                // href={`/playFilm/${title.replace(/\s+/g, "-")}`}
                href={`/playFilm/${slug}`}
                title="film"
              >
                {title || "title"}
              </Link>
            </h3>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Movie;
