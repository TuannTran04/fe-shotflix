import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Movie from "./components/Movie";

const LayoutAllFilm = ({ styles, content, arrMovie }) => {
  return (
    <div className="">
      <div className="overflow-hidden">
        {arrMovie?.length === 0 ? (
          <div className="text-center min-h-[250px]">
            <p className="text-white text-lg">Không có kết quả</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-x-3 md:gap-x-3.5 gap-y-[20px]">
            {arrMovie?.map((item, index) => {
              return <Movie key={item._id} item={item} toast={toast} />;
            })}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default LayoutAllFilm;
