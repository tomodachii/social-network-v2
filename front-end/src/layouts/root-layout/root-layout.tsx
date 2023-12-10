import { type FC, useCallback, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { IDLE_TIME_IN_MILLISECONDS } from "@/constants/session";
import useAuthInfo from "@/hooks/auth/auth";
// import * as env from "@/constants/env";

const RootLayout: FC = () => {
  const authInfoStore = useAuthInfo();
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    window.localStorage.clear();
    window.alert(`You have been idling for ${Math.floor(IDLE_TIME_IN_MILLISECONDS / 1000 / 60)} minutes`);
    navigate("/", { replace: true });
  }, [navigate]);

  const resetIdleTimeout = useCallback(() => {
    if (authInfoStore.accessToken) {
      idleTimeout.current && clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        logout();
      }, IDLE_TIME_IN_MILLISECONDS);
    }
  }, [logout, authInfoStore.accessToken]);

  useEffect(() => {
    const keyboardEvents = ["keypress", "keydown", "keyup"];
    const mouseEvents = [
      "mousedown",
      "mouseenter",
      "mouseleave",
      "mousemove",
      "mouseout",
      "mouseup",
      "mouseover",
      "click",
      "contextmenu",
      "dblclick",
    ];
    [...keyboardEvents, ...mouseEvents].forEach((eventName) => {
      document.body.addEventListener(eventName, () => resetIdleTimeout());
    });
    resetIdleTimeout();

    if (!authInfoStore.accessToken && !window.location.pathname.includes("/logout")) {
      navigate("/login", { replace: true });
    }
  }, [resetIdleTimeout, navigate, authInfoStore.accessToken]);
  return <Outlet />;
};

export default RootLayout;
