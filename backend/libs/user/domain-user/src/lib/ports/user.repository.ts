import { Repository } from '@lib/shared/ddd-v2';
import { UserEntity } from '../user.entity';
import { Option } from 'oxide.ts';

export interface UserRepository extends Repository<UserEntity> {
  insertOne(user: UserEntity): Promise<boolean>;
  findById(userId: string): Promise<Option<UserEntity>>;
  // updateAvatar(user: UserEntity): Promise<boolean>;
  // updateCover(user: UserEntity): Promise<boolean>;
  updateUserProfile(user: UserEntity): Promise<boolean>;
  saveUser(user: UserEntity): Promise<Option<UserEntity>>;
}
