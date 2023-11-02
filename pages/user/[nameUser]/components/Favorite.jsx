import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../../../utils/createInstance";
import { useState } from "react";
import {
  deleteBookmarkMovie,
  deleteFavoriteMovie,
} from "../../../../store/apiRequest";
import Link from "next/link";

const Favorite = ({ movie, toast, setArrFavoriteMovie }) => {
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

  const handleDeleteFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }
      const res = await deleteFavoriteMovie(userId, movie._id);
      // console.log(">>> deleteFavoriteMovie <<<", res);

      setArrFavoriteMovie((prevFavorires) => {
        return prevFavorires.filter((favorite) => favorite._id !== movie._id);
      });
      toast(res?.data?.message);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  // const handleDeleteBookmark = async (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   try {
  //     const res = await deleteBookmarkMovie(userId, movie._id);
  //     console.log(res);
  //     toast(res?.data?.message);
  //   } catch (err) {
  //     console.log(err);
  //     throw new Error(err);
  //   }
  // };

  return (
    <div className="">
      <Link
        href={`/playFilm/${movie.slug}`}
        className="relative block h-[300px] overflow-hidden group"
      >
        <img
          className="block w-full h-full object-cover group-hover:opacity-50 transition-all duration-500"
          src={movie.photo?.[0]}
          alt="pic"
        />
        <span className="absolute top-[50%] inset-x-0 opacity-0 group-hover:opacity-100 text-white text-center transition-all duration-500">
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
                onClick={handleDeleteFavorite}
              >
                <p className="flex-1 w-full whitespace-nowrap">Xóa yêu thích</p>
                <i className="fa-regular fa-heart ml-1 my-auto"></i>
              </span>
              {/* <span
                className="px-2 flex justify-start items-center mb-1 hover:bg-[rgba(0,0,0,0.3)] z-50"
                onClick={handleDeleteBookmark}
              >
                <p className="flex-1 w-full whitespace-nowrap">Xóa xem sau</p>
                <i className="fa-regular fa-clock ml-1 my-auto"></i>
              </span> */}
            </span>
          )}
        </span>
      </Link>
    </div>
  );
};

export default Favorite;
