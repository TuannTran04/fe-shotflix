import React, { useEffect, useRef } from "react";
import { useState } from "react";
import ReactJWPlayer from "react-jw-player";
import JWPlayer from "@jwplayer/jwplayer-react";
import ReactPlayer from "react-player";
import axios from "axios";

import { useRouter } from "next/router";
const VideoContainer = ({ movie }) => {
  const refVideo = useRef();
  // console.log(refVideo.current);

  const [videoState, setVideoState] = useState({
    videoId: movie._id || "myvideoid",
    currentTime:
      JSON.parse(localStorage.getItem("videoPlaybackState"))?.currentTime || 0,
  });
  const [videoQuality, setVideoQuality] = useState("720p"); // Chất lượng mặc định
  const handleQualityChange = (quality) => {
    setVideoQuality(quality);
  };
  const qualityOptions = [
    { value: "1080p", label: "1080p" },
    { value: "720p", label: "720p" },
    { value: "480p", label: "480p" },
    { value: "360p", label: "360p" },
  ];

  const [duration, setDuration] = useState(0);
  console.log("duration", duration);
  // useEffect(() => {
  //   // Wait for ReactPlayer to load metadata
  //   const d = refVideo.current.getDuration();
  //   setDuration(d);
  // }, []);
  const handleDuration = (d) => {
    setDuration(d);
  };

  const specificFolder = "neudanhmatem_2023-9-5_15:10:0";

  let videoUrl;
  if (movie?.video?.[0]) {
    // videoUrl = `${process.env.NEXT_PUBLIC_URL}/video/riengminhanh_2023-9-4_16:15:17.mp4`;
    // videoUrl = `${process.env.NEXT_PUBLIC_URL}/video/sauchiatay_2023-9-4 16:11:31.mp4`;
    // videoUrl = `${process.env.NEXT_PUBLIC_URL}/video/${movie?.video?.[0]}`;
    videoUrl = `${process.env.NEXT_PUBLIC_URL}/video/neudanhmatem_2023-9-5_15:10:0.mp4?specificFolder=${specificFolder}`;
  }

  const [sub, setSub] = useState("");
  // console.log(sub);
  // let subUrl = `${process.env.NEXT_PUBLIC_URL}/subtitles/test.vtt`;
  let subUrl = `${process.env.NEXT_PUBLIC_URL}/subtitles/test_2023-9-5_20:6:21.vtt?specificFolder=${specificFolder}`;

  // useEffect(() => {
  //   const renderSub = async () => {
  //     try {
  //       const getSub = await axios.get(
  //         `${process.env.NEXT_PUBLIC_URL}/subtitles/test.vtt`
  //       );
  //       setSub(getSub.data);

  //       console.log(getSub);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   renderSub();
  // }, []);

  // Khi component được tạo
  useEffect(() => {
    const savedVideoState = localStorage.getItem("videoPlaybackState");

    if (savedVideoState) {
      const parsedState = JSON.parse(savedVideoState);
      const currentTime = parsedState.currentTime;

      // Nếu có currentTime, thiết lập nó cho video
      const videoElement = document.querySelector(".players-container video"); // Thay 'myVideo' bằng ID thật của video
      if (videoElement) {
        videoElement.currentTime = currentTime;
      }
    }
  }, []);
  // Khi video bắt đầu phát
  const handleVideoPlay = () => {
    localStorage.setItem("videoPlaybackState", JSON.stringify(videoState));
  };

  const handleVideoTimeUpdate = (event) => {
    const newVideoState = {
      ...videoState,
      currentTime: event.target.currentTime,
      videoId: movie._id,
    };
    setVideoState(newVideoState);
    localStorage.setItem("videoPlaybackState", JSON.stringify(newVideoState));
  };

  // Khi video đã hoàn thành hoặc ngừng xem
  const handleVideoEnded = () => {
    // Xóa dữ liệu trạng thái video khỏi Local Storage
    localStorage.removeItem("videoPlaybackState");
  };
  // const handleVideoProgress = (state) => {
  //   // Trạng thái state chứa thông tin về thời gian hiện tại của video và nhiều thông tin khác
  //   const currentTime = state.playedSeconds; // Thời gian đã phát tính theo giây
  //   // Sử dụng currentTime theo ý của bạn, ví dụ:
  //   console.log(`Thời gian đã phát: ${currentTime} giây`);

  //   const newVideoState = { ...videoState, currentTime,videoId: movie._id};
  //   setVideoState(newVideoState);
  //   localStorage.setItem('videoPlaybackState', JSON.stringify(newVideoState));
  // };

  return (
    <div className="players-container">
      <video
        id={movie._id || "abc"} // Thay 'myVideo' bằng ID thật của video
        onPlay={handleVideoPlay}
        onTimeUpdate={handleVideoTimeUpdate}
        onEnded={handleVideoEnded}
        controls
      >
        <source
          src={`${process.env.NEXT_PUBLIC_URL}/video/riengminhanh.mp4`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* <ReactPlayer
        // url={movie?.video?.[0]}
        url={`${process.env.NEXT_PUBLIC_URL}/video/riengminhanh.mp4`}
        
      <ReactPlayer
        ref={refVideo}
        url={videoUrl}
        onDuration={handleDuration}
        light={
          <img
            src="https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/many_img%2Ftattay.jpg%20%20%20%20%20%20%202023-8-26%2014%3A18%3A27?alt=media&token=a2094971-d540-435c-ab57-669663a57695"
            alt="Thumbnail"
          />
        }
        controls
        id={movie._id || "abc"}
        onStart={handleVideoPlay}
        onProgress={handleVideoProgress}
        className=""
        config={{
          file: {
            attributes: {
              crossOrigin: "true",
              controlsList: "nodownload", // Loại bỏ nút tải xuống
              preload: "metadata", // Tải metadata trước để lấy thông tin chất lượng
            },
            tracks: [
              {
                kind: "subtitles",
                // src: "/test.vtt",
                src: subUrl,
                srcLang: "vn",
                default: true,
              },
              {
                kind: "subtitles",
                src: "/test.vtt",
                srcLang: "en",
              },
            ], // Loại bỏ phụ đề
            // forceHLS: true, // Sử dụng HLS cho video
            // forceVideo: true, // Sử dụng phần mềm video native
            quality: {
              defaultQuality: videoQuality, // Chất lượng mặc định
              options: qualityOptions, // Các tùy chọn chất lượng
              forced: true, // Bắt buộc chọn chất lượng
              onChange: handleQualityChange, // Xử lý khi người dùng thay đổi chất lượng
            },
          },
        }}
      />
      */}
    </div>
  );
};

export default VideoContainer;
