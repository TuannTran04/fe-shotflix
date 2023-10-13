import React, { memo, useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import Hls from "hls.js";

import { useRouter } from "next/router";
const CryptoJS = require("crypto-js");

const VideoContainer = ({ movie, nameFilm }) => {
  const router = useRouter();
  // console.log(router);
  const refVideo = useRef();
  // let player = useRef(null);
  // const [playerInstance, setPlayerInstance] = useState(null);
  // console.log(">>> player <<<", playerInstance);
  // const [hlsInstance, setHLSInstance] = useState(null);
  let player = null;
  let hls = null;

  var config = {
    autoStartLoad: true,
    startPosition: -1,
    capLevelToPlayerSize: false,
    debug: false,
    defaultAudioCodec: undefined,
    initialLiveManifestSize: 1,
    // maxBufferLength: 30,
    maxBufferLength: 11,
    // maxMaxBufferLength: 600,
    maxMaxBufferLength: 11,
    // maxBufferSize: 60 * 1000 * 1000,
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

  const setupPlyr = () => {
    // Chuyển đổi dữ liệu phụ đề thành định dạng Plyr
    if (Object.keys(movie).length > 0) {
      // console.log(movie);
      // let player;
      // let hls;
      const defaultOptions = {};
      // console.log(movie.video?.[0]);
      if (refVideo.current) {
        // console.log("have element video !");

        // Hls.isSupported()
        if (Hls.isSupported()) {
          // console.log("Hls.isSupported", Hls.isSupported);
          hls = new Hls(config);
          // console.log("have element video HLS !");

          hls.attachMedia(refVideo.current);

          hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            // console.log("video and hls.js are now bound together !");

            // refVideo.current.src = `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/JustaTee/bangkhuang.m3u8`;

            hls.loadSource(
              `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/${
                movie.folderOnFirebase
              }/${movie.video?.[0].trim()}`
            );

            // hls.loadSource(
            //   `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/test_hls/master.m3u8`
            // );

            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
              // console.log(
              //   "manifest loaded, found " +
              //     data.levels.length +
              //     " quality level"
              // );

              const availableQualities = hls.levels.map((l) => l.height);
              // console.log(availableQualities);

              hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
                // console.log("update track");
                // Lựa chọn phụ đề (subtitle) bằng cách chỉ định GROUP-ID của phụ đề trong manifest
                const selectedSubtitleTrack = hls.subtitleTracks.find(
                  (track) => track.groupId === "subs"
                );
                // console.log("selectedSubtitleTrack", selectedSubtitleTrack);
                if (selectedSubtitleTrack) {
                  // Bật phụ đề
                  hls.subtitleTrack = selectedSubtitleTrack.index;
                }
              });

              // Initialize PLYR here
              player = new Plyr(refVideo.current, {
                title: "Example Title",
                controls: [
                  "play-large",
                  // "restart",
                  "rewind",
                  "play",
                  "fast-forward",
                  "progress",
                  "current-time",
                  "duration",
                  "mute",
                  "volume",
                  "captions",
                  "settings",
                  "pip",
                  "airplay",
                  "fullscreen",
                ],
                settings: ["captions", "quality", "speed", "loop"],
                captions: { active: true, language: "vi", update: true },
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
                ...defaultOptions,
                // debug: true,
              });

              /////////////////////////////
              // setPlayerInstance(player);
              // setHLSInstance(hls);
              /////////////////////////////

              // Đặt sự kiện cho Plyr khi video load xong các data
              if (player.playing == false) {
                player.on("loadedmetadata", (event) => {
                  // console.log("readyyyy start");
                  // console.log(event.detail.plyr);
                  // console.log(event.detail.plyr.duration);
                  // Kiểm tra nếu có trạng thái xem video trong Local Storage
                  // const savedPlaybackTime = JSON.parse(
                  //   decryptData(localStorage.getItem(`${movie?._id}`), secretKey)
                  // );

                  const savedPlaybackTime = JSON.parse(
                    localStorage.getItem(`${movie?._id}`)
                  );
                  // console.log(savedPlaybackTime);
                  const currTimeLocal = savedPlaybackTime?.currentTime;
                  const videoIdLocal = savedPlaybackTime?.videoId;

                  if (videoIdLocal == movie._id && event.detail.plyr.duration) {
                    console.log("savedPlaybackTime canplay");

                    const setPlayerCurrentTime = (currentTime) => {
                      setTimeout(() => {
                        const minutes = Math.floor(currentTime / 60);
                        const seconds = Math.round(currentTime % 60);
                        if (true) {
                          // console.log(player.current);
                          // console.log("continue");
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
                // console.log("Video is timeupdate");
                let currentTime = event.detail.plyr.currentTime;
                const duration = event.detail.plyr.duration;

                // Thời gian hiện tại gần cuối video (1 giây trước khi kết thúc)
                if (duration && duration - currentTime < 1) {
                  // console.log("Video đã xem xong");
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
                  // console.log("sett", {
                  //   currentTime: currentTime,
                  //   videoId: movie._id,
                  // });

                  localStorage.setItem(
                    `${movie?._id}`,
                    JSON.stringify({
                      currentTime: currentTime,
                      videoId: movie._id,
                    })
                  );
                }
              });
            });
          });
        } else if (
          refVideo.current.canPlayType("application/vnd.apple.mpegurl")
          // true
        ) {
          if (refVideo.current) {
            alert("khong sp");
            // refVideo.current.src = `/neudanhmatem.mp4`;
            // refVideo.current.src = `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/JustaTee/bangkhuang.m3u8`;

            refVideo.current.src = `${
              process.env.NEXT_PUBLIC_URL
            }/api/v1/movie/videoHLS/${
              movie.folderOnFirebase
            }/${movie.video?.[0].trim()}`;
            // refVideo.current.src = `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/chamvaomay_hongson/master.m3u8`;
            refVideo.current.type = "application/x-mpegURL";
            // refVideo.current.addEventListener("loadedmetadata", function () {
            //   refVideo.current.play();
            // });
          }
        }
      }
    }
  };

  useEffect(() => {
    setupPlyr();

    // Xóa sự kiện và Plyr instance khi unmount
    return () => {
      if (player) {
        player.destroy();
        window.location.reload();
      }
      if (hls) {
        hls.destroy();
      }
      // if (playerInstance) {
      //   // console.log("playerInstance", playerInstance);
      //   console.log("destroyyyyyyyyyyyyyyyy playerInstance");
      //   playerInstance.destroy();
      // }
      // if (hlsInstance) {
      //   console.log("destroyyyyyyyyyyyyyyyy hls");
      //   hlsInstance.destroy();
      // }
      // window.location.reload();
    };
  }, [movie, movie._id, nameFilm, refVideo.current]);

  // const tagSources = movie.sources?.map((video, index) => (
  //   <source
  //     key={index}
  //     // src={`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/video/${video.srcVideo}?specificFolder=${movie.folderOnFirebase}`}
  //     src={`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/videoHLS/JustaTee/bangkhuang.m3u8`}
  //     type={video.type}
  //     size={video.sizeVideo}
  //   />
  // ));
  // // console.log(tagSources);

  // const tagTracks = movie.subtitles?.map((subtitle, index) => (
  //   <track
  //     key={index}
  //     kind="captions"
  //     label={`${subtitle.langSubtitle} captions`}
  //     src={`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/subtitles/${subtitle.subtitle}?specificFolder=${movie.folderOnFirebase}`}
  //     srcLang={subtitle.langSubtitle}
  //     default={index === 0}
  //   />
  // ));
  // console.log(tagTracks);

  return (
    <div className="players-container relative">
      {movie && (
        <video
          // key={movie?._id}
          id="myPlyr"
          ref={refVideo}
          crossOrigin="true"
          playsInline
          preload="none"
          controls
          style={{ "--plyr-captions-background": "rgba(0, 0, 0, 0.1)" }}
        >
          {/* {tagSources} */}
          {/* {tagTracks} */}
        </video>
      )}
    </div>
  );
};

export default VideoContainer;
