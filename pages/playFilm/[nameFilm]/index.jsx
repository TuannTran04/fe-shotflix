import LayoutRoot from "@/components/Layout";
import Link from "next/link";
import Image from "next/legacy/image";
import CommentFilm from "../../../components/CommentFilm";
// import { arrDetailInfoFilm } from "./constant";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SliderTopRatingofWeek from "../../../components/SliderRelatedFilm";
import axios from "axios";
import VideoContainer from "./components/VideoContainer";
import VideoDetail from "./components/VideoDetail";
import Breadcrumb from "../../../components/BreadCrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const arrDetailInfoFilm = [
//   { id: 1, name: "Type", text: ["Movie"] },
//   { id: 2, name: "Genre", text: ["Animation", "Comedy", "Adventure"] },
//   { id: 3, name: "Release", text: "Jun 16, 2023" },
//   { id: 4, name: "Director", text: ["Peter", " John"] },
//   { id: 5, name: "Production", text: ["Disney", "Pixar"] },
//   { id: 6, name: "Cast", text: ["Lewis", "Athie", "Carmen"] },
// ];
// const TIME_UPDATE_VIEW = 900000

const TIME_UPDATE_VIEW = 900000;
const PlayFilmPage = ({ nameFilm, categories }) => {
  const film = useSelector((state) => state.film);
  const { movies, favoriteFilm, watchLaterFilm } = film;
  // console.log(">>> dataMovies <<<", topRatingofWeek);

  const [movie, setMovie] = useState({});
  // console.log(movie,"movie single")

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/update-views`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie?._id || "64ea009f4eb98d2906f135b2",
        }),
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }, TIME_UPDATE_VIEW);
    // after 15mins -> call api
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  useEffect(() => {
    const renderSingleMovie = async () => {
      try {
        let res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/user/${nameFilm}`
        );
        // console.log(">>> Results Search <<<", res);
        if (res.data.code === 200) {
          // console.log(">>> Results Search <<<", res.data.data.movieSingle[0]);
          setMovie(res.data.data.movieSingle[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    renderSingleMovie();
  }, [nameFilm]);

  return (
    <LayoutRoot categories={categories}>
      <div className="mt-16 ">
        <Breadcrumb content={`Xem phim ${movie?.title}`} />

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-5 ">
            <div className="p-2.5 bg-[#2D2D2D]">
              <div className="overflow-hidden">
                <VideoContainer movie={movie} />
              </div>

              <CommentFilm />
            </div>
          </div>

          {/* RIGHT */}
          <div className=" lg:col-span-2">
            <VideoDetail movie={movie} />
          </div>
        </div>

        <SliderTopRatingofWeek movies={movies?.topRatingofWeek} toast={toast} />
      </div>
      <ToastContainer />
    </LayoutRoot>
  );
};

export default PlayFilmPage;

export async function getServerSideProps({ params }) {
  const nameFilm = params.nameFilm;
  let allCategory = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
  );

  return {
    props: {
      nameFilm,
      categories: allCategory.data.data,
    },
  };
}
