import React, { memo, useEffect, useRef } from "react";
import { useState } from "react";
import ReactJWPlayer from "react-jw-player";
import JWPlayer from "@jwplayer/jwplayer-react";
import ReactPlayer from "react-player";
import axios from "axios";
import Plyr from "plyr";
import { useRouter } from "next/router";

const VideoContainer = ({ movie }) => {
  const router = useRouter();
  const refVideo = useRef();
  const [showPopupTracking, setShowPopupTracking] = useState(false);
  let player = useRef(null);

  const [videoState, setVideoState] = useState({
    videoId: movie?._id || "myvideoid",
    currentTime:
      JSON.parse(localStorage.getItem(`${movie?._id}`))?.currentTime || 0,
  });
  // console.log(videoState);

  // Khi video bắt đầu phát
  // const handleVideoPlay = () => {
  //   console.log("handle Play");
  //   if (movie?._id) {
  //     localStorage.setItem(`${movie?._id}`, JSON.stringify(videoState));
  //   }
  // };

  // // kHi video playing
  // const handleVideoTimeUpdate = (currentTime, duration) => {
  //   const newVideoState = {
  //     ...videoState,
  //     currentTime: currentTime,
  //     videoId: movie._id,
  //   };
  //   console.log("newVideoState", newVideoState);
  //   setVideoState(newVideoState);
  //   // console.log("handleVideoTimeUpdate", duration);

  //   // Thời gian hiện tại gần cuối video (1 giây trước khi kết thúc)
  //   if (duration && duration - currentTime < 1) {
  //     console.log("Video đã xem xong");
  //     // Thực hiện các tác vụ khi video kết thúc hoặc đã xem xong
  //     if (movie?._id) {
  //       localStorage.removeItem(`${movie?._id}`);
  //     }
  //   }

  //   // if (movie?._id) {
  //   //   localStorage.setItem(`${movie?._id}`, JSON.stringify(newVideoState));
  //   // }
  // };

  // // Khi video đã ss
  // const handleVideoReady = () => {
  //   console.log("handle video ready");
  // };

  // // Khi video đã hoàn thành
  // const handleVideoEnded = () => {
  //   // Xóa dữ liệu trạng thái video khỏi Local Storage
  //   if (movie?._id) {
  //     localStorage.removeItem(`${movie?._id}`);
  //   }
  // };

  useEffect(() => {
    const setupPlyr = () => {
      // Chuyển đổi dữ liệu phụ đề thành định dạng Plyr
      if (Object.keys(movie).length > 0) {
        const plyrTracks = movie.subtitles?.map((subtitle, index) => ({
          kind: "captions",
          label: `${subtitle.langSubtitle} captions`,
          srcLang: subtitle.langSubtitle,
          src: `${process.env.NEXT_PUBLIC_URL}/subtitles/${subtitle.subtitle}?specificFolder=${movie.folderOnFirebase}`,
          default: index === 0, // Đánh dấu phụ đề đầu tiên là mặc định
        }));
        // console.log("plyrTracks", plyrTracks);

        const plyrSources = movie.sources?.map((video, index) => ({
          src: `${process.env.NEXT_PUBLIC_URL}/video/${video.srcVideo}?specificFolder=${movie.folderOnFirebase}`,
          type: video.typeVideo,
          size: video.sizeVideo,
        }));
        // console.log("plyrSources", plyrSources);

        // Khởi tạo Ply
        if (refVideo.current) {
          player.current = new Plyr(refVideo.current, {
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
              default: 576,
              options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
            },
            captions: { active: true, language: "vn", update: true },
            tooltips: { controls: true, seek: true },
            keyboard: { focused: true, global: true },
            markers: {
              enabled: true,
              points: [{ time: 50, label: "con cec" }],
            },
            disableContextMenu: false,
          });
          // console.log(player.duration);
        }

        // Thiết lập tracks cho Plyr
        player.current.source = {
          type: "video",
          title: "Example title",
          sources: plyrSources,
          poster:
            "https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/files%2Friengminhanh-426x240_2023-9-8_11%3A37%3A41%2Ftattay.jpg?alt=media&token=bf80ba35-fb61-40f6-9910-00402f79183e",
          tracks: plyrTracks,
        };

        // Đặt sự kiện cho Plyr khi video được play
        // player.on("play", () => {
        //   console.log("Video is playing");
        //   player.muted = false;
        //   // handleVideoPlay();
        // });

        // Đặt sự kiện cho Plyr khi video load xong các data
        if (player.current.playing == false) {
          player.current.on("loadedmetadata", (event) => {
            console.log("readyyyy start");
            // console.log(event.detail.plyr);
            console.log(event.detail.plyr.duration);
            // Kiểm tra nếu có trạng thái xem video trong Local Storage
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
        player.current.on("timeupdate", (event) => {
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
          }
        });
      }
    };
    setupPlyr();

    return () => {
      console.log("CLEAN");
      if (player.current && movie) {
        console.log("destroy");
        player.source = "";
        player.current.destroy();
      }
    };
  }, [movie]);

  // useEffect(() => {
  //   window.addEventListener("beforeunload", (event) => {
  //     console.log("desstroyyyy 2");
  //     player.source = "";
  //     player.current.destroy();
  //   });
  //   return () => {
  //     console.log("CLEAN");
  //     if (player.current && movie) {
  //       console.log("destroy");

  //       player.current.destroy();
  //     }
  //   };
  // }, [movie]);

  return (
    <div className="players-container relative">
      <video
        ref={refVideo}
        crossOrigin="true"
        playsInline
        controls
        style={{ "--plyr-captions-background": "rgba(0, 0, 0, 0.1)" }}
      ></video>

      {/* {false && (
        <div className="absolute inset-x-0 inset-y-0 bg-[rgba(0,0,0,.5)]">
          <div className="w-[400px] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-white">
            <div className="px-[10px] py-[5px] flex items-center justify-between bg-yellow-400">
              <h2 className=" text-[#333] text-[20px] font-semibold">
                Thông báo
              </h2>
              <i
                className="fa-solid fa-xmark cursor-pointer"
                onClick={() => setShowPopup(false)}
              ></i>
            </div>
            <div className="px-[15px] py-[20px] overflow-hidden bg-[rgba(255,255,255,.98)]">
              <div className="pl-[10px]">
                <p className="text-[16px]">
                  ShotFlix ghi nhận bạn đang xem dở bộ phim này!
                </p>
                <p className="text-[16px]">Bạn có muốn xem tiếp không?</p>
              </div>
            </div>
            <div className="p-[6px] flex items-center justify-center">
              <button className="inline-block mr-[10px] px-[8px] py-[14px] text-[14px] text-white bg-[#29B87E] border-[#29B87E] rounded cursor-pointer hover:opacity-70">
                Có, tiếp tục xem
              </button>
              <button className="inline-block mr-[10px] px-[8px] py-[14px] text-[14px] text-white bg-[#0760B3] border-[#0760B3] rounded cursor-pointer hover:opacity-70">
                Không, xem từ đầu
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default memo(VideoContainer);
{
  /* <ReactPlayer
        url={`${movie?.video?.[0]}`}
        // light={
        //   <img
        //     src="https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/many_img%2Ftattay.jpg%20%20%20%20%20%20%202023-8-26%2014%3A18%3A27?alt=media&token=a2094971-d540-435c-ab57-669663a57695"
        //     alt="Thumbnail"
        //   />
        // }
        controls
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
          },
        }}
      /> */
}
