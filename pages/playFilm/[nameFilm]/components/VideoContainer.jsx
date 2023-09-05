import React from "react";
import { useState } from "react";
import ReactJWPlayer from "react-jw-player";
import JWPlayer from "@jwplayer/jwplayer-react";
import ReactPlayer from "react-player";

const VideoContainer = ({ movie }) => {
  const [videoQuality, setVideoQuality] = useState("720p"); // Chất lượng mặc định
  const handleQualityChange = (quality) => {
    setVideoQuality(quality);
  };

  let videoUrl;
  if (movie?.video?.[0]) {
    // videoUrl = `${process.env.NEXT_PUBLIC_URL}/video/riengminhanh_2023-9-4_16:15:17.mp4`;
    // videoUrl = `${process.env.NEXT_PUBLIC_URL}/video/sauchiatay_2023-9-4 16:11:31.mp4`;
    videoUrl = `${process.env.NEXT_PUBLIC_URL}/video/${movie?.video?.[0]}`;
  }

  const playlist = [
    {
      file: "https://firebasestorage.googleapis.com/v0/b/movie-the-stone.appspot.com/o/files%2FN%E1%BA%BFu%20%C4%90%C3%A1nh%20M%E1%BA%A5t%20Em%20-%20Reddy%20-%20Official%20Lyrics%20Video%20(1).mp4%20%20%20%20%20%20%202023-8-11%2017%3A54%3A34?alt=media&token=e595d5ee-2a75-4160-904c-f25dda4e4583",
      image: "https://link-to-my-poster.jpg",
      tracks: [
        {
          file: "https://link-to-subtitles.vtt",
          label: "English",
          kind: "captions",
          default: true,
        },
      ],
    },
    {
      file: "https://firebasestorage.googleapis.com/v0/b/movie-the-stone.appspot.com/o/files%2FN%E1%BA%BFu%20%C4%90%C3%A1nh%20M%E1%BA%A5t%20Em%20-%20Reddy%20-%20Official%20Lyrics%20Video%20(1).mp4%20%20%20%20%20%20%202023-8-11%2017%3A54%3A34?alt=media&token=e595d5ee-2a75-4160-904c-f25dda4e4583",
      image: "https://link-to-my-other-poster.jpg",
    },
  ];
  const playlistt = [
    {
      file: "/neudanhmatem.mp4",
      tracks: [
        {
          file: "/test.vtt",
          label: "English",
          kind: "captions",
          default: true,
        },
      ],
    },
  ];
  const qualityOptions = [
    { value: "1080p", label: "1080p" },
    { value: "720p", label: "720p" },
    { value: "480p", label: "480p" },
    { value: "360p", label: "360p" },
  ];
  return (
    <div className="players-container">
      <ReactPlayer
        url={videoUrl}
        // url={"https://youtu.be/DWYwmTdXpqw?si=yAfzJl4ilB-Y0fWd"}
        // url={
        //   "https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/files%2FB%C3%A1%C2%BA%C2%A3n%20in%20l%C3%A1%C2%BB%C2%97i.mp4%20%20%20%20%20%20%202023-8-16%2022%3A53%3A35?alt=media&token=f6bd78f4-3f03-40c8-a4f8-5ec41902866d"
        // }
        controls
        className=""
        config={{
          file: {
            attributes: {
              controlsList: "nodownload", // Loại bỏ nút tải xuống
              preload: "metadata", // Tải metadata trước để lấy thông tin chất lượng
            },
            tracks: [
              {
                kind: "subtitles",
                // src: "/test.vtt",
                src: "https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/files%2Fneudanhmatem_2023-9-5_15%3A10%3A0%2Ftest_2023-9-5_20%3A6%3A21.vtt?alt=media&token=899f003f-cf30-47a1-9c03-7526857529df",
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
    </div>
  );
};

export default VideoContainer;
