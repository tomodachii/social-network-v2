import { AggregateRoot, EntityProps, UUID } from '@lib/shared/ddd';
import { RelationshipType } from './relationship.type';

export interface RelationshipProps {
  sourceUserId: UUID;
  targetUserId: UUID;
  relationshipType: RelationshipType;
}

export class RelationshipEntity extends AggregateRoot<UUID, RelationshipProps> {
  protected override _id!: UUID;

  public override validate(): void {
    return;
  }

  constructor(props: EntityProps<UUID, RelationshipProps>) {
    super(props);
  }
}
