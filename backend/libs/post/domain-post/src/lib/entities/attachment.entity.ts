import {
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from '@lib/shared/common/exceptions';
import { v4 } from 'uuid';
import { HttpStatus } from '@lib/shared/common/api';
import { AttachmentType } from '../post.type';
import { validate as uuidValidate } from 'uuid';
import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID, Entity } from '@lib/shared/ddd-v2';

export interface AttachmentProps {
  extension: string;
  description: string;
  size: number;
  type: AttachmentType;
}

export interface CreateAttachmentProps {
  id: AggregateID;
  extension: string;
  description: string;
  size: number;
  type: AttachmentType;
}

export class AttachmentEntity extends Entity<AttachmentProps, AggregateID> {
  static create(create: CreateAttachmentProps): AttachmentEntity {
    const id = create.id || v4();
    const props: AttachmentProps = {
      ...create,
    };
    return new AttachmentEntity({ id, props });
  }

  get extension(): string {
    return this.props.extension;
  }
  set extension(extension: string) {
    this.props.extension = extension;
  }

  get description(): string {
    return this.props.description;
  }

  set description(description: string) {
    this.props.description = description;
  }

  get size(): number {
    return this.props.size;
  }

  set size(size: number) {
    this.validate();
    this.props.size = size;
  }

  get type(): AttachmentType {
    return this.props.type;
  }

  public validate(): Result<void, Error> {
    if (uuidValidate(this._id) === false) {
      return Err(
        new ArgumentInvalidException(
          'file id must be uuid',
          HttpStatus.BAD_REQUEST
        )
      );
    }
    if (this.props.size > 5012) {
      return Err(
        new ArgumentOutOfRangeException(
          'attachment size must not be greater than 5MB',
          HttpStatus.BAD_REQUEST
        )
      );
    }
    return Ok(undefined);
  }
}
