import { PaginationQuery } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  GetReplyTotalQuery,
  GetTopicTotalQuery,
  ListReplyQuery,
  ListTopicQuery,
} from './query';
import { CategoryId } from '../category';
import { ListTopicResponse } from './dto/list-topic.dto';
import { ReplyId, TopicId } from './entites';
import { ListReplyResponse } from './dto/list-reply.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { AccountId } from '../auth';
import {
  CreateReplyCommand,
  CreateTopicCommand,
  RemoveReplyCommand,
  RemoveTopicCommand,
  UpdateTopicCommand,
} from './commands';
import { FindCategoryQuery } from '../category';
import { ReplyItem } from './dto/find-reply.dto';
import { TopicInfo, UpdateTopicDto } from './dto';
import { GetTopicQuery } from './query/get-topic.query';
import { GetReply } from './query/get-reply.query';
import { err, ok } from 'neverthrow';
import { CreateTopicDto } from './dto/create-topic.dto';
import { ReplyCanNotRemove, TopicCanNotRemove } from './errors';

@Injectable()
export class TopicService {
  constructor(
    private readonly qb: QueryBus,
    private readonly cb: CommandBus,
  ) {}

  async updateTopic(id: TopicId, actor: AccountId, dto: UpdateTopicDto) {
    const topic = await this.qb.execute(new GetTopicQuery(id));
    if (topic.isErr()) {
      return topic;
    }
    if (topic.value.author.id !== actor) {
      return err(new TopicCanNotRemove());
    }
    const updateTopic = await this.cb.execute(
      new UpdateTopicCommand(id, dto.title, dto.categoryId, dto.pinned),
    );
    if (updateTopic.isErr()) {
      return updateTopic;
    }
    return ok({ id: updateTopic.value });
  }

  async listTopics(categoryId: CategoryId | null, dto: PaginationQuery) {
    const topics = await this.qb.execute(
      new ListTopicQuery(categoryId, dto.page, dto.size),
    );
    const total = await this.qb.execute(new GetTopicTotalQuery(categoryId));
    if (topics.isErr()) {
      return topics;
    }

    if (total.isErr()) {
      return total;
    }
    const data = topics.value.topics.map((topic) => new TopicInfo(topic));
    return ok(new ListTopicResponse(data, total.value));
  }

  async listReply(topicId: TopicId, dto: PaginationQuery) {
    const replies = await this.qb.execute(
      new ListReplyQuery(topicId, dto.page, dto.size),
    );
    const total = await this.qb.execute(new GetReplyTotalQuery(topicId));
    if (replies.isErr()) {
      return replies;
    }

    if (total.isErr()) {
      return total;
    }

    const data = replies.value.replies.map(
      (reply) =>
        new ReplyItem({
          id: reply.id,
          content: reply.content,
          author: {
            id: reply.author.id,
            nick: reply.author.nick,
          },
          createdAt: reply.createdAt,
        }),
    );
    return ok(new ListReplyResponse(data, total.value));
  }

  async createReply(id: TopicId, dto: CreateReplyDto, accountId: AccountId) {
    const topic = await this.qb.execute(new GetTopicQuery(id));
    if (topic.isErr()) {
      return topic;
    }
    const replyId = await this.cb.execute(
      new CreateReplyCommand(id, dto.content, accountId),
    );
    if (replyId.isErr()) {
      return replyId;
    }
    const reply = await this.qb.execute(new GetReply(replyId.value));
    if (reply.isErr()) {
      return reply;
    }
    return reply;
  }
  async createTopic(id: CategoryId, dto: CreateTopicDto, accountId: AccountId) {
    const category = await this.qb.execute(new FindCategoryQuery(id));
    if (category.isErr()) {
      return category;
    }
    const topic = await this.cb.execute(
      new CreateTopicCommand(
        dto.title,
        dto.content,
        accountId,
        category.value.id,
        dto.pinned,
      ),
    );
    if (topic.isErr()) {
      return topic;
    }
    const topicId = topic.value;
    return this.qb.execute(new GetTopicQuery(topicId));
  }

  async removeTopic(id: TopicId, actor: AccountId) {
    const topic = await this.qb.execute(new GetTopicQuery(id));
    if (topic.isErr()) {
      return topic;
    }
    if (topic.value.author.id !== actor) {
      return err(new TopicCanNotRemove());
    }
    await this.cb.execute(new RemoveTopicCommand(id));
    return topic;
  }

  async removeReply(id: ReplyId, actor: AccountId) {
    const reply = await this.qb.execute(new GetReply(id));
    if (reply.isErr()) {
      return reply;
    }
    if (reply.value.author.id !== actor) {
      return err(new ReplyCanNotRemove());
    }
    await this.cb.execute(new RemoveReplyCommand(id));
    return reply;
  }
}
