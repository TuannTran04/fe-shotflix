import React, { useState } from "react";
import { useEffect } from "react";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import Plyr from "plyr";
import { useRef } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import shaka from "shaka-player";

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

  // useEffect(() => {
  //   setupPlyr();
  //   // Xóa sự kiện và Plyr instance khi unmount
  //   return () => {
  //     if (playerInstance) {
  //       console.log("playerInstance", playerInstance);
  //       playerInstance.destroy();
  //       window.location.reload();
  //     }
  //   };
  // }, [movie]);

  function initApp() {
    // Install built-in polyfills to patch browser incompatibilities.
    shaka.polyfill.installAll();

    // Check to see if the browser supports the basic APIs Shaka needs.
    if (shaka.Player.isBrowserSupported()) {
      // Everything looks good!
      initPlayer();
    } else {
      // This browser does not have the minimum set of APIs we need.
      console.error("Browser not supported!");
    }
  }

  async function initPlayer() {
    console.log("test shaka");
    // Create a Player instance.
    // const video = document.getElementById("video");
    const player = new shaka.Player(refVideo.current);

    // Attach player to the window to make it easy to access in the JS console.
    window.player = player;

    // Listen for error events.
    player.addEventListener("error", onErrorEvent);

    // Try to load a manifest.
    // This is an asynchronous process.
    try {
      await player.load(
        `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/video/nangamxadan_mp4.mp4?specificFolder=${movie.folderOnFirebase}`
      );
      // This runs if the asynchronous load is successful.
      console.log("The video has now been loaded!");
    } catch (e) {
      // onError is executed if the asynchronous load fails.
      onError(e);
    }
  }

  function onErrorEvent(event) {
    // Extract the shaka.util.Error object from the event.
    onError(event.detail);
  }

  function onError(error) {
    // Log the error.
    console.error("Error code", error.code, "object", error);
  }

  // document.addEventListener("DOMContentLoaded", initApp);

  useEffect(() => {
    if (movie) {
      initApp();
    }
    // Xóa sự kiện và Plyr instance khi unmount
  }, [movie]);

  return (
    <div className="players-container mx-auto h-[200px] w-[800px]">
      <video
        ref={refVideo}
        id="abc"
        playsInline
        crossOrigin="true"
        controls
        height="400"
        width="400"
      ></video>

      {/* {Object.keys(movie).length > 0 && (
        <>
          <ReactPlayer
            url={`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/video/nangamxadan.mp4?specificFolder=${movie.folderOnFirebase}`}
            controls
            width="100%"
            height="auto"
          />
          <ReactPlayer
            url={`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/video/nangtho.mp4?specificFolder=${movie.folderOnFirebase}`}
            controls
            width="100%"
            height="auto"
          />
        </>
      )} */}
    </div>
  );
};

export default Test;
