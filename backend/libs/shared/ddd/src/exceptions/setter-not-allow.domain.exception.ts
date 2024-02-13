import { Exception } from '@lib/shared/common/exceptions';

export class SetterNotAllowDomainException extends Exception {
  override code = 'SETTER_NOT_ALLOW';
}
