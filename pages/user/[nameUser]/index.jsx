import Link from "next/link";
import LayoutManageInfo from "../../../components/LayoutManageInfo";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import FavoriteMovie from "./tabs/FavoriteMovie";
import WatchLaterMovie from "./tabs/WatchLaterMovie";
import { useSelector } from "react-redux";
import ProtectedRoute from "../../../utils/ProtectedRoutes";
import axios from "axios";
import ProfileUser from "./tabs/ProfileUser";

const arrTabs = [
  { id: 1, tabName: "Hồ sơ", tabPath: "profile" },
  { id: 2, tabName: "Yêu thích", tabPath: "favorite" },
  { id: 3, tabName: "Xem sau", tabPath: "watchLater" },
];

const UserManagePage = ({ nameUser, categories }) => {
  const router = useRouter();
  const user = useSelector((state) => state.auth.login.currentUser);

  const [activeTab, setActiveTab] = useState(router?.query?.tab || "profile");
  const handleNavigate = (tabName) => {
    router.push(`/user/${nameUser.replace(/\s+/g, "-")}?tab=${tabName}`);
  };

  const [showBigAvatar, setShowBigAvatar] = useState(false);

  // console.log(router.asPath);
  // console.log(`/user/${nameUser}`);
  // console.log(router.asPath == `/user/${nameUser}`);
  // console.log(router.asPath.includes("/user"));
  // console.log(router.asPath.includes(`/user/${nameUser}`));

  // useEffect(() => {
  //   router.push(`/user/${nameUser.replace(/\s+/g, "-")}?tab=${activeTab}`);
  // }, [activeTab]);

  // useEffect(() => {
  //   if (user == null) {
  //     router.push("/");
  //   } else return;
  // }, []);

  return (
    <ProtectedRoute>
      <LayoutManageInfo categories={categories}>
        <div className="sm:mt-20 mb-8 overflow-hidden">
          <div className="flex justify-start items-center mb-[25px]">
            <div className="h-[130px] w-[130px] select-none">
              <img
                className="block w-full h-full rounded-[50%] object-cover hover:border-[1px] transition-all duration-100 cursor-pointer"
                src={user?.avatar || "/unknowAvatar.webp"}
                alt="pic"
                onClick={() => {
                  setShowBigAvatar(true);
                }}
              />
            </div>

            {/* big overlay img */}
            {showBigAvatar && (
              <>
                <div
                  className="fixed inset-x-0 inset-y-0 bg-[rgba(0,0,0,0.7)] z-[150] cursor-pointer"
                  onClick={() => {
                    setShowBigAvatar(false);
                  }}
                ></div>
                <div className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex select-none z-[200]">
                  <img
                    className="block mx-auto my-auto w-[400px] h-[500px] sm:w-[500px] sm:h-[500px] object-cover z-[200]"
                    src={user?.avatar || "/unknowAvatar.webp"}
                    alt="big pic"
                  />
                  <i
                    className="fa-solid fa-xmark absolute top-1 right-1 w-[30px] h-[30px] flex items-center justify-center bg-white opacity-60 rounded-[50%] z-[250] cursor-pointer hover:opacity-100"
                    onClick={() => {
                      setShowBigAvatar(false);
                    }}
                  ></i>
                </div>
              </>
            )}

            <div className="ml-[15px]">
              <div className="mb-[10px] max-w-[300px]">
                <h1 className="w-full text-xl font-semibold text-white whitespace-nowrap text-ellipsis overflow-hidden">
                  {user?.username || nameUser}
                </h1>
              </div>
              <div>
                <Link
                  className="py-[6px] px-[10px] bg-[#567] text-[#c8d4e0] text-sm font-normal tracking-[.075em] rounded-[3px] shadow cursor-pointer select-none hover:bg-[#678] hover:text-white"
                  href={`/editInfo/${user?.username || nameUser}`}
                >
                  Edit profile
                </Link>
              </div>
            </div>
          </div>

          {/* TABs */}
          <nav className="block border-[1px] border-[#24303c] rounded-[3px]">
            <ul className="scroll_tab_manage_user flex flex-nowrap mx-auto items-center overflow-x-auto">
              {arrTabs.map((item, index) => (
                <li key={item.id} className="mx-auto">
                  <Link
                    href="#"
                    className={`block p-[12px] text-base text-white underline-offset-8 hover:underline ${
                      activeTab == item.tabPath ? "underline" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveTab(item.tabPath);
                      handleNavigate(item.tabPath);
                    }}
                  >
                    {item.tabName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {(router && router.asPath == `/user/${nameUser}`) ||
        (router && router.query && router.query?.tab == "profile") ? (
          <ProfileUser userData={user} />
        ) : (
          ""
        )}

        {/* FILMs */}

        {router && router.query && router.query?.tab == "favorite" && (
          <FavoriteMovie />
        )}
        {router && router.query && router.query?.tab == "watchLater" && (
          <WatchLaterMovie />
        )}
      </LayoutManageInfo>
    </ProtectedRoute>
  );
};

export default UserManagePage;

export async function getServerSideProps({ params }) {
  const nameUser = params.nameUser;
  let allCategory = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/category`
  );
  return {
    props: {
      nameUser,
      categories: allCategory.data.data,
    },
  };
}
