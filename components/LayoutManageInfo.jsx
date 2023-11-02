import { Inter } from "next/font/google";
import HeaderManageInfo from "@/components/HeaderManageInfo";
import ArrowGotoUp from "./ArrowGoToUp";
import { useState } from "react";
import SidebarManageInfo from "./SidebarManageInfo";
import Header from "./Header";
import Footer from "./Footer";

const inter = Inter({ subsets: ["latin"] });
// className="sm:w-11/12 md:w-[1200px] mx-auto bg-[#151414] p-7"
const LayoutManageInfo = ({ children, categories }) => {
  // const [showSideBar, setShowSideBar] = useState(true);

  return (
    <>
      {/* <HeaderManageInfo
        showSideBar={showSideBar}
        setShowSideBar={setShowSideBar}
      /> */}
      <Header categories={categories} />
      <div className="bg-[#424040]">
        <div className="xl:w-[1200px] mx-auto bg-[#151414] p-7">{children}</div>
      </div>
      {/* <SidebarManageInfo showSideBar={showSideBar} /> */}
      <ArrowGotoUp />
      <Footer />
    </>
  );
};

export default LayoutManageInfo;
