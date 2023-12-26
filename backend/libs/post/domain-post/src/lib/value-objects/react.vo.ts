import { AggregateID, ValueObject } from '@lib/shared/ddd-v2';
import { ReactType } from '../post.type';

export interface ReactProps {
  type: ReactType;
  userId: AggregateID;
}

export class ReactVO extends ValueObject<ReactProps> {
  get type(): ReactType {
    return this.props.type;
  }

  get userId(): AggregateID {
    return this.props.userId;
  }

  protected validate(props: ReactProps): void {}
}
