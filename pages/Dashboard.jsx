import MainContentFilm from "../components/MainContentFilm";
import SliderTrendingFilm from "../components/SliderTrendFilm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  return (
    <>
      <SliderTrendingFilm toast={toast} />
      <MainContentFilm toast={toast} />
      <ToastContainer />
    </>
  );
}
