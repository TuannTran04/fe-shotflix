import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createAxios } from "../../../../utils/createInstance";
import {
  getFavoriteMovies,
  addBookmarkMovie,
  addFavoriteMovie,
} from "../../../../store/apiRequest";
import { useDispatch, useSelector } from "react-redux";
import Favorite from "../components/Favorite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../../../../store/authSlice";

// const arrFavoriteFilm = [
//   {
//     id: 1,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_01.jpg",
//   },
//   {
//     id: 2,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_01.jpg",
//   },
//   {
//     id: 3,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_01.jpg",
//   },
//   {
//     id: 4,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_01.jpg",
//   },
//   {
//     id: 5,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_01.jpg",
//   },
//   {
//     id: 6,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_01.jpg",
//   },
//   {
//     id: 7,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_01.jpg",
//   },
//   {
//     id: 8,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_01.jpg",
//   },
//   {
//     id: 9,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_01.jpg",
//   },
// ];

const FavoriteMovie = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const userId = user?._id;
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [arrFavoriteMovie, setArrFavoriteMovie] = useState([]);
  // console.log(arrFavoriteMovie);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const renderFavoriteMovies = async () => {
      try {
        const res = await getFavoriteMovies(
          accessToken,
          dispatch,
          axiosJWT,
          controller
        );
        console.log(">>> Favorite Film <<<", res);
        isMounted && setArrFavoriteMovie(res.data.loveMovie);
      } catch (err) {
        console.log(err);
      }
    };
    renderFavoriteMovies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="relative srcoll_film_manage_user grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[1000px] min-h-[200px] overflow-y-auto">
      {arrFavoriteMovie.length > 0 ? (
        arrFavoriteMovie?.map((movie, index) => (
          <Favorite
            key={movie._id}
            movie={movie}
            toast={toast}
            setArrFavoriteMovie={setArrFavoriteMovie}
          />
        ))
      ) : (
        <p className="absolute left-[50%] -translate-x-1/2 mx-auto text-white">
          Không có phim yêu thích nào!
        </p>
      )}
      <ToastContainer />
    </div>
  );
};

export default FavoriteMovie;
