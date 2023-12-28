import { AggregateID, DomainEvent, DomainEventProps } from '@lib/shared/ddd-v2';

export class UserAvatarUpdatedDomainEvent extends DomainEvent {
  avatarFileId: AggregateID;
  size: number;

  constructor(props: DomainEventProps<UserAvatarUpdatedDomainEvent>) {
    super(props);
    this.avatarFileId = props.avatarFileId;
    this.size = props.size;
  }
}
