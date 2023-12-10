import { HttpStatus } from '@lib/shared/common/api';
import { Exception } from '@lib/shared/common/exceptions';

export class UserAlreadyExistsError extends Exception {
  static readonly message = 'UserEntity already exists';

  public readonly code = 'USER.ALREADY_EXISTS';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserAlreadyExistsError.message, HttpStatus.CONFLICT, cause, metadata);
  }
}

export class UserNotFoundError extends Exception {
  static readonly message = 'UserEntity not found';

  public readonly code = 'USER.NOT_FOUND';

  constructor(cause?: Error, metadata?: unknown) {
    super(UserNotFoundError.message, HttpStatus.NOT_FOUND, cause, metadata);
  }
}
