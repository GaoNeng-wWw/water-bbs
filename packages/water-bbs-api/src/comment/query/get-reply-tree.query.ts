import { DomainError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Comment, CommentId, CommentReply, ReplyId } from '../comment.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Profile } from 'src/auth';
import { CommentNotFound } from '../error';

type ReplyAuthor = {
  id: string;
  nick: string;
};
type ReplyNodeMeta = {
  nextCursor?: string;
  total: number;
};
type ReplyNode = {
  id: string;
  content: string;
  author: ReplyAuthor;
  expandable: boolean;
};
type ReplyTree = {
  nodes: ReplyNode[];
  meta: ReplyNodeMeta;
};

export class GetReplyTree extends Query<Result<ReplyTree, DomainError>> {
  constructor(
    public readonly commentId: CommentId,
    public readonly cursor?: string,
    public readonly parentId?: ReplyId,
    public readonly size = 20,
  ) {
    super();
  }
}

@QueryHandler(GetReplyTree)
export class GetReplyTreeService implements IQueryHandler<GetReplyTree> {
  constructor(
    private readonly repo: EntityRepository<Comment>,
    private readonly commentReplyRepo: EntityRepository<CommentReply>,
    private readonly em: EntityManager,
  ) {}
  async execute({ commentId, parentId, cursor, size }: GetReplyTree) {
    const comment = await this.repo.findOne({ id: commentId });
    if (!comment) {
      return err(new CommentNotFound(commentId));
    }
    const root = await this.commentReplyRepo.findByCursor({
      where: {
        parentId: parentId ?? null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      first: size,
      after: cursor,
    });
    const creatorId = root.items.map((x) => x.creator);
    const profiles = await this.em.find(
      Profile,
      {
        accountId: {
          $in: creatorId,
        },
      },
      {
        fields: ['accountId', 'nick'],
        filters: [],
      },
    );
    const profileMap = new Map(profiles.map((p) => [p.accountId, p]));
    const parentIds = root.items.map((item) => item.id);
    const children = await this.commentReplyRepo.find(
      {
        parentId: { $in: parentIds },
      },
      { fields: ['parentId'] },
    );
    const childrenSet = new Set(children.map((x) => x.parentId));

    const nodes: ReplyNode[] = [];
    for (const node of root.items) {
      const profile = profileMap.get(node.creator);
      if (!profile) {
        continue;
      }
      const expandable = childrenSet.has(node.id);
      nodes.push({
        id: node.id,
        content: node.content,
        author: {
          id: profile.accountId,
          nick: profile.nick,
        },
        expandable,
      });
    }
    return ok({
      nodes,
      meta: {
        nextCursor: root.endCursor,
        total: root.totalCount,
      },
    } as ReplyTree);
  }
}
