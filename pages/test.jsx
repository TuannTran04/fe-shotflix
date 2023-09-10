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

  // const specificFolder = "neudanhmatem_2023-9-6_22:36:28";
  const specificFolder = "riengminhanh-426x240_2023-9-8_11:37:41";

  const [sub, setSub] = useState("");
  // console.log(sub);
  // let subUrl = `${process.env.NEXT_PUBLIC_URL}/subtitles/test.vtt`;
  let subUrl = `${process.env.NEXT_PUBLIC_URL}/subtitles/test_2023-9-5_20:6:21.vtt?specificFolder=${specificFolder}`;

  // let player;
  // useEffect(() => {
  //   const savedVideoState = localStorage.getItem("videoPlaybackState");

  //   if (refVideo.current) {
  //     player = new Plyr(refVideo.current, {
  //       title: "Example Title",
  //       controls: [
  //         "play-large", // The large play button in the center
  //         "restart", // Restart playback
  //         "rewind", // Rewind by the seek time (default 10 seconds)
  //         "play", // Play/pause playback
  //         "fast-forward", // Fast forward by the seek time (default 10 seconds)
  //         "progress", // The progress bar and scrubber for playback and buffering
  //         "current-time", // The current time of playback
  //         "duration", // The full duration of the media
  //         "mute", // Toggle mute
  //         "volume", // Volume control
  //         "captions", // Toggle captions
  //         "settings", // Settings menu
  //         "pip", // Picture-in-picture (currently Safari only)
  //         "airplay", // Airplay (currently Safari only)
  //         "fullscreen", // Toggle fullscreen
  //       ],
  //       // settings: ["captions", "quality", "speed", "loop"],
  //       // quality: {
  //       //   default: 576,
  //       //   options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240],
  //       // },
  //     });

  //     player.source = {
  //       type: "video",
  //       title: "Example title",
  //       sources: [
  //         {
  //           // src: `${process.env.NEXT_PUBLIC_URL}/video/neudanhmatem_2023-9-5_15:10:0.mp4?specificFolder=${specificFolder}`,
  //           src: `${process.env.NEXT_PUBLIC_URL}/test-convert-video/neudanhmatem_2023-9-5_15:10:0.mp4?specificFolder=${specificFolder}`,
  //           type: "video/mp4",
  //           size: 720,
  //         },
  //         {
  //           src: "/path/to/movie.webm",
  //           type: "video/webm",
  //           size: 1080,
  //         },
  //       ],
  //       poster:
  //         "https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/many_img%2Ftattay.jpg%20%20%20%20%20%20%202023-8-26%2014%3A18%3A27?alt=media&token=a2094971-d540-435c-ab57-669663a57695",
  //       previewThumbnails: {
  //         src: "/path/to/thumbnails.vtt",
  //       },
  //       tracks: [
  //         {
  //           kind: "captions",
  //           label: "VietNam",
  //           srclang: "vn",
  //           src: `${process.env.NEXT_PUBLIC_URL}/subtitles/test_2023-9-5_20:6:21.vtt?specificFolder=${specificFolder}`,
  //           default: true,
  //         },
  //         {
  //           kind: "captions",
  //           label: "English",
  //           srclang: "en",
  //           src: "/test.vtt",
  //         },
  //       ],
  //     };
  //   }
  // }, []);
  const [movie, setMovie] = useState({});
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

  useEffect(() => {
    const setupPlyrWithSubtitles = async () => {
      console.log("movie", movie);
      // console.log("movie subtitles", movie.subtitles);
      // Lấy dữ liệu phụ đề từ API
      // const subtitlesData = await fetchSubtitlesFromAPI();

      // Chuyển đổi dữ liệu phụ đề thành định dạng Plyr
      let plyrSources;
      let plyrTracks;
      if (Object.keys(movie).length > 0 && refVideo.current) {
        // plyrSources = movie.sources?.map((video, index) => ({
        //   // src: `${process.env.NEXT_PUBLIC_URL}/video/${video.srcVideo}?specificFolder=${specificFolder}`,
        //   src: `${process.env.NEXT_PUBLIC_URL}/video/neudanhmatem.mp4?specificFolder=neudanhmatem_2023-9-6_22:36:28`,
        //   type: video.typeVideo,
        //   size: video.sizeVideo,
        // }));
        // console.log("plyrSources", plyrSources);

        plyrTracks = movie.subtitles?.map((sub, index) => ({
          kind: "captions",
          label: `${sub.langSubtitle} captions`,
          srcLang: sub.langSubtitle,
          src: `${process.env.NEXT_PUBLIC_URL}/subtitles/${sub.subtitle}?specificFolder=${specificFolder}`,
          default: index === 0, // Đánh dấu phụ đề đầu tiên là mặc định
        }));
        console.log("plyrTracks", plyrTracks);

        // Khởi tạo Plyr
        const player = new Plyr(refVideo.current, {
          settings: ["captions", "quality", "speed", "loop"],
          captions: { active: true, update: true }, // Thiết lập hiển thị phụ đề
        });

        // Thiết lập tracks cho Plyr
        player.source = {
          type: "video",
          sources: [
            {
              // src: `${process.env.NEXT_PUBLIC_URL}/video/${video.srcVideo}?specificFolder=${specificFolder}`,
              src: `${process.env.NEXT_PUBLIC_URL}/video/neudanhmatem.mp4?specificFolder=neudanhmatem_2023-9-6_22:36:28`,
              type: "video/mp4",
              size: 720,
            },
          ],
          tracks: plyrTracks,
        };

        if (player) {
          player.once("canplay", () => {
            console.log("savedPlaybackTime canplay");
            const setPlayerCurrentTime = (currentTime) => {
              setTimeout(() => {
                player.muted = true;
                player.currentTime = currentTime;
                player.play();
              }, 2000);
            };
            setPlayerCurrentTime(300);
          });
        }
      }
    };

    setupPlyrWithSubtitles();
  });

  return (
    <div className="players-container mx-auto h-[200px] w-[800px]">
      <video
        className=""
        ref={refVideo}
        id={"abc"}
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
