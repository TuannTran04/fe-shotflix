import LayoutRoot from "@/components/Layout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/legacy/image";
import Pagination from "../../../components/Pagination";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getMoviesByCate } from "../../../services/userRequest";
import Breadcrumb from "../../../components/BreadCrumb";
import Heading from "../../../components/Heading";
import LayoutAllFilm from "../../../components/LayoutAllFilm";

const CategoryPage = ({ slugCategory, nameCategory, categories }) => {
  // console.log(categories);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");
  const cateId = searchParams.get("cateId");

  const [arrMovie, setArrMovie] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (slugCategory) {
      router.push(`${slugCategory}?cateId=${cateId}&page=${currentPage}`);
    }
  }, [currentPage, slugCategory]);

  useEffect(() => {
    const renderMoviesByCategory = async () => {
      try {
        if (cateId) {
          const res = await getMoviesByCate(cateId, currentPage, pageSize);
          console.log(">>> Category Film <<<", res?.data.data.movies);
          console.log(">>> Category Film <<<", res?.data.data.totalCount);
          setArrMovie(res?.data.data.movies);
          setTotalPages(Math.ceil(res?.data.data.totalCount / pageSize));
        }
      } catch (err) {
        console.log(err);
      }
    };
    renderMoviesByCategory();
  }, [cateId, currentPage, pageSize]);

  return (
    <LayoutRoot categories={categories}>
      <div className="md:mt-16">
        <Breadcrumb content={nameCategory} />

        <Heading
          content={nameCategory}
          styleDiv="mb-4 md:mb-8"
          styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
        />

        <LayoutAllFilm arrMovie={arrMovie} />

        {arrMovie.length !== 0 ? (
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

export default CategoryPage;

export async function getStaticProps(context) {
  const slugCategory = context.params.nameCategory;
  // console.log(slugCategory);
  let allCategory = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
  );

  let cateName = null; // Mặc định là null
  if (slugCategory && allCategory?.data?.data) {
    const foundCategory = allCategory?.data?.data.find(
      (item) => item.slug == slugCategory
    );
    if (foundCategory) {
      cateName = foundCategory.name;
    }
  }

  // console.log("cateName", cateName);

  return {
    props: {
      slugCategory,
      nameCategory: cateName,
      categories: allCategory.data.data,
    },
    revalidate: 20,
  };
}

export async function getStaticPaths(context) {
  let allCategory = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
  );
  const paths = allCategory.data.data.map((item) => {
    // console.log("getStaticPaths", item.name);
    return { params: { nameCategory: `${item.name}` } };
  });
  return {
    paths,
    fallback: true, // false or "blocking"
  };
}
