import { AggregateID, DomainEvent, DomainEventProps } from '@lib/shared/ddd-v2';

export class UserBioImageUpdateDomainEvent extends DomainEvent {
  readonly fileId: AggregateID;
  readonly size: number;
  readonly extension: string;

  constructor(props: DomainEventProps<UserBioImageUpdateDomainEvent>) {
    super(props);
    this.fileId = props.fileId;
    this.size = props.size;
    this.extension = props.extension;
  }
}
