import { Suspense, lazy, type ReactNode } from "react";
import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";

import DefaultLayout from "@/layouts/default-layout";
import RootLayout from "@/layouts/root-layout";
import Auth from "@/pages/auth";

// Error
const Error403 = lazy(() => import("@/pages/errors/403"));
const Error404 = lazy(() => import("@/pages/errors/404"));

// Pages
const Homepage = lazy(() => import("@/pages/homepage"));

export interface IRoute {
  id: number;
  path: string;
  element: JSX.Element;
}

const withSuspense = (node: ReactNode, fallback: NonNullable<ReactNode> | null = null): JSX.Element => {
  return <Suspense fallback={fallback}>{node}</Suspense>;
};

const routeList: IRoute[] = [
  { id: 1, path: "/", element: <Navigate to="/homepage" /> },
  { id: 2, path: "homepage", element: withSuspense(<Homepage />) },
];

const getRouteList = () => {
  return createBrowserRouter(
    createRoutesFromElements(
      <Route element={<RootLayout />}>
        <Route path="login" element={<Auth />} />
        <Route element={<DefaultLayout />}>
          {routeList.map((route) => (
            <Route key={route.id} path={route.path} element={route.element} />
          ))}
          {/* Page not found */}
          <Route path="*" element={withSuspense(<Error404 />)} />
          {/* Forbidden */}
          <Route path="/403" element={withSuspense(<Error403 />)} />
        </Route>
      </Route>
    )
  );
};

export default getRouteList;
