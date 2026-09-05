import { MetaEntity } from '@app/shared';
import { type Opt } from '@mikro-orm/core';
import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { type AccountId } from 'src/auth';
import { v7 } from 'uuid';

export type Path = string & { readonly __brand: unique symbol };
export const ROOT_PATH: Path = '/' as Path;
export type CommentId = string & { readonly __brand: unique symbol };
export type ReplyId = string & { readonly __brand: unique symbol };
export const createCommentId = () => v7() as CommentId;
export const createReplyId = () => v7() as ReplyId;

export enum ResourceKind {
  Topic = 'topic',
  TopicReply = 'topic_reply',
}

@Entity()
@Index({ properties: ['resourceKind', 'resourceId', 'removedAt', 'createdAt'] })
@Index({ properties: ['resourceKind', 'resourceId', 'removedAt'] })
export class Comment extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<CommentId> = createCommentId();
  @Property({ type: 'uuid' })
  resourceId: string;
  @Enum(() => ResourceKind)
  resourceKind: ResourceKind;
}

export const joinPath = (parentPath: string, currentId: string): string => {
  const base = parentPath.endsWith('/') ? parentPath : `${parentPath}/`;
  return `${base}${currentId}/`;
};

@Entity()
@Index({ properties: ['commentId', 'removedAt', 'path'] })
@Index({ properties: ['commentId', 'parentId', 'removedAt'] })
export class CommentReply extends MetaEntity {
  @PrimaryKey({ type: 'uuid' })
  id: Opt<ReplyId> = createReplyId();
  @Property({ type: 'text' })
  content: string;
  @Property({ type: 'uuid' })
  commentId: CommentId;
  @Property({ type: 'uuid' })
  creator: AccountId;
  @Property({ type: 'uuid', nullable: true })
  parentId?: Opt<ReplyId>;
  @Property({ type: 'text' })
  path: Path;
  static create(props: {
    content: string;
    creator: AccountId;
    commentId: CommentId;
    parentId?: ReplyId;
    parentPath?: string;
  }): CommentReply {
    const reply = new CommentReply();
    reply.content = props.content;
    reply.creator = props.creator;
    reply.commentId = props.commentId;
    reply.parentId = props.parentId;

    const basePath = props.parentPath || ROOT_PATH;
    reply.path = joinPath(basePath, reply.id) as Path;
    return reply;
  }
}
