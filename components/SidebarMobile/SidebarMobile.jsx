import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import { useDispatch, useSelector } from "react-redux";
import { createAxios } from "../../utils/createInstance";
import { logOutSuccess } from "../../store/authSlice";
import { logOut } from "../../store/apiRequest";

const SidebarHomeMobile = ({
  categories,
  showSideBarMobile,
  setShowSideBarMobile,
}) => {
  const router = useRouter();

  const user = useSelector((state) => state.auth.login.currentUser);
  const accessToken = user?.accessToken;
  const id = user?._id;
  const dispatch = useDispatch();
  let axiosJWT = createAxios(user, dispatch, logOutSuccess);

  const cate = categories?.map((item, i) => {
    return {
      title: item.name,
      itemId: `/category/${item.slug}?cateId=${item._id}`,
    };
  });

  const handleLogout = (e) => {
    e.preventDefault();
    logOut(dispatch, id, router, accessToken, axiosJWT);
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 bg-[rgba(0,0,0,.6)] z-[50]
      ${
        showSideBarMobile
          ? "visible opacity-100 w-full h-full"
          : "invisible opacity-0 w-0 h-0"
      }
      `}
        onClick={() => setShowSideBarMobile((prev) => !prev)}
      ></div>

      <div
        className={`${
          showSideBarMobile
            ? "left-0 opacity-90 w-[300px] visible h-full"
            : "left-[-300px] opacity-0 w-0 h-0 invisible"
        } fixed md:hidden top-0 transition-all duration-500 z-[50]`}
      >
        <div className="absolute top-0 right-0 z-[50]">
          <span
            className="flex justify-center items-center text-white bg-[rgba(255,255,255,0.3)] w-[25px] h-[30px]"
            onClick={() => setShowSideBarMobile((prev) => !prev)}
          >
            {/* <i className="fa-solid fa-xmark text-[30px]"></i> */}
            <i className="fa-solid fa-chevron-left text-[25px]"></i>
          </span>
        </div>

        <div
          className={`py-[16px] px-[14px] w-full h-full bg-[rgba(0,0,0,.8)] overflow-y-auto`}
        >
          {/* https://github.com/abhijithvijayan/react-minimal-side-navigation */}

          <div className="p-[16px] mb-[18px] bg-[#090b0c] text-center overflow-x-hidden">
            {!user ? (
              <Link
                href="/login"
                className="px-[18px] inline-block text-white bg-[#b71c1c] rounded cursor-pointer leading-9"
              >
                Đăng nhập/Đăng ký
              </Link>
            ) : (
              <div className="px-[20px] py-[5px] text-left bg-white rounded group cursor-pointer">
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

          <div className="sidebarMobile">
            <Navigation
              // activeItemId={modifiedPath}
              onSelect={({ itemId }) => {
                // console.log(itemId);
                if (itemId === "") {
                  return;
                }
                if (itemId.includes("/category")) {
                  setShowSideBarMobile((prev) => !prev);
                }
                router.push(itemId);
              }}
              items={[
                {
                  title: "Trang chủ",
                  itemId: `/`,
                },

                {
                  title: "Thể loại",
                  itemId: ``,
                  subNav: cate,
                },
              ]}
            />

            {user ? (
              <div className="ml-[16px] my-8">
                <button
                  className="px-[18px] inline-block text-white bg-[#b71c1c] rounded cursor-pointer leading-9"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarHomeMobile;
