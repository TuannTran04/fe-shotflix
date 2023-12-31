import Link from "next/link";
import React, { useState } from "react";
import { arrItemSidebar } from "./constants";
import { useRouter } from "next/router";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

const SidebarManageInfo = ({ showSideBar }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  console.log(router);

  // tabs parent dont have submenu
  const handleDropdownClick = (index) => {
    if (activeDropdown === index) {
      return; // Do nothing if the clicked dropdown is already active
    }
    setActiveDropdown(index);
  };

  // tabs parent have submenu
  const handleDropdownSubmenuClick = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  // tabs children
  const handleSubmenuClick = (index) => {
    if (activeSubmenu === index) {
      return; // Do nothing if the clicked dropdown is already active
    }
    setActiveSubmenu(index);
  };

  return (
    <div className={`${showSideBar ? "block hehe" : "hidden"}`}>
      {/* <aside
        className="fixed top-[70px] bottom-0 w-[240px] bg-[#2b3a4a] z-50 transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="sidebar_manage_info h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium text-white">
            {arrItemSidebar.map((item, index) => {
              // tabs dont have submenu
              if (item.subMenu === false) {
                return (
                  <li
                    key={item.id}
                    className="group"
                    onClick={() => handleDropdownClick(index)}
                  >
                    <Link
                      href="#"
                      className={`flex items-center p-2 text-[#8699ad] rounded-lg group-hover:bg-gray-100 ${
                        activeDropdown === index ? "bg-gray-100" : ""
                      }`}
                    >
                      <i
                        className={`${
                          item.icon
                        } flex-shrink-0 w-5 my-auto transition duration-75 group-hover:text-gray-900 ${
                          activeDropdown === index ? "text-gray-900" : ""
                        } `}
                      ></i>
                      <span
                        className={`ml-3 group-hover:text-gray-900 ${
                          activeDropdown === index ? "text-gray-900" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              }

              // tabs have submenu
              if (item.subMenu) {
                return (
                  <li
                    key={item.id}
                    className="group"
                    onClick={() => handleDropdownSubmenuClick(index)}
                  >
                    <Link
                      href="#"
                      className={`flex items-center p-2 text-[#8699ad] rounded-lg group-hover:bg-gray-100 ${
                        activeDropdown === index ? "bg-gray-100" : ""
                      }`}
                    >
                      <i
                        className={`${
                          item.icon
                        } flex-shrink-0 w-5 my-auto transition duration-75 group-hover:text-gray-900 ${
                          activeDropdown === index ? "text-gray-900" : ""
                        } `}
                      ></i>

                      <span
                        className={`flex-1 ml-3 group-hover:text-gray-900 ${
                          activeDropdown === index ? "text-gray-900" : ""
                        }`}
                      >
                        {item.name}
                      </span>
                      <i
                        className={`fa-solid fa-caret-down w-3 h-3 group-hover:text-gray-900 ${
                          activeDropdown === index ? "text-gray-900" : ""
                        }`}
                      ></i>
                    </Link>

                    <ul
                      className={`${
                        activeDropdown === index ? "block" : "hidden"
                      } py-2 space-y-2 bg-white z-10`}
                    >
                      {item.subMenu.map((item, i) => (
                        <li key={item.id}>
                          <Link
                            href="#"
                            // className={`flex items-center p-2 text-[#8699ad] rounded-lg ${
                            //   activeDropdown === i ? "bg-gray-100" : ""
                            // }`}
                            className={`flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 hover:bg-gray-100 ${
                              activeSubmenu === i &&
                              item.belongToTabParent - 1 === index
                                ? "bg-gray-300"
                                : ""
                            }`}
                            onClick={(e) => {
                              console.log(index);
                              e.stopPropagation();
                              handleSubmenuClick(i);
                            }}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </aside> */}

      <div className="fixed top-[70px] bottom-0 w-[240px] bg-[#2b3a4a] z-50 transition-transform -translate-x-full sm:translate-x-0">
        {/* https://github.com/abhijithvijayan/react-minimal-side-navigation */}
        <div className="h-full px-3 py-4 overflow-y-auto">
          <Navigation
            activeItemId={router.asPath}
            onSelect={({ itemId }) => {
              console.log(itemId);
              if (itemId === "/about") {
                return;
              }
              router.push(itemId);
            }}
            items={[
              {
                title: "Dashboard",
                itemId: `${router.asPath}`,
                // Optional
                elemBefore: () => (
                  <>
                    <i className="fa-solid fa-cart-shopping"></i>
                  </>
                ),
              },
              {
                title: "About",
                itemId: "/about",
                elemBefore: () => <i className="fa-solid fa-cart-shopping"></i>,
                subNav: [
                  {
                    title: "Projects",
                    itemId: "/about/projects",
                    // Optional
                    elemBefore: () => (
                      <>
                        <i className="fa-solid fa-cart-shopping"></i>
                      </>
                    ),
                  },
                  {
                    title: "Members",
                    itemId: "/about/members",
                    elemBefore: () => (
                      <i className="fa-solid fa-cart-shopping"></i>
                    ),
                  },
                ],
              },
              // {
              //   title: "Another Tab",
              //   itemId: "/another",
              //   subNav: [
              //     {
              //       title: "Teams",
              //       itemId: "/another/teams",
              //       // Optional
              //       // elemBefore: () => <Icon name="calendar" />
              //     },
              //   ],
              // },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarManageInfo;
