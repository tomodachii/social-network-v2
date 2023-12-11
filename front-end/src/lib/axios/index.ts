import axios, { HttpStatusCode } from "axios";
import qs from "qs";
// import { switchMap, BehaviorSubject, of, filter, finalize } from "rxjs";

import { VITE_API_AUTH_SERVICE_URL } from "@/constants/env";
// import { handleLogout, refreshToken, setAuthenticationInfo } from "@/apis/oidc";
// import useAuthInfo from "@/features/auth/hooks/auth";
import { notify, warningIconImg } from "@/components/custom-toast";

export const defaultAxios = axios.create({
  baseURL: VITE_API_AUTH_SERVICE_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
  paramsSerializer: {
    serialize: (params) => qs.stringify(params, { arrayFormat: "repeat", indices: false }),
  },
});

// TODO: fix me
defaultAxios.interceptors.request.use(
  function (config) {
    // const accessToken = useAuthInfo.getState().idToken;

    // if (accessToken) {
    //   config.headers["Authorization"] = `Bearer ${accessToken}`;
    // }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Refresh token
defaultAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // eslint-disable-next-line no-console
    console.log("Call refresh token ", error);
    // const originalRequest = error.config;

    switch (error.response?.status) {
      case HttpStatusCode.Unauthorized:
        // return handleRefreshToken(originalRequest);
        return;
      case HttpStatusCode.Forbidden:
        notify("Oops, this action is not permitted!", "error", 5000, warningIconImg);
        return Promise.reject(error);
      default:
        return Promise.reject(error);
    }
  }
);

// var tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>("");
// var isRefreshToken = false;
// const handleRefreshToken = async (originalRequest) => {
//   if (VITE_IS_ENABLE_LOGIN && !isRefreshToken) {
//     isRefreshToken = true;
//     tokenSubject.next("");
//     try {
//       // eslint-disable-next-line no-console
//       console.log("Call refresh token 2");
//       return of(await refreshToken())
//         .pipe(
//           switchMap((res: any): any => {
//             if (res) {
//               tokenSubject.next(res.data.id_token);
//               setAuthenticationInfo(res);
//               originalRequest.headers.Authorization = `Bearer ${res.data.id_token}`;
//               return defaultAxios(originalRequest);
//             }
//           }),
//           finalize(() => {
//             isRefreshToken = false;
//           })
//         )
//         .toPromise();
//     } catch (error) {
//       handleLogout({ state: useAuthInfo.getState().state, access_token: useAuthInfo.getState().accessToken });
//       return Promise.reject(error);
//     }
//   } else {
//     return tokenSubject
//       .pipe(
//         filter((token: any): any => {
//           if (token) {
//             return true;
//           }

//           return false;
//         }),
//         switchMap((token: any): any => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return defaultAxios(originalRequest);
//         })
//       )
//       .toPromise();
//   }
// };
