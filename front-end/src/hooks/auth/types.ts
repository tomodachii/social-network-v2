export interface IAuthInfoState {
  accessToken?: string;
}

export interface IAuthInfoAction {
  setAccessToken(accessTokenValue?: string): void;
}

// export interface IProfile {
//   sub?: string;
//   email?: string;
//   preferred_username?: string;
//   name?: string;
//   params?: IProfileParams;
//   updated_at?: number;
//   given_name?: string;
//   family_name?: string;
//   nonce?: string;
//   at_hash?: string;
//   sid?: string;
//   aud?: string;
//   exp?: number;
//   iat?: number;
//   iss?: string;
// }

// export interface IProfileParams {
//   "FMS Tenant Id"?: string;
//   DoB?: string;
//   "FMS Fleet"?: string;
//   post_logout_redirect_uri?: string;
//   "FMS Service Type"?: string;
//   Role?: string;
//   Email?: string;
//   "Phone Number"?: string;
//   Department?: string;
//   "Full Name"?: string;
//   "FMS Owner Entity"?: string;
// }

// export interface IPermissionStore {
//   permissions: Set<string>;
//   setPermissions: (permissions: Set<string>) => void;
//   clear: () => void;
// }

// export interface IOneLoginState {
//   accessToken?: string;
//   refreshToken?: string;
//   accountId?: number;
//   createdAt?: string;
//   expiresIn?: number;
//   tokenType?: string;
// }
// export interface IOneLoginAction {
//   setAccessToken(accessTokenValue?: string): void;
//   setRefreshToken(refreshToken?: string): void;
// }
