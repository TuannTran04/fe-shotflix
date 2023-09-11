import React, { memo, useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import { useRouter } from "next/router";
const CryptoJS = require("crypto-js");

// Sử dụng các hàm mã hóa và giải mã
const secretKey =
  "`MZ7Iv;1gaddDPD!'?h+2x8;dW)%(C`=Q-hv^fZhWs0e5Kl7J!_&4[48]?bT4";

const VideoContainer = ({ movie, nameFilm }) => {
  const router = useRouter();
  const refVideo = useRef();
  // let player = useRef(null);
  const [playerInstance, setPlayerInstance] = useState(null);
  console.log(">>> player <<<", playerInstance);

  // // Hàm mã hóa
  // function encryptData(data, secretKey) {
  //   const ciphertext = CryptoJS.AES.encrypt(data, secretKey);
  //   return ciphertext.toString();
  // }

  // // Hàm giải mã
  // function decryptData(encryptedData, secretKey) {
  //   const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
  //   return bytes.toString(CryptoJS.enc.Utf8);
  // }

  const [isPlyrInitialized, setIsPlyrInitialized] = useState(false);
  const setupPlyr = () => {
    // Chuyển đổi dữ liệu phụ đề thành định dạng Plyr
    if (Object.keys(movie).length > 0) {
      const plyrTracks = movie.subtitles?.map((subtitle, index) => ({
        kind: "captions",
        label: `${subtitle.langSubtitle} captions`,
        srcLang: subtitle.langSubtitle,
        src: `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/subtitles/${subtitle.subtitle}?specificFolder=${movie.folderOnFirebase}`,
        default: index === 0, // Đánh dấu phụ đề đầu tiên là mặc định
      }));
      // console.log("plyrTracks", plyrTracks);

      const plyrSources = movie.sources?.map((video, index) => ({
        src: `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/video/${video.srcVideo}?specificFolder=${movie.folderOnFirebase}`,
        type: video.typeVideo,
        size: video.sizeVideo,
      }));
      // console.log("plyrSources", plyrSources);

      // Khởi tạo Ply
      let player;
      if (refVideo.current) {
        player = new Plyr(refVideo.current, {
          title: "Example Title",
          controls: [
            "play-large", // The large play button in the center
            "restart", // Restart playback
            "rewind", // Rewind by the seek time (default 10 seconds)
            "play", // Play/pause playback
            "fast-forward", // Fast forward by the seek time (default 10 seconds)
            "progress", // The progress bar and scrubber for playback and buffering
            "current-time", // The current time of playback
            "duration", // The full duration of the media
            "mute", // Toggle mute
            "volume", // Volume control
            "captions", // Toggle captions
            "settings", // Settings menu
            "pip", // Picture-in-picture (currently Safari only)
            "airplay", // Airplay (currently Safari only)
            "fullscreen", // Toggle fullscreen
          ],
          settings: ["captions", "quality", "speed", "loop"],
          quality: {
            default: 720,
            options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
          },
          captions: { active: true, language: "vn", update: true },
          tooltips: { controls: true, seek: true },
          keyboard: { focused: true, global: true },
          markers: {
            enabled: true,
            points: [{ time: 50, label: "con cec" }],
          },
          fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: true,
            container: null,
          },
          disableContextMenu: false,
          playsinline: true,
          enabled: true,
          // debug: true,
        });
        // console.log(player.duration);
        setPlayerInstance(player);
      }

      // Thiết lập tracks cho Plyr
      // player.source = {
      //   type: "video",
      //   title: "Example title",
      //   sources: plyrSources,
      //   poster:
      //     "https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/files%2Friengminhanh-426x240_2023-9-8_11%3A37%3A41%2Ftattay.jpg?alt=media&token=bf80ba35-fb61-40f6-9910-00402f79183e",
      //   tracks: plyrTracks,
      // };

      // Đặt sự kiện cho Plyr khi video load xong các data
      if (player.playing == false) {
        player.on("loadedmetadata", (event) => {
          console.log("readyyyy start");
          // console.log(event.detail.plyr);
          console.log(event.detail.plyr.duration);
          // Kiểm tra nếu có trạng thái xem video trong Local Storage
          // const savedPlaybackTime = JSON.parse(
          //   decryptData(localStorage.getItem(`${movie?._id}`), secretKey)
          // );

          const savedPlaybackTime = JSON.parse(
            localStorage.getItem(`${movie?._id}`)
          );
          console.log(savedPlaybackTime);
          const currTimeLocal = savedPlaybackTime?.currentTime;
          const videoIdLocal = savedPlaybackTime?.videoId;

          if (videoIdLocal == movie._id && event.detail.plyr.duration) {
            console.log("savedPlaybackTime canplay");

            const setPlayerCurrentTime = (currentTime) => {
              setTimeout(() => {
                const minutes = Math.floor(currentTime / 60);
                const seconds = Math.round(currentTime % 60);
                if (true) {
                  console.log(player.current);
                  console.log("continue");
                  event.detail.plyr.muted = false;
                  event.detail.plyr.currentTime = currentTime;
                  // player.play();
                } else {
                  console.log("begin");
                  player.muted = true;
                  player.currentTime = 0;
                  player.play();
                }
              }, 500);
            };
            setPlayerCurrentTime(currTimeLocal);
          }
        });
      }

      // Đặt sự kiện cho Plyr khi video được update time
      player.on("timeupdate", (event) => {
        console.log("Video is timeupdate");
        let currentTime = event.detail.plyr.currentTime;
        const duration = event.detail.plyr.duration;

        // Thời gian hiện tại gần cuối video (1 giây trước khi kết thúc)
        if (duration && duration - currentTime < 1) {
          console.log("Video đã xem xong");
          // Thực hiện các tác vụ khi video kết thúc hoặc đã xem xong
          localStorage.removeItem(`${movie?._id}`);
        }

        // currTime > 0 và khi video chưa kết thúc thì set localStorage time update
        if (
          currentTime &&
          currentTime > 0 &&
          duration &&
          duration - currentTime > 1
        ) {
          console.log("sett", {
            currentTime: currentTime,
            videoId: movie._id,
          });

          localStorage.setItem(
            `${movie?._id}`,
            JSON.stringify({
              currentTime: currentTime,
              videoId: movie._id,
            })
          );
          // localStorage.setItem(
          //   `${movie?._id}`,
          //   encryptData(
          //     JSON.stringify({
          //       currentTime: currentTime,
          //       videoId: movie._id,
          //     }),
          //     secretKey
          //   )
          // );
        }
      });
    }
  };

  useEffect(() => {
    setupPlyr();

    // Xóa sự kiện và Plyr instance khi unmount
    return () => {
      if (playerInstance) {
        console.log("playerInstance", playerInstance);
        playerInstance.destroy();
        window.location.reload();
      }
    };
  }, [movie, movie._id, nameFilm]);

  // const plyrSources = movie.sources?.map((video, index) => ({
  //   src: `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/video/${video.srcVideo}?specificFolder=${movie.folderOnFirebase}`,
  //   type: video.typeVideo,
  //   size: video.sizeVideo,
  // }));

  const tagSources = movie.sources?.map((video, index) => (
    <source
      key={index}
      src={`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/video/${video.srcVideo}?specificFolder=${movie.folderOnFirebase}`}
      type="video/mp4"
      size={video.sizeVideo}
    />
  ));
  // console.log(tagSources);

  const tagTracks = movie.subtitles?.map((subtitle, index) => (
    <track
      key={index}
      kind="captions"
      label={`${subtitle.langSubtitle} captions`}
      src={`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/subtitles/${subtitle.subtitle}?specificFolder=${movie.folderOnFirebase}`}
      srcLang={subtitle.langSubtitle}
      default={index === 0}
    />
  ));
  console.log(tagTracks);

  return (
    <div className="players-container relative">
      {movie && (
        <video
          // key={movie?._id}
          id="myPlyr"
          ref={refVideo}
          crossOrigin="true"
          playsInline
          preload="auto"
          controls
          style={{ "--plyr-captions-background": "rgba(0, 0, 0, 0.1)" }}
        >
          {tagSources}
          {tagTracks}
        </video>
      )}
    </div>
  );
};

export default VideoContainer;
