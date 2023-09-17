import React, { useState } from "react";
import { useEffect } from "react";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import Plyr from "plyr";
import Hls from "hls.js";
import videojs from "video.js";
import { useRef } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

const Test = () => {
  const refVideo = useRef();
  const [playerInstance, setPlayerInstance] = useState(null);
  const [hlsInstance, setHLSInstance] = useState(null);
  console.log(hlsInstance);

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

  // const setupPlyr = async () => {
  //   // Chuyển đổi dữ liệu phụ đề thành định dạng Plyr
  //   if (Object.keys(movie).length > 0) {
  //     const plyrTracks = movie.subtitles?.map((subtitle, index) => ({
  //       kind: "captions",
  //       label: `${subtitle.langSubtitle} captions`,
  //       srcLang: subtitle.langSubtitle,
  //       src: `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/subtitles/${subtitle.subtitle}?specificFolder=${movie.folderOnFirebase}`,
  //       default: index === 0, // Đánh dấu phụ đề đầu tiên là mặc định
  //     }));
  //     // console.log("plyrTracks", plyrTracks);

  //     const plyrSources = movie.sources?.map((video, index) => ({
  //       src: `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/video/${video.srcVideo}?specificFolder=${movie.folderOnFirebase}`,
  //       type: `${video.typeVideo}; codecs="avc1.4D401E, mp4a.40.2"`,
  //       size: video.sizeVideo,
  //     }));

  //     // const plyrSources = movie.sources?.map((video, index) => ({
  //     //   src: `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/master.m3u8?specificFolder=test_hls`,
  //     //   type: "application/x-mpegURL", // Loại video HLS
  //     // }));
  //     // console.log(plyrSources);

  //     // Khởi tạo Ply
  //     let player;
  //     if (true) {
  //       player = new Plyr("#abc", {
  //         title: "Example Title",
  //         controls: [
  //           "play-large",
  //           "restart",
  //           "play",
  //           "fast-forward",
  //           "progress",
  //           "current-time",
  //           "duration",
  //           "mute",
  //           "volume",
  //           "captions",
  //           "settings",
  //           "pip",
  //           "fullscreen",
  //         ],
  //         settings: ["captions", "quality", "speed", "loop"],
  //         fullscreen: {
  //           enabled: true,
  //           fallback: true,
  //           iosNative: true,
  //           container: null,
  //         },
  //         playsinline: true,
  //       });
  //       setPlayerInstance(player);
  //     }

  //     // Thiết lập tracks cho Plyr
  //     player.source = {
  //       type: "video",
  //       title: "Example title",
  //       sources: plyrSources,
  //       poster:
  //         "https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/files%2Friengminhanh-426x240_2023-9-8_11%3A37%3A41%2Ftattay.jpg?alt=media&token=bf80ba35-fb61-40f6-9910-00402f79183e",
  //       // tracks: plyrTracks,
  //     };
  //   }
  // };

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
  var config = {
    autoStartLoad: true,
    startPosition: -1,
    capLevelToPlayerSize: false,
    debug: false,
    defaultAudioCodec: undefined,
    initialLiveManifestSize: 1,
    // maxBufferLength: 30,
    maxBufferLength: 10,
    // maxMaxBufferLength: 600,
    maxMaxBufferLength: 10,
    maxBufferSize: 30 * 1000 * 1000,
    maxBufferHole: 0.5,
    // maxBufferHole: 0.1,
    lowBufferWatchdogPeriod: 0.5,
    highBufferWatchdogPeriod: 3,
    nudgeOffset: 0.1,
    nudgeMaxRetry: 3,
    maxFragLookUpTolerance: 0.2,
    liveSyncDurationCount: 3,
    liveMaxLatencyDurationCount: 10,
    // enableWorker: true,
    enableWorker: false,
    enableSoftwareAES: true,
    manifestLoadingTimeOut: 10000,
    manifestLoadingMaxRetry: 1,
    manifestLoadingRetryDelay: 500,
    manifestLoadingMaxRetryTimeout: 64000,
    startLevel: 0,
    levelLoadingTimeOut: 10000,
    levelLoadingMaxRetry: 4,
    levelLoadingRetryDelay: 500,
    levelLoadingMaxRetryTimeout: 64000,
    fragLoadingTimeOut: 20000,
    fragLoadingMaxRetry: 6,
    fragLoadingRetryDelay: 500,
    fragLoadingMaxRetryTimeout: 64000,
    startFragPrefetch: false,
    appendErrorMaxRetry: 3,
    // loader: customLoader,
    // fLoader: customFragmentLoader,
    // pLoader: customPlaylistLoader,
    // xhrSetup: XMLHttpRequestSetupCallback,
    // fetchSetup: FetchSetupCallback,
    // abrController: customAbrController,
    // timelineController: TimelineController,
    enableWebVTT: true,
    enableCEA708Captions: true,
    stretchShortVideoTrack: false,
    maxAudioFramesDrift: 1,
    forceKeyFrameOnDiscontinuity: true,
    abrEwmaFastLive: 5.0,
    abrEwmaSlowLive: 9.0,
    abrEwmaFastVoD: 4.0,
    abrEwmaSlowVoD: 15.0,
    abrEwmaDefaultEstimate: 500000,
    abrBandWidthFactor: 0.95,
    abrBandWidthUpFactor: 0.7,
    minAutoBitrate: 0,
  };

  const setupPlyrHLS = async () => {
    if (Object.keys(movie).length > 0) {
      console.log(movie);
      let player;
      let hls;
      const defaultOptions = {};
      if (refVideo.current) {
        // console.log("have element video !");

        if (false) {
          hls = new Hls(config);
          // console.log("have element video HLS !");
          hls.attachMedia(refVideo.current);

          // const updateQuality = (newQuality) => {
          //   console.log("newQuality", newQuality);
          //   console.log("hls.levels", hls.levels);
          //   hls.levels.forEach((level, levelIndex) => {
          //     if (level.height === newQuality) {
          //       console.log("Found quality match with " + newQuality);
          //       hls.currentLevel = levelIndex;
          //     }
          //   });
          // };

          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            // console.log("video and hls.js are now bound together !");
            hls.loadSource(
              `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/test_hls/master.m3u8`
            );

            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              console.log(
                "manifest loaded, found " +
                  data.levels.length +
                  " quality level"
              );
              // console.log("hls.subtitleTracks", hls.subtitleTracks);
              const availableQualities = hls.levels.map((l) => l.height);
              console.log(availableQualities);

              hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
                console.log("update track");
                // Lựa chọn phụ đề (subtitle) bằng cách chỉ định GROUP-ID của phụ đề trong manifest
                const selectedSubtitleTrack = hls.subtitleTracks.find(
                  (track) => track.groupId === "subs"
                );
                console.log("selectedSubtitleTrack", selectedSubtitleTrack);
                if (selectedSubtitleTrack) {
                  // Bật phụ đề
                  hls.subtitleTrack = selectedSubtitleTrack.index;
                }
              });

              // // Add new qualities to option
              // defaultOptions.quality = {
              //   default: availableQualities[0],
              //   options: availableQualities,
              //   // this ensures Plyr to use Hls to update quality level
              //   forced: true,
              //   onChange: (e) => updateQuality(e),
              // };

              // hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
              //   console.log("Switched to quality level: " + data.level);
              //   const qualityLevel = data.level;

              //   // Xác định URL của biến thể chất lượng mới dựa trên mức chất lượng (qualityLevel)
              //   // và sau đó gọi hls.loadSource với URL mới để tải chất lượng đó.
              //   const newQualityURL = determineQualityURL(qualityLevel); // Hãy tự định nghĩa hàm này

              //   if (newQualityURL) {
              //     hls.loadSource(newQualityURL);
              //   }
              // });

              // function determineQualityURL(qualityLevel) {
              //   switch (qualityLevel) {
              //     case 0:
              //       return `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/nangtho/v144p/index.m3u8`;
              //     case 1:
              //       return `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/nangtho/v240p/index.m3u8`;
              //     default:
              //       return null;
              //   }
              // }

              // Initialize here
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
                // quality: {
                //   default: 720,
                //   options: [
                //     4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240,
                //   ],
                // },
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
                html5: {
                  vhs: {
                    overrideNative: true,
                  },
                  nativeAudioTracks: false,
                  nativeVideoTracks: false,
                },
                ...defaultOptions,
                // debug: true,
              });
              setPlayerInstance(player);
              setHLSInstance(hls);
              // window.hls = hls;
            });
          });
        } else if (
          // refVideo.current.canPlayType("application/vnd.apple.mpegurl")
          true
        ) {
          // alert("không hỗ trợ");
          if (refVideo.current) {
            // refVideo.current.src = `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/test_hls/master.m3u8`;
            // refVideo.current.src = `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/test_hls/v240p/index.m3u8`;
            // refVideo.current.src = "/neudanhmatem.mp4";

            console.log("dm");
            // Initialize the video.js player
            const player = videojs(refVideo.current, {
              html5: {
                hls: {
                  // Enable HLS support
                  enableLowInitialPlaylist: true, // Tạo hiệu ứng tải từng phần nhỏ
                  overrideNative: true,
                },
              },
              // Tùy chọn để chỉ tải trước một đoạn nhỏ
              autoStartLoad: true, // Tự động tải video khi player được tạo
              lowLatencyMode: true, // Kích hoạt chế độ tải trước đoạn nhỏ
            });
            // Lắng nghe sự kiện loadedmetadata để chờ metadata của video được tải xong
            player.on("loadedmetadata", function () {
              // Lấy thời lượng video
              const videoDuration = player.duration();
              console.log(videoDuration);
              // Giới hạn thời gian đệm tối đa là 10 giây
              const maxBufferTime = 10;

              // Tính toán thời gian cần tải trước
              const preloadTime = Math.min(videoDuration, maxBufferTime);

              // Thiết lập thời gian đệm tối đa
              player.buffered(player.buffered().start(0), preloadTime);
            });
            // Thêm nguồn video
            player.src({
              src: `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/test_hls/v240p/index.m3u8`, // Thay thế bằng URL của video của bạn
              // type: "video/mp4", // Loại video
              type: "application/x-mpegURL", // Loại video
            });
          }
        }
      }
    }
  };

  useEffect(() => {
    console.log("eff");
    setupPlyrHLS();
    // Xóa sự kiện và Plyr instance khi unmount
    return () => {
      if (playerInstance) {
        console.log("playerInstance", playerInstance);
        playerInstance.destroy();
        hlsInstance.destroy();
        // window.location.reload();
      }
    };
  }, [movie]);

  return (
    <div className="players-container mx-auto h-[200px] w-[800px]">
      <video
        className="video-js vjs-default-skin"
        ref={refVideo}
        id="abc"
        playsInline
        crossOrigin="true"
        controls
        height="400"
        width="400"
        src={`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/test_hls/master.m3u8`}
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
