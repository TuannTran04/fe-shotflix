import React, { useState } from "react";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

const Test = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
 <>
  <video id="videoPlayer" width="650" controls muted>
        <source src={`${process.env.NEXT_PUBLIC_URL}/video`} type="video/mp4"/>
    </video>
 </>
  );
};

export default Test;
