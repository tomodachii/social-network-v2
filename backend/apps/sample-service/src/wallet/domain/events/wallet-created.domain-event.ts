import { DomainEvent, DomainEventProps } from '@lib/shared/ddd';

export class WalletCreatedDomainEvent extends DomainEvent {
  readonly userId: string;

  constructor(props: DomainEventProps<WalletCreatedDomainEvent>) {
    super(props);
  }
}
