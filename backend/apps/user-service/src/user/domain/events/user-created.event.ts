import { DomainEvent, DomainEventProps } from '@lib/shared/ddd-v2';

export class UserCreatedEvent extends DomainEvent {
  firstName: string;
  lastName: string;

  constructor(props: DomainEventProps<UserCreatedEvent>) {
    super(props);
    this.firstName = props.firstName;
    this.lastName = props.lastName;
  }
}
