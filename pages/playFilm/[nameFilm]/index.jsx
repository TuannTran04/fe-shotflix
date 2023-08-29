import LayoutRoot from "@/components/Layout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SidebarContentFilm from "../../../components/SidebarContentFilm";
import Image from "next/legacy/image";
import CommentFilm from "../../../components/CommentFilm";
import SliderRelatedFilm from "../../../components/SliderRelatedFilm";
import ReactJWPlayer from "react-jw-player";
import JWPlayer from "@jwplayer/jwplayer-react";
// import { arrDetailInfoFilm } from "./constant";
import ReactStars from "react-stars";
import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";

const arrDetailInfoFilm = [
  { id: 1, name: "Type", text: ["Movie"] },
  { id: 2, name: "Genre", text: ["Animation", "Comedy", "Adventure"] },
  { id: 3, name: "Release", text: "Jun 16, 2023" },
  { id: 4, name: "Director", text: ["Peter", " John"] },
  { id: 5, name: "Production", text: ["Disney", "Pixar"] },
  { id: 6, name: "Cast", text: ["Lewis", "Athie", "Carmen"] },
];
// const TIME_UPDATE_VIEW = 900000
const TIME_UPDATE_VIEW = 900000
const playFilmPage = ({ nameFilm }) => {

	useEffect(()=>{
		const timerId = setInterval(()=>{
			fetch(`${process.env.NEXT_PUBLIC_URL}/api/v1/movie/update-views`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: '64ea009f4eb98d2906f135b2' })
    })
			  .then(response => response.json())
			  .then(json => console.log(json))
		},TIME_UPDATE_VIEW)
		// after 15mins -> call api
		return ()=>{
			clearInterval(timerId)
		}
	},[])
  const user = useSelector((state) => state.auth.login.currentUser);
  // console.log(">>> Header <<<", user);
  // const accessToken = user?.accessToken;
  // const id = user?._id;
  // console.log(nameFilm);
  // const searchParams = useSearchParams();
  // const userName = searchParams.get("test");
  // console.log(userName);

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

  const ratingChanged = (newRating) => {
    console.log(newRating);
  };

  return (
    <LayoutRoot>
      <div className="mt-16 ">
        <div className=" mb-8 ">
          {/* Breadcrumb */}
          <nav className="flex p-2.5" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-white hover:text-[#da966e]"
                >
                  <svg
                    className="w-3 h-3 mr-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <Link
                    href="/"
                    className="ml-1 text-sm font-medium text-white hover:text-[#da966e] md:ml-2"
                  >
                    Thể loại
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    Xem phim {nameFilm.replace(/-/g, " ")}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-7 gap-4">
          {/* LEFT */}
          <div className="col-span-5">
            <div className="p-2.5 bg-[#2D2D2D]">
              {/* SECTION INFO FILM */}
              <div className="overflow-hidden">
                {/* SECTION VIDEO FILM */}
                {/* <div className="player-loaded overflow-hidden ">
                  <div
                    className="jw-video-container"
                    data-mediaid="TAITbudl"
                    style={{ height: "100%", width: "100%" }}
                  >
                    <ReactJWPlayer
                      className=""
                      playerId="TAITbudl"
                      playerScript="https://content.jwplatform.com/libraries/j9BLvpMc.js"
                      // playlist="https://cdn.jwplayer.com/v2/media/TAITbudl"
                      file="/neudanhmatem.mp4"
                      // playlist={playlist}
                      // onReady={onReady}
                      aspectRatio="16:9"
                    />
                  </div>
                </div> */}

                <div className="players-container">
                  {/* <JWPlayer
                    library="https://content.jwplatform.com/libraries/j9BLvpMc.js"
                    //   playlist='https://cdn.jwplayer.com/v2/playlists/B8FTSH9D'
                    // playlist={playlistt}
                    // playlist={
                    //   "https://cdn.jwplayer.com/v2/playlists/B8FTSH9D?fbclid=IwAR0j_kzxOGd1oB0pr4Go-MxsNfzI4KYQOlGPYgRKEkt_O5UZvKsK2CY7GM4"
                    // }
                    playlist={
                      "https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/files%2FB%C3%A1%C2%BA%C2%A3n%20in%20l%C3%A1%C2%BB%C2%97i.mp4%20%20%20%20%20%20%202023-8-16%2022%3A53%3A35?alt=media&token=f6bd78f4-3f03-40c8-a4f8-5ec41902866d"
                    }
                  /> */}

                  <ReactPlayer
                    // url={"https://youtu.be/DWYwmTdXpqw?si=yAfzJl4ilB-Y0fWd"}
                    url={
                      "https://firebasestorage.googleapis.com/v0/b/movie-the-stone-d9f38.appspot.com/o/files%2FB%C3%A1%C2%BA%C2%A3n%20in%20l%C3%A1%C2%BB%C2%97i.mp4%20%20%20%20%20%20%202023-8-16%2022%3A53%3A35?alt=media&token=f6bd78f4-3f03-40c8-a4f8-5ec41902866d"
                    }
                    controls
                    className=""
                  />
                </div>
              </div>

              {/* SECTION COMMENT */}
              <CommentFilm />
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-2">
            <div className=" py-[10px] rounded-md bg-[#1b2d58]">
              <div className="h-full px-[15px]">
                <span className="block w-full">
                  <img
                    className="block w-full h-full"
                    src="https://static.bunnycdn.ru/i/cache/images/f/fa/fad20ae6e3418f3367ae8d023d9855c2.jpg"
                    alt=""
                    // width={55}
                    // height={55}
                    // layout="fill"
                    // priority
                  />
                </span>
              </div>

              <div>
                <h1 className="mx-[15px] mt-[22.5px] text-lg font-semibold text-white">
                  Elemental
                </h1>
                <div className="flex items-center pt-[7.5px] pb-[15px] px-[15px] mb-[15px] border-[1px] border-[#21376c]">
                  <span className="min-w-[20px] px-[3px] bg-[#c7d2ee] text-xs font-medium text-black border-[1px] border-[#c7d2ee]">
                    HD
                  </span>
                  <span className="ml-[6px] px-[3px] text-[#c7d2ee] text-xs font-medium border-[1px] border-[#c7d2ee]">
                    PG
                  </span>
                  <span className="ml-[6px] text-base text-white">109 min</span>
                </div>
                <div className="px-[15px] pb-[15px] border-b-[1px] border-[#21376c]">
                  <p className="text-[15px] text-white">
                    Follows Ember and Wade, in a city where fire-, water-, land-
                    and air-residents live together.
                  </p>
                </div>
                <div className="m-[15px] text-[#c7d2ee]">
                  {arrDetailInfoFilm.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex text-[14px] font-normal ${
                        index >= 1 ? "mt-[5px]" : ""
                      }`}
                    >
                      <div className="min-w-[90px]">{item.name}:</div>
                      <span className="flex-1">
                        {Array.isArray(item.text) ? (
                          item.text.map((subText, i) => (
                            <React.Fragment key={i}>
                              <Link
                                href="#"
                                className="text-[#f1ffff] hover:text-[#e94a68] transition-all duration-150 ease-in-out"
                              >
                                {subText}
                              </Link>
                              {i !== item.text.length - 1 && ", "}
                            </React.Fragment>
                          ))
                        ) : (
                          <p className="">{item.text}</p>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#e94a68] py-[9px] px-[15px] mx-[15px] rounded-[4px] text-center">
                  <span className="flex justify-center items-center">
                    <ReactStars
                      count={5}
                      half={true}
                      value={10}
                      onChange={ratingChanged}
                      size={24}
                      color2={"#ffd700"}
                      edit={user ? true : false}
                    />
                  </span>
                  <div>
                    <span>
                      <b>7.82</b> of <b>10</b> (<span>2754</span> 2,754 reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION RELATED FILM? */}
        <SliderRelatedFilm />
      </div>
    </LayoutRoot>
  );
};

export default playFilmPage;

export async function getServerSideProps({ params }) {
  const nameFilm = params.nameFilm;
  return {
    props: {
      nameFilm,
    },
  };
}

{
  /* <div className="mt-[30px] p-2.5 bg-[#222222]">
                <h3 className="mb-2 text-[#da966e] text-xl font-medium">
                  Nội dung chi tiết
                </h3>
                <div>
                  <h3 className="text-[#ddd] mb-2.5 font-normal text-2xl">
                    {nameFilm.replace(/-/g, " ")}
                  </h3>
                  <p className="text-base text-[#abb7c4]">
                    Từ ngôi sao NBA, Kevin Durant, nhà làm phim Reggie Rock
                    Bythewood và đội ngũ làm phim Friday Night Lights. Bộ phim
                    kể về một thần đồng bóng rổ phải tìm kiếm lối đi trong mê
                    cung đầy rẫy những áp lực để tìm được con đường thành công
                    và học được ý nghĩa thật sự của “ngông nghênh”.
                  </p>
                </div>
              </div> */
}

{
  /* SECTION TRAILER */
}
{
  /* <div className="mt-[30px]">
                <div className="mb-2">
                  <h2 className="text-[#da966e] text-xl font-medium">
                    Official Trailer:
                  </h2>
                </div>
                <iframe
                  className="w-full h-[450px]"
                  src="https://www.youtube-nocookie.com/embed/ilB9h1pfjc8"
                  title="Và Thế Là Hết - Chillies (Original)"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div> */
}
