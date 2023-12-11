import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { IAuthInfoAction, IAuthInfoState } from "./types";

const useAuthInfo = create<IAuthInfoState & IAuthInfoAction>()(
  persist(
    (set) => {
      return {
        accessToken: undefined,
        setAccessToken(accessTokenValue) {
          set({ accessToken: accessTokenValue });
        },
      };
    },
    {
      name: "social-network-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthInfo;
