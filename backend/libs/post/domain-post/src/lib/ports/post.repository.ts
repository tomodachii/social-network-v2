import { Option, Result } from 'oxide.ts';
import { AttachmentEntity, CommentEntity } from '../entities';
import { PostEntity } from '../post.entity';
import { Repository } from '@lib/shared/ddd-v2';

export interface PostRepository extends Repository<PostEntity> {
  findPostById(id: string): Promise<Option<PostEntity>>;
  createPost(post: PostEntity): Promise<boolean>;
  savePost(post: PostEntity): Promise<boolean>;
  deletePost(post: PostEntity): Promise<boolean>;
  findCommentById(id: string): Promise<CommentEntity>;
  checkExistAttachmentsByIds(ids: string[]): Promise<boolean>;
}
