export interface CreateCredentialMessageRequest {
  readonly email: string;
  readonly phoneNumber: string;
  readonly password: string;
  readonly fullName: string;
  readonly userId: string;
}
