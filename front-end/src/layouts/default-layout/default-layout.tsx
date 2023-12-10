import type { PropsWithChildren, FC } from "react";
import { Outlet } from "react-router-dom";

import SideBar from "../side-bar/side-bar";

import Header from "./header";

import CustomToast from "@/components/custom-toast";

const DefaultLayout: FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <>
      <div className="w-screen h-screen overflow-hidden">
        <div className="flex flex-col w-full h-full">
          <Header />
          <div className="flex-1 flex">
            <SideBar />
            <div
              className="h-full bg-[#F9F9F9] scroll-smooth"
              style={{
                width: "calc(100% - 200px)",
              }}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <CustomToast />
    </>
  );
};

export default DefaultLayout;
