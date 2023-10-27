import LayoutRoot from "@/components/Layout";
import Link from "next/link";
import Image from "next/legacy/image";
// import CommentFilm from "../../../components/CommentFilm";
import CommentFilm from "../../../components/CommentFilm2";
// import { arrDetailInfoFilm } from "./constant";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import SliderTopRatingofWeek from "../../../components/SliderRelatedFilm";
import axios from "axios";
import VideoContainer from "./components/VideoContainer";
// import VideoContainer from "./components/VideoContainer_copy";
import VideoDetail from "./components/VideoDetail";
import Breadcrumb from "../../../components/BreadCrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

// const arrDetailInfoFilm = [
//   { id: 1, name: "Type", text: ["Movie"] },
//   { id: 2, name: "Genre", text: ["Animation", "Comedy", "Adventure"] },
//   { id: 3, name: "Release", text: "Jun 16, 2023" },
//   { id: 4, name: "Director", text: ["Peter", " John"] },
//   { id: 5, name: "Production", text: ["Disney", "Pixar"] },
//   { id: 6, name: "Cast", text: ["Lewis", "Athie", "Carmen"] },
// ];
// const TIME_UPDATE_VIEW = 900000

// Tạo kết nối Socket.IO
// const socket = io("http://localhost:8000");

const PlayFilmPage = ({ nameFilm, categories }) => {
  const film = useSelector((state) => state.film);
  const { movies, favoriteFilm, watchLaterFilm } = film;

  // console.log(">>> dataMovies <<<", movies?.topRatingofWeek);

  const [movie, setMovie] = useState({});
  const [isLgScreen, setIsLgScreen] = useState(false);

  // const [comments, setComments] = useState([]);
  // console.log(comments);
  // console.log(movie,"movie single")

  // useEffect(() => {
  //   const timerId = setTimeout(() => {
  //     fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/update-views`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         movieId: movie?._id || "64ea009f4eb98d2906f135b2",
  //       }),
  //     })
  //       .then((response) => response.json())
  //       .then((json) => console.log(json));
  //   }, TIME_UPDATE_VIEW);
  //   // after 15mins -> call api
  //   return () => {
  //     clearTimeout(timerId);
  //   };
  // }, []);

  useEffect(() => {
    // Xác định kích thước màn hình và cập nhật trạng thái isLgScreen
    const handleResize = () => {
      setIsLgScreen(window.innerWidth >= 1024); // Thay đổi ngưỡng theo yêu cầu của bạn
    };

    // Gắn sự kiện lắng nghe sự thay đổi kích thước màn hình
    window.addEventListener("resize", handleResize);

    // Khởi tạo trạng thái ban đầu
    handleResize();

    // Loại bỏ sự kiện lắng nghe khi component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const renderSingleMovie = async () => {
      try {
        let res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/user/${nameFilm}`
        );
        // let comments = await axios.get(
        //   `${process.env.NEXT_PUBLIC_URL}/api/v1/comment/${movies?._id}`
        // );
        // console.log(">>> Results Search <<<", comments);
        if (res.data.code === 200) {
          // console.log(">>> Results Search <<<", res.data.data.movieSingle[0]);
          setMovie(res.data.data.movieSingle[0]);
        }
        // if (comments.data.code === 200) {
        //   // console.log(">>> Results Search <<<", res.data.data.movieSingle[0]);
        //   setComments(comments.data.data);
        // }
      } catch (err) {
        console.log(err);
      }
    };
    renderSingleMovie();
  }, [nameFilm, movies?._id]);

  return (
    <LayoutRoot categories={categories}>
      <div className="md:mt-16">
        <Breadcrumb content={`Xem phim ${movie?.title}`} />

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <div className="p-1 sm:p-2.5 bg-[#2D2D2D]">
              <div className="overflow-hidden">
                <VideoContainer movie={movie} nameFilm={nameFilm} />
              </div>

              {isLgScreen && (
                <div className="hidden lg:block">
                  {/* Hiển thị CommentFilm khi màn hình lớn */}
                  <CommentFilm movieId={movie?._id} nameFilm={nameFilm} />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="mt-[20px] lg:mt-0 lg:col-span-2">
            <VideoDetail movie={movie} />
          </div>

          {!isLgScreen && (
            <div className="col-span-1 lg:hidden">
              {/* Hiển thị CommentFilm khi màn hình lớn */}
              <CommentFilm movieId={movie?._id} nameFilm={nameFilm} />
            </div>
          )}
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
