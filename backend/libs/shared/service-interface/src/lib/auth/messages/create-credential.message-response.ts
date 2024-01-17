export interface CreateCredentialMessageResponse {
  readonly token: string;
  readonly refreshToken: string;
  readonly expired: number;
}
