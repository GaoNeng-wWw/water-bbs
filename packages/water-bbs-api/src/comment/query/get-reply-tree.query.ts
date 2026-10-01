import { DomainError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Comment, CommentId, CommentReply, ReplyId } from '../comment.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { Profile } from 'src/auth';
import { CommentNotFound } from '../error';
import { InjectRepository } from '@mikro-orm/nestjs';

type ReplyAuthor = {
  id: string;
  nick: string;
};
type ReplyNodeMeta = {
  nextCursor?: string;
  total: number;
};
type ReplyNode<T extends object = Record<string, any>> = {
  id: string;
  content: string;
  author: ReplyAuthor;
  expandable: boolean;
  replyMeta: T;
  hidden: boolean;
  parentHidden: boolean;
};
type ReplyTree<T extends object = Record<string, any>> = {
  nodes: ReplyNode<T>[];
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
    @InjectRepository(Comment)
    private readonly repo: EntityRepository<Comment>,
    @InjectRepository(CommentReply)
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
        commentId,
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
    const hiddenById = new Map();
    const nodes: ReplyNode<Record<string, any>>[] = [];
    for (const node of root.items) {
      if (!hiddenById.has(node.parentId)) {
        const parent = await this.commentReplyRepo.findOne({
          id: node.parentId,
        });
        if (parent) {
          hiddenById.set(parent.id, parent.hidden_period !== null);
        }
      }
      const profile = profileMap.get(node.creator);
      if (!profile) {
        continue;
      }
      const expandable = childrenSet.has(node.id);
      const parentIsHidden = node.parentId
        ? hiddenById.get(node.parentId)
        : false;
      const selfIsHidden = node.hidden_period !== null;
      nodes.push({
        id: node.id,
        content: selfIsHidden ? node.hidden_period?.reason || '' : node.content,
        author: {
          id: profile.accountId,
          nick: profile.nick,
        },
        expandable,
        replyMeta: node.meta as Record<string, any>,
        hidden: selfIsHidden,
        parentHidden: parentIsHidden ?? false,
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
