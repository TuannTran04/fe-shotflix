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
        type: `${video.typeVideo}; codecs="avc1.4D401E, mp4a.40.2"`,
        size: video.sizeVideo,
      }));
      console.log("plyrSources", plyrSources);

      // Khởi tạo Ply
      let player;
      if (true) {
        player = new Plyr("#abc", {
          title: "Example Title",
          controls: [
            "play-large", // The large play button in the center
            "restart", // Restart playback
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
            "fullscreen", // Toggle fullscreen
          ],
          settings: ["captions", "quality", "speed", "loop"],
          fullscreen: {
            enabled: true,
            fallback: true,
            iosNative: true,
            container: null,
          },
          playsinline: true,
        });
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
  console.log("cc");
  return (
    <div className="players-container mx-auto h-[200px] w-[800px]">
      <video
        ref={refVideo}
        id="abc"
        crossOrigin="true"
        playsInline
        playsinline
        controls
      >
        {movie && (
          <source
            src={`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/video/${movie.sources?.[0].srcVideo}?specificFolder=${movie.folderOnFirebase}`}
            type="video/mp4"
          ></source>
        )}
      </video>
    </div>
  );
};

export default Test;

{
  /* <ReactPlayer
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
      </div> */
}
