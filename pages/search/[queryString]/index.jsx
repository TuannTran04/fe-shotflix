import LayoutRoot from "@/components/Layout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/legacy/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSelector } from "react-redux";
import { searchMovies } from "../../../services/userRequest";
import Heading from "../../../components/Heading";
import LayoutAllFilm from "../../../components/LayoutAllFilm";

const SearchFilmPage = ({ queryString, categories }) => {
  const user = useSelector((state) => state.auth.login.currentUser);

  const [arrMovie, setArrMovie] = useState([]);
  console.log(queryString);

  useEffect(() => {
    const renderSearchMovies = async () => {
      try {
        const res = await searchMovies(queryString);
        // console.log(">>> Results Search <<<", res);
        if (res.data.code === 200) {
          setArrMovie(res.data.data.movies);
        } else {
          setArrMovie([]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    renderSearchMovies();
  }, [queryString]);

  return (
    <LayoutRoot categories={categories}>
      <div className="mt-20">
        <Heading
          content={`Kết quả tìm kiếm: ${queryString.replace(/\+/g, " ")}`}
          styleDiv="mb-4"
          styleTitle="text-[#da966e] text-2xl font-normal border-l-4 pl-2.5"
        />

        <LayoutAllFilm arrMovie={arrMovie} />
      </div>
    </LayoutRoot>
  );
};

export default SearchFilmPage;

export async function getServerSideProps(context) {
  const queryString = context.params.queryString;

  let allCategory = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
  );
  return {
    props: {
      queryString,
      categories: allCategory.data.data,
    },
  };
}
