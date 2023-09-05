import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../../utils/createInstance";
import { getWatchLaterMovies } from "../../../store/apiRequest";
import WatchLater from "./components/WatchLater";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const accessToken = user?.accessToken;
  const userId = user?._id;
  let axiosJWT = createAxios(user, null, null);

  const [arrWatchLaterMovie, setArrWatchLaterMovie] = useState([]);

  useEffect(() => {
    const renderWatchLaterMovies = async () => {
      try {
        const res = await getWatchLaterMovies(accessToken, dispatch, axiosJWT);
        console.log(">>> Watch Later Film <<<", res.data.markBookMovie);
        setArrWatchLaterMovie(res.data.markBookMovie);
      } catch (err) {
        console.log(err);
      }
    };
    renderWatchLaterMovies();
  }, []);

  return (
    <div className="srcoll_film_manage_user grid grid-cols-2 md:grid-cols-5 gap-4 max-h-[1000px] min-h-[300px] overflow-y-auto">
      {arrWatchLaterMovie.map((movie, index) => (
        <WatchLater key={movie._id} movie={movie} toast={toast} />
      ))}
      <ToastContainer />
    </div>
  );
};

export default WatchLaterMovie;
