import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../../utils/createInstance";
import { useState } from "react";
import { addBookmarkMovie, addFavoriteMovie } from "../../../store/apiRequest";
import Link from "next/link";
import Image from "next/legacy/image";

const Movie = ({ item, toast }) => {
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
      const res = await addFavoriteMovie(userId, item._id);
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
      const res = await addBookmarkMovie(userId, item._id);
      console.log(res);
      toast(res?.data?.message);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  return (
    <div className="h-[300px] overflow-hidden">
      <div className="relative h-full overflow-hidden group">
        <Link
          href={`/playFilm/${item.slug}`}
          className="absolute h-full w-full group overflow-hidden"
        >
          <Image
            className="h-full block w-full object-cover group-hover:opacity-70 transition-all duration-500"
            src={item.photo?.[0] || "/vercel.svg"}
            alt="error"
            layout="fill"
            // width={213}
            // height={340}
            // loading="lazy"
            priority
          />

          <span className="opacity-0 group-hover:opacity-100 absolute top-[40%] inset-x-0 text-white text-center transition-all duration-500">
            <i className="fa-regular fa-circle-play text-4xl"></i>
          </span>

          <span className="h-[20px] w-[20px] absolute top-0 right-0 bg-white cursor-pointer z-30">
            <i
              className="fa-solid fa-ellipsis-vertical flex justify-center items-center flex-1 w-full h-full text-center z-30"
              onClick={handleShowMenuMovie}
            ></i>
            {showMenu && (
              <span className="py-1 absolute top-0 right-[100%] bg-white min-w-[100px] z-40">
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

          <span className="p-2 absolute bottom-0 inset-x-0 text-white bg-black bg-opacity-70">
            <h3 className="whitespace-nowrap text-ellipsis overflow-hidden">
              {item.title}
            </h3>
            <p className="text-sm opacity-50 whitespace-nowrap text-ellipsis overflow-hidden">
              {item.titleWithoutAccent}
            </p>
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Movie;
