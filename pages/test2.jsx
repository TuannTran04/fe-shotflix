// import React, { useState } from "react";
// import { useEffect } from "react";
// import { Navigation } from "react-minimal-side-navigation";
// import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
// import Plyr from "plyr";
// import { useRef } from "react";
// import ReactPlayer from "react-player";
// import axios from "axios";
// import JWPlayer from "@jwplayer/jwplayer-react";

// const Test = () => {
//   const refVideo = useRef();

//   const specificFolder = "riengminhanh-426x240_2023-9-8_11:37:41";

//   const [movie, setMovie] = useState({});
//   useEffect(() => {
//     const renderSingleMovie = async () => {
//       try {
//         let res = await axios.get(
//           `${process.env.NEXT_PUBLIC_URL}/api/v1/movie/user/test-sub-and-quality`
//         );
//         // console.log(">>> Results Search <<<", res);
//         if (res.data.code === 200) {
//           console.log(">>> Results Search <<<", res.data.data.movieSingle[0]);
//           setMovie(res.data.data.movieSingle[0]);
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     };
//     renderSingleMovie();
//   }, []);

//   let plyrTracks;
//   let plyrSources;
//   useEffect(() => {
//     const setupPlyrWithSubtitles = async () => {
//       console.log("movie", movie);

//       if (Object.keys(movie).length > 0) {
//         // plyrSources = movie.sources?.map((video, index) => ({
//         //   // src: `${process.env.NEXT_PUBLIC_URL}/video/${video.srcVideo}?specificFolder=${specificFolder}`,
//         //   src: `${process.env.NEXT_PUBLIC_URL}/video/neudanhmatem.mp4?specificFolder=neudanhmatem_2023-9-6_22:36:28`,
//         //   type: video.typeVideo,
//         //   size: video.sizeVideo,
//         // }));
//         // console.log("plyrSources", plyrSources);

//         plyrTracks = movie.subtitles?.map((sub, index) => ({
//           kind: "captions",
//           label: `${sub.langSubtitle} captions`,
//           srcLang: sub.langSubtitle,
//           src: `${process.env.NEXT_PUBLIC_URL}/subtitles/${sub.subtitle}?specificFolder=${specificFolder}`,
//           default: index === 0, // Đánh dấu phụ đề đầu tiên là mặc định
//         }));
//         console.log("plyrTracks", plyrTracks);

//         plyrSources = movie.sources?.map((video, index) => ({
//           src: `${process.env.NEXT_PUBLIC_URL}/video/${video.srcVideo}?specificFolder=${movie.folderOnFirebase}`,
//           type: video.typeVideo,
//           size: video.sizeVideo,
//         }));
//         console.log("plyrSources", plyrSources);

//         const playlist = [
//           {
//             file: "myfile.mp4",
//             // image: "myPoster.jpg",
//             sources: plyrSources,
//             tracks: plyrTracks,
//           },
//         ];
//       }
//     };

//     setupPlyrWithSubtitles();
//   }, [movie]);

//   const playlist = [
//     {
//       file: "myfile.mp4",
//       // image: "myPoster.jpg",
//       sources: [
//         {
//           file: "https://cdn.jwplayer.com/videos/1g8jjku3-Zq6530MP.mp4",
//           type: "video/mp4",
//           height: 180,
//           width: 320,
//           label: "H.264 320px",
//           bitrate: 304640,
//           filesize: 1220355,
//           framerate: 25.0,
//         },
//         {
//           file: "https://cdn.jwplayer.com/videos/1g8jjku3-TNpruJId.mp4",
//           type: "video/mp4",
//           height: 270,
//           width: 480,
//           label: "H.264 480px",
//           bitrate: 421800,
//           filesize: 1689694,
//           framerate: 25.0,
//         },
//       ],
//       tracks: [
//         {
//           file: "https://cdn.jwplayer.com/tracks/Up7DJauf.vtt",
//           kind: "captions",
//           label: "big-buck.vtt",
//         },
//         {
//           file: "https://cdn.jwplayer.com/strips/1g8jjku3-120.vtt",
//           kind: "thumbnails",
//         },
//       ],
//     },
//   ];

//   return (
//     <div className="players-container mx-auto h-[200px] w-[800px]">
//       <JWPlayer
//         library="https://path-to-my-jwplayer-library.js"
//         width="100%"
//         height="100%"
//         playlist={playlist}
//         // url={plyrSources}
//         // light={
//         //   <img
//         //     src="https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/many_img%2Ftattay.jpg%20%20%20%20%20%20%202023-8-26%2014%3A18%3A27?alt=media&token=a2094971-d540-435c-ab57-669663a57695"
//         //     alt="Thumbnail"
//         //   />
//         // }
//         controls
//         // config={{
//         //   file: {
//         //     attributes: {
//         //       crossOrigin: "true",
//         //       controlsList: "nodownload", // Loại bỏ nút tải xuống
//         //       preload: "metadata", // Tải metadata trước để lấy thông tin chất lượng
//         //     },
//         //     tracks: plyrTracks, // Loại bỏ phụ đề
//         //   },
//         // }}
//       />
//     </div>
//   );
// };

// export default Test;
