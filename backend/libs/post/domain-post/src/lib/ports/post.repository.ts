import { Option } from 'oxide.ts';
import { PostEntity } from '../post.entity';
import { Repository } from '@lib/shared/ddd-v2';

export interface PostRepository extends Repository<PostEntity> {
  findPostById(id: string): Promise<Option<PostEntity>>;
  createPost(post: PostEntity): Promise<boolean>;
  savePost(post: PostEntity): Promise<boolean>;
  deletePost(post: PostEntity): Promise<boolean>;
}
