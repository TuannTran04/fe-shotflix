import Image from "next/legacy/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { logOutSuccess } from "../../store/authSlice";
import { logOut } from "../../store/apiRequest";
import { useRouter } from "next/router";
import { arrNameCategory, arrSearchMovie } from "./constHeader";
import Cookies from "js-cookie";
import { searchMovies } from "../../services/userRequest";
import axios from "axios";
import SidebarHomeMobile from "../SidebarMobile/SidebarMobile";

export default function Header({ categories }) {
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const [arrSearchMovie, setArrSearchMovie] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [showSearchResults, setSearchResults] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const [showSideBarMobile, setShowSideBarMobile] = useState(false);

  const inputRef = useRef();

  const handleSearchInput = async (e) => {
    const { name, value } = e.target;
    setSearchInput(value);
    try {
      if (value) {
        const res = await searchMovies(value);
        if (res.data.code === 200) {
          setArrSearchMovie(res.data.data.movies);
        } else {
          setArrSearchMovie([]);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleShowSidebarMobile = (e) => {
    setShowSideBarMobile((prev) => !prev);
  };

  const handleSubmitSearchInput = (e) => {
    e.preventDefault();
    setShowSearchInput((prev) => !prev);
    if (searchInput) {
      router.push(`/search/${searchInput.replace(/\s+/g, "+")}`);
      setSearchInput("");
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logOut(dispatch, id, router, accessToken, axiosJWT);
  };

  return (
    <header className="bg-[#151414] h-20 relative sm:fixed top-0 left-0 right-0 z-[100] shadow-xl">
      <nav className="px-2 md:px-0 h-full mx-auto max-w-[1200px]">
        <div className="h-full flex justify-between items-center">
          <div className="block md:hidden">
            <span
              className="rounded bg-white text-black p-[8px] h-11 w-11 z-20"
              onClick={handleShowSidebarMobile}
            >
              <i className="fa-solid fa-bars"></i>
            </span>
          </div>

          {/* NAV MOBILE */}
          {/* <div className="fixed md:hidden top-0 left-0 bg-[rgba(0,0,0,.6)] w-full h-full z-[50]">
            <div className="py-[16px] px-[12px] w-[270px] h-full bg-[rgba(0,0,0,.8)] overflow-y-auto z-[100]">
              <div className="p-[16px] mb-[18px] bg-[#090b0c] text-center overflow-x-hidden">
                {!user ? (
                  <Link
                    href="/login"
                    className="px-[18px] inline-block text-white bg-[#b71c1c] rounded cursor-pointer leading-9"
                  >
                    Đăng nhập/Đăng ký
                  </Link>
                ) : (
                  <div className="block px-[20px] py-[5px] relative text-left bg-white rounded group cursor-pointer">
                    <Link
                      href={`/user/${user?.username
                        .replace(/\s+/g, "")
                        .toLowerCase()}`}
                      className="text-black font-bold whitespace-nowrap text-ellipsis overflow-hidden"
                      title={user?.username}
                    >
                      <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                        {user?.username}
                      </p>
                    </Link>

                    <span className="flex items-center text-xs mt-[2px] col-span-1">
                      <i className="fa-solid fa-coins text-yellow-400 mr-[4px]"></i>
                      <p className="text-[#2DAAED] flex-1 font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                        0
                      </p>
                    </span>
                  </div>
                )}
              </div>

              <nav className="">
                <ul className="text-white">
                  <li className="">
                    <Link
                      href="/"
                      className="text-base font-normal leading-10 hover:text-[#da966e]"
                    >
                      Trang chủ
                    </Link>
                  </li>
                  <li className="relative group">
                    <Link
                      href="#"
                      className="flex justify-between items-center text-base font-normal leading-10 hover:text-[#da966e]"
                    >
                      Thể loại
                      <span className="ml-1.5">
                        <i className="fa-solid fa-caret-down"></i>
                      </span>
                    </Link>

                    <ul className="flex flex-wrap justify-between items-center overflow-hidden">
                      {categories?.map((item, i) => (
                        <li key={item._id} className="w-[50%]">
                          <Link
                            href={`/category/${item.slug}?cateId=${item._id}`}
                            className="pl-[15px] pr-[8px] py-2 block w-full text-[12px] overflow-hidden text-ellipsis whitespace-nowrap"
                            title={`${item.name}`}
                          >
                            <span>{item.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
              </nav>
            </div>
          </div> */}

          <SidebarHomeMobile
            categories={categories}
            showSideBarMobile={showSideBarMobile}
            setShowSideBarMobile={setShowSideBarMobile}
          />

          <div className="bg-[rgba(255,255,255,.05)] px-[15px] h-full w-[180px] text-center">
            <Link href="/" className="relative w-full inline-block h-full">
              <Image
                className="block h-full object-contain"
                // src="/favicon.ico"
                src="https://phimmoiyyy.net/wp-content/uploads/2023/03/phimmoi.png"
                layout="fill"
                // src="https://ssphim.cc/themes/bptv/images/ssphim.png?v=1.0"
                // width={55}
                // height={55}
                alt="user profile avatar"
                priority
              />
              {/* <img
                className="block h-full object-contain"
                src="https://phimmoiyyy.net/wp-content/uploads/2023/03/phimmoi.png"
                alt="logo"
              /> */}
            </Link>
          </div>

          <div className="hidden md:block flex-1 text-white">
            <ul className="flex justify-center items-center ">
              <li className="inline-block">
                <Link
                  href="/"
                  className="px-5 py-5 mx-2 block text-base font-semibold cursor-pointer hover:text-[#da966e]"
                >
                  Trang chủ
                </Link>
              </li>

              <li className="inline-block relative group hover:text-[#da966e]">
                <Link
                  href="#"
                  className="px-5 py-5 mx-2 block text-base font-semibold cursor-pointer"
                >
                  Thể loại
                  <span className="ml-1.5">
                    <i className="fa-solid fa-caret-down"></i>
                  </span>
                </Link>

                <ul className="overflow-hidden absolute top-14 w-[400px] lg:w-[450px] hidden bg-white text-gray-700 border border-gray-300 rounded-md group-hover:flex flex-wrap z-50">
                  {categories?.map((item, i) => (
                    <li
                      key={item._id}
                      className="w-4/12 min-h-[30px] inline-block hover:bg-gray-100"
                    >
                      <Link
                        href={`/category/${item.slug}?cateId=${item._id}`}
                        className="py-1 px-3 block w-full text-[12px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={`${item.name}`}
                      >
                        <span>
                          {" "}
                          <span className="mr-2">
                            <i className="fa-solid fa-caret-right"></i>
                          </span>
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>

          <div className="flex justify-end items-center  ">
            <div className="relative">
              <div className="md:mr-[8px] relative flex">
                <input
                  // className="absolute right-full inset-y-0 bg-[#2D2D2D] focus:outline-none px-3.5 text-white"
                  className={`absolute inset-y-0 placeholder:text-xs bg-[#2D2D2D] text-white transition-all duration-500 outline-none rounded-[5px] ${
                    showSearchInput
                      ? "opacity:100 w-[230px] right-[60%] px-3.5 z-10"
                      : "opacity:0 right-[30%] w-0 px-0"
                  }`}
                  ref={inputRef}
                  type="text"
                  name="searchInput"
                  value={searchInput}
                  onChange={handleSearchInput}
                  placeholder="vd: Tên phim, đạo diễn, diễn viên..."
                  autoComplete="off"
                />

                <button
                  className="rounded-full bg-white text-black h-11 w-11 z-20"
                  title="Tìm kiếm"
                  onClick={handleSubmitSearchInput}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>

              {searchInput && (
                <div
                  // ref={resultsRef}
                  className="scroll_search_header absolute top-[110%] right-[80%] min-h-[50px] max-h-[300px] w-[330px] bg-[rgba(0,0,0,.8)] overflow-y-auto z-[100]"
                >
                  {arrSearchMovie.length === 0 ? (
                    <p className="p-2 text-white text-center">
                      Không có kết quả tìm kiếm
                    </p>
                  ) : (
                    arrSearchMovie.map((item, i) => (
                      <div
                        key={item._id}
                        className="mb-[10px] p-2 h-[55px] flex items-center overflow-hidden"
                      >
                        <Link
                          href={`/playFilm/${item.slug}`}
                          className="flex items-center justify-between w-full h-[55px] group"
                        >
                          <span className="max-w-[40%] w-full h-full mr-[10px] overflow-hidden">
                            <img
                              src={item.photo?.[0]}
                              alt="pic"
                              className="object-cover w-full h-full group-hover:scale-110 transition-all duration-300"
                            />
                          </span>

                          <span className="max-w-[60%] w-full h-full overflow-hidden group-hover:opacity-80">
                            <span className="block mb-[3px] text-[14px] text-[#0285b5] font-medium whitespace-nowrap text-ellipsis overflow-hidden">
                              {item.title}
                            </span>
                            <span className="block text-[12px] text-[#0285b5] font-extralight whitespace-nowrap text-ellipsis overflow-hidden">
                              {item.yearPublish}
                            </span>
                            <span className="block text-[11px] text-[#fff] font-thin whitespace-nowrap text-ellipsis overflow-hidden">
                              {item.views} views
                            </span>
                          </span>
                        </Link>
                      </div>
                    ))
                  )}

                  <div className="p-2 text-center border-t-[1px] border-[rgba(255,255,255,.3)]">
                    <p
                      className="text-xs text-white cursor-pointer italic"
                      onClick={handleSubmitSearchInput}
                    >
                      Xem tất cả kết quả
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:block mr-[8px] w-[1px] h-[30px] bg-white opacity-50"></div>

            {!user ? (
              <div className="hidden md:flex justify-end items-center">
                <div className="mr-2.5">
                  <Link
                    className="text-sm font-semibold cursor-pointer text-white hover:underline"
                    href="/login"
                  >
                    Đăng nhập
                  </Link>
                </div>
                <div className="">
                  <Link
                    className="text-sm font-semibold cursor-pointer text-white hover:underline"
                    href="/register"
                  >
                    Đăng ký
                  </Link>
                </div>
              </div>
            ) : (
              <div className="hidden md:block p-[5px] relative cursor-pointer group w-[150px] bg-white rounded">
                <div className="grid grid-cols-5">
                  <div className="col-span-4">
                    <Link
                      href={`/user/${user?.username
                        .replace(/\s+/g, "")
                        .toLowerCase()}`}
                      className="text-black font-bold whitespace-nowrap text-ellipsis overflow-hidden"
                      title={user?.username}
                    >
                      <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                        {user?.username}
                      </p>
                    </Link>

                    <span className="flex items-center text-xs mt-[2px] col-span-1">
                      <i className="fa-solid fa-coins text-yellow-400 mr-[4px]"></i>
                      <p className="text-[#2DAAED] flex-1 font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                        12000
                      </p>
                    </span>
                  </div>

                  <span className="flex items-center justify-center">
                    <i className="fa-solid fa-caret-down"></i>
                  </span>
                </div>

                <ul className="overflow-hidden absolute z-50 top-[100%] left-0 right-0 hidden bg-white text-gray-700 border border-gray-300 rounded-md group-hover:block">
                  <li className="block hover:bg-gray-100">
                    <Link
                      href={`/user/${user?.username
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                      className="py-2.5 px-3.5 block w-full text-sm"
                    >
                      Trang cá nhân
                    </Link>
                  </li>
                  <li className="block hover:bg-gray-100">
                    <Link
                      href="#"
                      className="py-2.5 px-3.5 block w-full text-sm"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
