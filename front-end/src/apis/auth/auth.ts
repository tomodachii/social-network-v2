import type { ILoginPayload, ILoginResponse, ICreateUserPayload, ICreateUserResponse } from "./type";

import { apiPaths } from "@/constants/api-paths";
import { VITE_API_AUTH_SERVICE_URL, VITE_API_USER_SERVICE_URL } from "@/constants/env";
import { defaultAxios } from "@/lib/axios";
import type { IMetadata } from "@/utils/type";

export const loginHandler = (payload: ILoginPayload) => {
  return defaultAxios.post<{ data: ILoginResponse; metadata?: IMetadata }>(
    `${VITE_API_AUTH_SERVICE_URL}/${apiPaths.login}`,
    payload
  );
};

export const createUserHandler = (payload: ICreateUserPayload) => {
  return defaultAxios.post<{ data: ICreateUserResponse; metadata?: IMetadata }>(
    `${VITE_API_USER_SERVICE_URL}/${apiPaths.users}`,
    payload
  );
};
