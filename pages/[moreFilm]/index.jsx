import React, { useEffect, useState } from "react";
import LayoutRoot from "../../components/Layout";
import axios from "axios";
import Breadcrumb from "../../components/BreadCrumb";
import Heading from "../../components/Heading";
import LayoutAllFilm from "../../components/LayoutAllFilm";
import Pagination from "../../components/Pagination";
import { getMoreMovies } from "../../services/userRequest";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

const MoreFilm = ({ nameMoreFilm }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");

  const [arrMovie, setArrMovie] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const renderMoreMovies = async () => {
      try {
        const res = await getMoreMovies(
          nameMoreFilm.replace(/-/g, " "),
          currentPage,
          pageSize
        );

        console.log(">>> getMoreMovies Film <<<", res);
        setArrMovie(res.data.data);
        setTotalPages(Math.ceil(res.data.totalCount / pageSize));
      } catch (err) {
        console.log(err);
      }
    };
    renderMoreMovies();
  }, [nameMoreFilm, currentPage, pageSize]);

  useEffect(() => {
    if (nameMoreFilm) {
      router.push(`${nameMoreFilm}?page=${currentPage}`);
    }
  }, [nameMoreFilm, currentPage, pageSize]);

  return (
    <LayoutRoot>
      <div className="mt-16">
        <Breadcrumb content={nameMoreFilm.replace(/-/g, " ")} />

        <Heading
          content={nameMoreFilm.replace(/-/g, " ")}
          styleDiv="mb-4"
          styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
        />

        <LayoutAllFilm arrMovie={arrMovie} />

        {arrMovie?.length !== 0 ? (
          <Pagination
            paginationData={{
              currentPage,
              totalPages,
              setCurrentPage: setCurrentPage,
            }}
          />
        ) : (
          ""
        )}
      </div>
    </LayoutRoot>
  );
};

export default MoreFilm;

export async function getServerSideProps(context) {
  const nameMoreFilm = context.params.moreFilm;

  let allCategory = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
  );
  return {
    props: {
      nameMoreFilm,
      categories: allCategory.data.data,
    },
  };
}
