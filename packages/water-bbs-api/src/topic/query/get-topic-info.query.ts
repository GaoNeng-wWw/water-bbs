import { ApplicationError } from '@app/shared';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { Topic, TopicId } from '../entites';
import { EntityManager } from '@mikro-orm/core';
import { TopicNotFound } from '../errors';

export type GetTopicInfoResponse = {
  title?: string;
};

export class GetTopicInfoQuery extends Query<
  Result<GetTopicInfoResponse, ApplicationError>
> {
  constructor(public readonly topicId: TopicId) {
    super();
  }
}

@QueryHandler(GetTopicInfoQuery)
export class GetTopicInfoService implements IQueryHandler<GetTopicInfoQuery> {
  constructor(private readonly em: EntityManager) {}
  async execute(
    query: GetTopicInfoQuery,
  ): Promise<Result<GetTopicInfoResponse, ApplicationError>> {
    const topic = await this.em.findOne(Topic, {
      id: query.topicId
    });
    if (!topic) {
      return err(new TopicNotFound(query.topicId));
    }
    return ok({
      title: topic.title,
    });
  }
}
