import { UserReplica } from './user-replica';
import { Repository } from '@lib/shared/ddd-v2';

export interface UserReplicaRepository extends Repository<UserReplica> {
  saveReplica(userReplica: Partial<UserReplica>): Promise<void>;
  updateAvatar(userReplica: Partial<UserReplica>): Promise<UserReplica>;
  updateVersion(userId: string): Promise<void>;
}
