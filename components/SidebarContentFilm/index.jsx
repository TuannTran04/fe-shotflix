import Link from "next/link";
import { arrDetailInfoFilm, arrTopTrendingFilm } from "./constant";
import Image from "next/legacy/image";
import React from "react";

const SidebarContentFilm = ({ movies }) => {
  // console.log("sidebar", movies);

  const arrTopTrendingFilm = [
    {
      id: 1,
      title: "Phim đạt giải thưởng",
      listFilm: movies,
    },
  ];

  return (
    <>
      {arrTopTrendingFilm.map((item) => (
        <div key={item.id} className="h-full overflow-hidden">
          <div className="mb-4">
            <h3 className="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5">
              {item.title}
            </h3>
          </div>

          <div className="list_top_trend_film h-full overflow-y-auto">
            {item.listFilm?.map((itemFilm) => (
              <div
                key={itemFilm._id}
                className="overflow-hidden grid grid-cols-4 mb-2.5 h-[100px] gap-1"
              >
                <div className="col-span-1 h-full">
                  <Link href={`/playFilm/${itemFilm.slug}`}>
                    <img
                      src={itemFilm.photo?.[0]}
                      alt={itemFilm.photo?.[0]}
                      title={itemFilm.title}
                      className="w-full h-[100px] object-cover border-[1px]"
                    />
                  </Link>
                </div>

                <div className="p-2 col-span-3 text-white bg-black opacity-60 hover:opacity-100 flex flex-col justify-center">
                  <h3 className="font-semibold">
                    <Link
                      href={`/playFilm/${itemFilm.slug}`}
                      title={itemFilm.title}
                    >
                      {itemFilm.title}
                    </Link>
                  </h3>
                  <p className="text-[12px]">
                    Giải thưởng:{" "}
                    {itemFilm.awards?.map((subText, i) => (
                      <React.Fragment key={i}>
                        {subText}
                        {i !== itemFilm.awards.length - 1 && ", "}
                      </React.Fragment>
                    ))}
                  </p>
                  <p className="text-[12px] italic">
                    {itemFilm.views} Lượt xem
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default SidebarContentFilm;
