import { Inter } from "next/font/google";
import LayoutRoot from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });
import axios from "axios";
import { createAxios } from "../utils/createInstance";
import { getFavoriteMovies, getWatchLaterMovies } from "../store/apiRequest";
import { addDataMovies } from "../store/filmSlice";

const Home = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.login?.currentUser);
  const accessToken = user?.accessToken;
  // console.log(accessToken);
  const userId = user?._id;
  let axiosJWT = createAxios(user, null, null);
  // console.log("dataMovies", props.dataMovies);

  console.log("render home");

  useEffect(() => {
    if (props?.dataMovies) {
      dispatch(addDataMovies(props?.dataMovies));
    }
  }, []);

  return (
    <>
      <Head>
        <title>The Stone</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta property="og:type" content="blog" />
        <meta
          property="og:image"
          content="https://img.freepik.com/free-vector/flat-vertical-hotel-information-flyer-template_23-2148898863.jpg?w=2000"
        ></meta>
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <LayoutRoot categories={props?.categories}>
        <Dashboard />
      </LayoutRoot>
    </>
  );
};
export default Home;

// export async function getStaticProps(context) {
//   let allMovie = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/v1/movie`);
//   let allCategory = await axios.get(
//     `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
//   );
//   return {
//     props: {
//       dataMovies: allMovie?.data?.data,
//       categories: allCategory?.data?.data,
//     },
//     revalidate: 20,
//   };
// }

export async function getStaticProps() {
  try {
    const [moviesResponse, categoriesResponse] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_URL}/api/v1/movie`),
      axios.get(`${process.env.NEXT_PUBLIC_URL}/api/v1/category`),
    ]);

    const dataMovies = moviesResponse?.data?.data || [];
    const categories = categoriesResponse?.data?.data || [];

    return {
      props: {
        dataMovies,
        categories,
      },
      revalidate: 60, // Revalidate every 60 seconds (adjust as needed)
    };
  } catch (error) {
    console.error("Error fetching data:", error);

    return {
      props: {
        dataMovies: [],
        categories: [],
      },
      revalidate: 60, // Revalidate every 60 seconds (adjust as needed)
    };
  }
}
