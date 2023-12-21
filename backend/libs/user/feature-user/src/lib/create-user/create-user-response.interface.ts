export interface CreateUserResponse {
  token: string;
  refreshToken: string;
  expired: number;
  userId: string;
}
