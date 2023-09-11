import React, { useState } from "react";
import { useEffect } from "react";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import Plyr from "plyr";
import { useRef } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

const Test = () => {
  const refVideo = useRef();
  const [playerInstance, setPlayerInstance] = useState(null);

  // const specificFolder = "neudanhmatem_2023-9-6_22:36:28";
  const specificFolder = "riengminhanh-426x240_2023-9-8_11:37:41";

  const [movie, setMovie] = useState({});
  console.log(movie);

  useEffect(() => {
    const renderSingleMovie = async () => {
      try {
        let res = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/user/test-sub-and-quality`
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
  }, []);

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
      if (true) {
        player = new Plyr("#abc", {
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
      player.source = {
        type: "video",
        title: "Example title",
        sources: plyrSources,
        poster:
          "https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/files%2Friengminhanh-426x240_2023-9-8_11%3A37%3A41%2Ftattay.jpg?alt=media&token=bf80ba35-fb61-40f6-9910-00402f79183e",
        tracks: plyrTracks,
      };

      // Đặt sự kiện cho Plyr khi video load xong các data
      if (player.playing == false) {
        player.on("loadedmetadata", (event) => {
          console.log("readyyyy start");
          // console.log(event.detail.plyr);
          console.log(event.detail.plyr.duration);

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
  }, [movie]);

  return (
    <div className="players-container mx-auto h-[200px] w-[800px]">
      <video
        className=""
        ref={refVideo}
        id="abc"
        crossOrigin="true"
        playsInline
        controls
      ></video>

      {/* <ReactPlayer
        url={`${process.env.NEXT_PUBLIC_URL}/test-convert-video/https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/files%2Fneudanhmatem_2023-9-6_19%3A43%3A57%2Fneudanhmatem_2023-9-6_19%3A43%3A57.mp4?alt=media&token=985428aa-404f-4729-b06b-b2070f0e3b9b&quality=${selectedQuality}`}
        controls
        width="100%"
        height="auto"
      />
      <div>
        Chọn chất lượng:
        <select value={selectedQuality} onChange={handleQualityChange}>
          {qualityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div> */}
    </div>
  );
};

export default Test;
