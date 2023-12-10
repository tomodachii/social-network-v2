import { RepositoryPort } from '@lib/shared/ddd';
import { WalletEntity } from './wallet.entity';

export interface WalletRepositoryPort extends RepositoryPort<WalletEntity> {
  insert(entity: WalletEntity): Promise<void>;
}
