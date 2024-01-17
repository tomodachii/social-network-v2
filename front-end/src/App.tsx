/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import "./App.scss";
import { useEffect } from "react";

import { socket } from "./socket";
import getRouteList from "./utils/router";

import { queryClient } from "@/lib/react-query";

function App() {
  useEffect(() => {
    socket.connect();
  }, []);

  socket.connect();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={getRouteList()} />
    </QueryClientProvider>
  );
}

export default App;
