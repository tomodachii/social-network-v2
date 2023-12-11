export interface ILoginPayload {
  email?: string;
  password?: string;
}

export interface ILoginResponse {
  token: string;
}

export interface ICreateUserPayload {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  birthDay?: string;
  gender?: string;
  phoneNumber?: string;
}

export interface ICreateUserResponse {}
