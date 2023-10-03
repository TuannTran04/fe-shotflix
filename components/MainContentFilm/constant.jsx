function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    // <div
    //   className={`${className} z-10`}
    //   style={{
    //     ...style,
    //     display: "absolute",
    //     top: "50%",
    //     right: 0,
    //   }}
    //   onClick={onClick}
    // ></div>
    <button
      className="absolute top-[45%] right-0 text-white z-50 hover:bg-white hover:text-black rounded-md transition-all duration-300"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
    </button>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    // <div
    //   className={`${className} z-10`}
    //   style={{
    //     ...style,
    //     display: "absolute",
    //     top: "50%",
    //     left: 0,
    //   }}
    //   onClick={onClick}
    // />

    <button
      className="absolute top-[45%] left-0 text-white z-50 hover:bg-white hover:text-black rounded-md transition-all duration-300"
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          className="text-xl"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 19.5L8.25 12l7.5-7.5"
        />
      </svg>
    </button>
  );
}

export var settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 1,
  initialSlide: 0,
  autoplay: false,
  speed: 1000,
  autoplaySpeed: 2000,
  swipeToSlide: true,
  // arrows: false,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
        dots: false,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
      },
    },
  ],
};

// export const arrSliderCategory = [
//   {
//     id: 1,
//     title: "Xem gì hôm nay",
//     image: [
//       "https://img.vxdn.net/t-max/w_312/h_468/tulsa-king-season-1-1630854430.webp",
//       "https://phimmoiyyy.net/wp-content/uploads/2023/07/Oppenheimer.jpg",
//       "https://img.vxdn.net/t-max/w_312/h_468/black-panther-wakanda-forever-1630854429.jpg",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2547.jpg",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2610.jpg?id=1382b45",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2579.jpg?id=d96a445",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2548.jpg",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2580.jpg?id=82d87b5",
//     ],
//   },
//   {
//     id: 2,
//     title: "Phim mới nhất",
//     image: [
//       "https://img.vxdn.net/t-max/w_312/h_468/tulsa-king-season-1-1630854430.webp",
//       "https://phimmoiyyy.net/wp-content/uploads/2023/07/Oppenheimer.jpg",
//       "https://img.vxdn.net/t-max/w_312/h_468/black-panther-wakanda-forever-1630854429.jpg",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2547.jpg",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2610.jpg?id=1382b45",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2579.jpg?id=d96a445",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2548.jpg",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2580.jpg?id=82d87b5",
//     ],
//   },
// ];

// export const arrSliderWatchFilmToday = [
//   {
//     id: 1,
//     title: "Phim có rating cao nhất tuần",
//     image: [
//       "https://img.vxdn.net/t-max/w_312/h_468/tulsa-king-season-1-1630854430.webp",
//       "https://phimmoiyyy.net/wp-content/uploads/2023/07/Oppenheimer.jpg",
//       "https://img.vxdn.net/t-max/w_312/h_468/black-panther-wakanda-forever-1630854429.jpg",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2547.jpg",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2610.jpg?id=1382b45",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2579.jpg?id=d96a445",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2548.jpg",
//       "https://bluphim.com/Content/Imgs/Movies/thumb-2580.jpg?id=82d87b5",
//     ],
//   },
// ];
