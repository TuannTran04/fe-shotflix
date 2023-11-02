// import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-stars";
import Rating from "react-rating";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAxios } from "../../../../utils/createInstance";
import { loginSuccess } from "../../../../store/authSlice";
import { ratingMovie } from "../../../../store/apiRequest";

const VideoDetail = ({ movie }) => {
  // console.log(">>>check movie", movie);
  const [currentMovie, setCurrentMovie] = useState({});
  // console.log(currentMovie.rating, "moi nhat");
  const user = useSelector((state) => state.auth.login.currentUser);
  const username = user?.username;
  // console.log(user);
  const userId = user?._id;
  const accessToken = user?.accessToken;
  const dispatch = useDispatch();
  // let axiosJWT = createAxios(user, null, null);
  console.log(">>> accessToken in Rating <<<", accessToken);
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  const category = movie?.category?.map((category) => category.name);
  const arrDetailInfoFilm = [
    { id: 1, name: "Thể loại", text: category },
    { id: 2, name: "Phát hành", text: movie.yearPublish },
    { id: 3, name: "Đạo diễn", text: movie.author },
    { id: 4, name: "Diễn viên", text: movie.actors },
    { id: 5, name: "Quốc gia", text: movie.country },
    { id: 6, name: "Giải thưởng", text: movie.awards },
    { id: 7, name: "Lượt xem", text: movie.views },
  ];

  const ratingChanged = async (newRating) => {
    console.log(newRating);
    const base_url = process.env.NEXT_PUBLIC_URL;
    const controller = new AbortController();

    try {
      if (!movie) {
        return;
      }

      const data = {
        name: user?.username,
        point: Number(newRating) * 2,
        movieId: movie._id,
      };

      // const response = await ratingMovie(accessToken, dispatch, axiosJWT, data);
      const response = await axiosJWT.post(
        `${base_url}/api/v1/movie/rating`,
        JSON.stringify(data),
        {
          // headers: { token: `Bearer ${accessToken}` },
          withCredentials: true,
          headers: {
            token: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },

          signal: controller.signal,
        }
      );
      console.log("ratingChanged", response);
      if (response.data.code === 200) {
        toast(response?.data.message);
        setCurrentMovie(response.data.updatedMovie);
      }
    } catch (error) {
      console.log(error);
      controller.abort();
      toast(error);
    }
  };

  // console.log(
  //   movie.listUserRating?.find((item) => item.name == user?.username)?.point
  // );

  return (
    <div className=" py-[10px] rounded-md bg-[#1b2d58]">
      <div className="h-[400px] px-[15px]">
        <span className="block w-full h-full">
          <img
            className="block w-full h-full object-cover"
            src={movie?.photo?.[0] || ""}
            alt={movie?.photo?.[0] || ""}
            // width={55}
            // height={55}
            // layout="fill"
            // priority
          />
        </span>
      </div>

      <div>
        <h1 className="mx-[15px] mt-[22.5px] text-lg font-semibold text-white">
          {movie?.title}
        </h1>
        <div className="flex items-center pt-[7.5px] pb-[15px] px-[15px] mb-[15px] border-[1px] border-[#21376c]">
          <span className="min-w-[20px] px-[3px] bg-[#c7d2ee] text-xs font-medium text-black border-[1px] border-[#c7d2ee]">
            {movie?.quality}
          </span>
          <span className="ml-[6px] px-[3px] text-[#c7d2ee] text-xs font-medium border-[1px] border-[#c7d2ee]">
            PG
          </span>
          <span className="ml-[6px] text-base text-white">
            {movie?.timeVideo}
          </span>
        </div>
        <div className="px-[15px] pb-[15px] border-b-[1px] border-[#21376c]">
          <p className="scroll_desc max-h-[200px] text-[15px] text-white overflow-y-auto">
            {movie?.desc}
          </p>
        </div>
        <div className="m-[15px] text-[#c7d2ee]">
          {arrDetailInfoFilm.map((item, index) => (
            <div
              key={item.id}
              className={`flex text-[14px] font-normal ${
                index >= 1 ? "mt-[5px]" : ""
              }`}
            >
              <div className="min-w-[90px]">{item.name}:</div>
              <span className="flex-1">
                {Array.isArray(item.text) ? (
                  [1, 6].includes(item.id) ? (
                    item.text.map((subText, i) => (
                      <React.Fragment key={i}>
                        <p className="inline-block">{subText}</p>
                        {i !== item.text.length - 1 && ", "}
                      </React.Fragment>
                    ))
                  ) : (
                    item.text.map((subText, i) => (
                      <React.Fragment key={i}>
                        <Link
                          href={`/search/${subText.replace(/\s+/g, "+")}`}
                          className="text-[#f1ffff] hover:text-[#e94a68] transition-all duration-150 ease-in-out"
                        >
                          {subText}
                        </Link>
                        {i !== item.text.length - 1 && ", "}
                      </React.Fragment>
                    ))
                  )
                ) : (
                  <p className="inline-block">{item.text}</p>
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="bg-[#e94a68] py-[9px] px-[15px] mx-[15px] rounded-[4px] text-center">
          <span className="flex justify-center items-center">
            <ReactStars
              count={5}
              half={true}
              value={
                currentMovie?.listUserRating != undefined
                  ? currentMovie.listUserRating?.find(
                      (item) => item.name == username
                    )?.point / 2
                  : movie.listUserRating?.find((item) => item.name == username)
                      ?.point / 2 || 10
              }
              // value={0.5}
              onChange={ratingChanged}
              size={24}
              color2={"#ffd700"}
              edit={user ? true : false}
            />
          </span>

          {/* <span className="flex justify-center items-center">
            {movie && (
              <Rating
                stop={5}
                emptySymbol="fa-regular fa-star"
                fullSymbol="fa-solid fa-star"
                fractions={2}
                initialRating={
                  currentMovie?.listUserRating != undefined
                    ? currentMovie.listUserRating?.find(
                        (item) => item.name == username
                      )?.point / 2
                    : movie.listUserRating?.find(
                        (item) => item.name == username
                      )?.point / 2 || 10
                }
                // onHover={(rate) =>
                //   (document.getElementById("label-onrate").innerHTML = rate || "")
                // }
                // onChange={(rate) => alert(rate)}
                onChange={ratingChanged}
                readonly={!user ? true : false}
              />
            )}
          </span> */}

          <div>
            <span>
              <b>
                {currentMovie.rating != undefined
                  ? currentMovie?.rating?.toFixed(1)
                  : movie?.rating?.toFixed(1)}
              </b>{" "}
              of <b>10</b> ( {movie?.listUserRating?.length} reviews )
            </span>
          </div>
        </div>
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default VideoDetail;
