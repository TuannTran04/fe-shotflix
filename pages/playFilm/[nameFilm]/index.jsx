import LayoutRoot from "@/components/Layout";
import Link from "next/link";
import Image from "next/legacy/image";
// import CommentFilm from "../../../components/CommentFilm";
import CommentFilm from "../../../components/CommentFilm2";
// import { arrDetailInfoFilm } from "./constant";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import SliderTopRatingofWeek from "../../../components/SliderRelatedFilm";
import axios from "axios";
import VideoContainer from "./components/VideoContainer";
// import VideoContainer from "./components/VideoContainer_copy";
import VideoDetail from "./components/VideoDetail";
import Breadcrumb from "../../../components/BreadCrumb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAxios } from "../../../utils/createInstance";
import { loginSuccess } from "../../../store/authSlice";
import {
  addBookmarkMovie,
  addFavoriteMovie,
  deleteBookmarkMovie,
  deleteFavoriteMovie,
} from "../../../store/apiRequest";
import { addArrFavorite, addArrWatchLater } from "../../../store/filmSlice";
import { useMemo } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

// const arrDetailInfoFilm = [
//   { id: 1, name: "Type", text: ["Movie"] },
//   { id: 2, name: "Genre", text: ["Animation", "Comedy", "Adventure"] },
//   { id: 3, name: "Release", text: "Jun 16, 2023" },
//   { id: 4, name: "Director", text: ["Peter", " John"] },
//   { id: 5, name: "Production", text: ["Disney", "Pixar"] },
//   { id: 6, name: "Cast", text: ["Lewis", "Athie", "Carmen"] },
// ];
// const TIME_UPDATE_VIEW = 900000

const PlayFilmPage = ({ nameFilm, categories }) => {
  const film = useSelector((state) => state.film);
  const { movies, favoriteFilm, watchLaterFilm } = film;
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);
  const userId = user?._id;
  const accessToken = user?.accessToken;
  // const favoriteFilm = user && user.loveMovie;
  // const watchLaterFilm = user && user.markBookMovie;

  let axiosJWT = createAxios(user, dispatch, loginSuccess);
  console.log(favoriteFilm);
  console.log(watchLaterFilm);

  // console.log(user);

  // console.log(">>> dataMovies <<<", movies?.topRatingofWeek);

  const [movie, setMovie] = useState({});
  // console.log(movie?._id);
  const [isLgScreen, setIsLgScreen] = useState(false);

  const checkFavoriteExist = useMemo(() => {
    if (!user) return;
    const isExist =
      favoriteFilm.length > 0 &&
      favoriteFilm.some((film) => film?._id === movie._id);

    return isExist;
  }, [favoriteFilm, movie]);

  const checkWatchLaterExist = useMemo(() => {
    if (!user) return;
    const isExist =
      watchLaterFilm.length > 0 &&
      watchLaterFilm.some((film) => film?._id === movie._id);
    return isExist;
  }, [watchLaterFilm, movie]);

  console.log(checkFavoriteExist);
  console.log(checkWatchLaterExist);

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

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!user || !accessToken) {
        toast("Đăng nhập để sử dụng tính năng này");
        return;
      }
      if (!checkFavoriteExist) {
        const res = await addFavoriteMovie(userId, movie._id);
        console.log(">>> addFavoriteMovie <<<", res);
        if (res.status === 200 && res?.data.newMovie) {
          dispatch(addArrFavorite([...favoriteFilm, res.data.newMovie]));
        }
        toast(res?.data?.message);
      } else {
        const res = await deleteFavoriteMovie(userId, movie._id);
        console.log(">>> deleteFavoriteMovie <<<", res);

        const newArrFavMovie = favoriteFilm.filter(
          (film) => film._id !== movie._id
        );
        console.log("newArrFavMovie", newArrFavMovie);

        if (res.status === 200) {
          dispatch(addArrFavorite([...newArrFavMovie]));
          toast(res?.data?.message);
        }
      }
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
      if (!checkWatchLaterExist) {
        const res = await addBookmarkMovie(userId, movie._id);
        console.log(res);

        if (res.status === 200 && res?.data.newMovie) {
          dispatch(addArrWatchLater([...watchLaterFilm, res.data.newMovie]));
        }
        toast(res?.data?.message);
      } else {
        const res = await deleteBookmarkMovie(userId, movie._id);
        console.log(">>> deleteBookMarkMovie <<<", res);

        const newArrBookMarkMovie = watchLaterFilm.filter(
          (film) => film._id !== movie._id
        );
        console.log("newArrBookMarkMovie", newArrBookMarkMovie);

        if (res.status === 200) {
          dispatch(addArrWatchLater([...newArrBookMarkMovie]));
          toast(res?.data?.message);
        }
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

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
  }, [nameFilm, movie?._id]);

  return (
    <LayoutRoot categories={categories} movieData={movie}>
      {/* <NextSeo
        title={movie?.title ? movie?.title : "Shotflix"}
        description={
          movie?.desc
            ? movie?.desc
            : "Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh..."
        }
        canonical={window.location.origin}
        openGraph={{
          url: `${window.location.origin}${router.asPath}`,
          title: movie?.title ? movie?.title : "Shotflix",
          description: movie?.desc
            ? movie?.desc
            : "Đây là trang web xem phim ngắn. Một 'sân chơi' dành cho các bạn trẻ đam mê nghệ thuật, điện ảnh...",
          images: [
            {
              url: movie?.photo?.[1]
                ? `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/poster/${
                    movie.folderOnFirebase
                  }/${movie.photo?.[1]?.trim()}`
                : "poster",
              width: 1200,
              height: 630,
              alt: "Og Image Alt",
              // type: "image/jpeg",
            },
          ],
          siteName: window.location.origin,
        }}
      /> */}

      <div className="md:mt-16">
        <Breadcrumb content={`Xem phim ${movie?.title}`} />

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <div className="p-1 sm:p-2.5 bg-[#2D2D2D]">
              <div className="overflow-hidden">
                <VideoContainer movie={movie} nameFilm={nameFilm} />
              </div>

              <div className="flex items-center mt-[10px] select-none">
                <div
                  className="flex justify-around items-center bg-[#0a5c6f] mr-[10px] py-[2px] px-2 rounded cursor-pointer"
                  onClick={handleFavorite}
                >
                  {!checkFavoriteExist ? (
                    <i className="fa-regular fa-heart text-sm text-[#06a2d4] mr-[5px]"></i>
                  ) : (
                    <i className="fa-solid fa-heart text-sm text-[#06a2d4] mr-[5px]"></i>
                  )}

                  <span className="text-sm text-[#06a2d4]">Thích</span>
                </div>

                <div
                  className="flex justify-around items-center bg-[#0a5c6f] mr-[10px] py-[2px] px-2 rounded cursor-pointer"
                  onClick={handleBookmark}
                >
                  {!checkWatchLaterExist ? (
                    <i className="fa-regular fa-bookmark text-sm text-[#06a2d4] mr-[5px]"></i>
                  ) : (
                    <i className="fa-solid fa-bookmark text-sm text-[#06a2d4] mr-[5px]"></i>
                  )}

                  <span className="text-sm text-[#06a2d4]">Xem sau</span>
                </div>
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
