import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { logOutSuccess } from "../../store/authSlice";
import { logOut } from "../../store/apiRequest";
import { useRouter } from "next/router";

const HeaderManageInfo = ({ showSideBar, setShowSideBar }) => {
  // console.log(showSideBar);
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.login.currentUser);
  // console.log(">>> Header Manage Info <<<", user);
  const accessToken = user?.accessToken;
  const id = user?._id;

  const [searchInput, setSearchInput] = useState("");

  const handleSearchInput = (e) => {
    const { name, value } = e.target;
    setSearchInput(value);
  };
  const handleLogout = (e) => {
    e.preventDefault();
    logOut(dispatch, id, router);
  };
  const handleShowSideBar = (e) => {
    e.preventDefault();
    setShowSideBar((prev) => !prev);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white shadow-lg">
      <nav className="flex pr-[20px] justify-between items-center h-[70px]">
        <div className="flex items-center h-full">
          {showSideBar && (
            <div className="bg-[#2b3a4a] px-[24px] w-[240px] h-full">
              <Link href="/" className="inline-block h-full">
                <span>
                  <img
                    className="block h-full object-contain"
                    src="https://phimmoiyyy.net/wp-content/uploads/2023/03/phimmoi.png"
                    alt="logo"
                  />
                </span>
              </Link>
            </div>
          )}

          <button
            className="cursor-pointer text-2xl select-none py-1 px-4"
            onClick={handleShowSideBar}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        <div className="flex items-center h-full">
          <form className="block py-[16px]">
            <div className="relative">
              <input
                className="block h-[38px] px-[20px] py-[6px] bg-[#f8f9fa] rounded-[30px]"
                type="text"
                name="searchInput"
                value={searchInput}
                onChange={handleSearchInput}
                placeholder="Tìm kiếm..."
              />
              <span className="absolute top-[50%] -translate-y-1/2 right-[16px] z-10 py-[5px] cursor-pointer">
                <i className="fa-solid fa-magnifying-glass text-sm"></i>
              </span>
            </div>
          </form>

          <div className="relative ml-[4px] w-[150px] h-full cursor-pointer bg-[#F6F6F9] group">
            <div className="flex justify-center items-center h-full px-[16px] py-[8px]">
              <div className="max-w-[80%] w-full">
                <span className="font-bold ">
                  <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                    {user?.username}
                  </p>
                </span>
                <span className="flex items-center text-xs mt-[4px] col-span-1">
                  <i className="fa-solid fa-coins text-yellow-400 mr-[4px]"></i>
                  <p className="text-[#2DAAED] flex-1 font-semibold whitespace-nowrap text-ellipsis overflow-hidden">
                    12000
                  </p>
                </span>
              </div>

              <span className="max-w-[20%] w-full flex items-center">
                <i className="fa-solid fa-caret-down"></i>
              </span>
            </div>

            <ul className="overflow-hidden absolute z-50 top-[100%] right-0 left-0 hidden bg-white text-gray-700 border border-gray-300 rounded-md group-hover:block">
              <li className="block hover:bg-gray-100">
                <Link href="/" className="py-2.5 px-3.5 block w-full text-sm">
                  Trang xem phim
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
        </div>
      </nav>
    </header>
  );
};

export default HeaderManageInfo;
