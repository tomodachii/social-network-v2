import { AggregateID, DomainEvent, DomainEventProps } from '@lib/shared/ddd-v2';

export class UserAvatarUpdatedEvent extends DomainEvent {
  avatarFileId: AggregateID;
  size: number;

  constructor(props: DomainEventProps<UserAvatarUpdatedEvent>) {
    super(props);
    this.avatarFileId = props.avatarFileId;
    this.size = props.size;
  }
}
