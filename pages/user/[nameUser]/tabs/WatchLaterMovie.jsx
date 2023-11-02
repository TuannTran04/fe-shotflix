import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../../../utils/createInstance";
import { getWatchLaterMovies } from "../../../../store/apiRequest";
import WatchLater from "../components/WatchLater";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../../../../store/authSlice";

// const arrWatchLaterFilm = [
//   {
//     id: 1,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_05.jpg",
//   },
//   {
//     id: 2,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_05.jpg",
//   },
//   {
//     id: 3,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_05.jpg",
//   },
//   {
//     id: 4,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_05.jpg",
//   },
//   {
//     id: 5,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_05.jpg",
//   },
//   {
//     id: 6,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_05.jpg",
//   },
//   {
//     id: 7,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_05.jpg",
//   },
//   {
//     id: 8,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_05.jpg",
//   },
//   {
//     id: 9,
//     poster: "https://img.idesign.vn/1920x-/2019/01/25/ides_oscars_05.jpg",
//   },
// ];

const WatchLaterMovie = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login.currentUser);
  console.log(">>> store user", user);
  const accessToken = user?.accessToken;
  const userId = user?._id;
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const [arrWatchLaterMovie, setArrWatchLaterMovie] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const renderWatchLaterMovies = async () => {
      try {
        const res = await getWatchLaterMovies(
          accessToken,
          dispatch,
          axiosJWT,
          controller
        );
        // console.log(">>> Watch Later Film <<<", res.data.markBookMovie);
        isMounted && setArrWatchLaterMovie(res.data.markBookMovie);
      } catch (err) {
        console.log(err);
      }
    };
    renderWatchLaterMovies();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div className="srcoll_film_manage_user grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[1000px] min-h-[200px] overflow-y-auto">
      {arrWatchLaterMovie.length > 0 ? (
        arrWatchLaterMovie?.map((movie, index) => (
          <WatchLater
            key={movie._id}
            movie={movie}
            toast={toast}
            setArrWatchLaterMovie={setArrWatchLaterMovie}
          />
        ))
      ) : (
        <p className="absolute left-[50%] -translate-x-1/2 mx-auto text-white">
          Không có phim xem sau nào!
        </p>
      )}
      <ToastContainer />
    </div>
  );
};

export default WatchLaterMovie;
