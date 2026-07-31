import { Topic, TopicId } from '../entites';
import { Category, CategoryId } from '../../category';
import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { err, ok, Result } from 'neverthrow';
import { DomainError } from '@app/shared';
import { EntityManager } from '@mikro-orm/core';
import { CategoryNotFound, TopicNotFound } from '../errors';

export class UpdateTopicCommand extends Command<Result<TopicId, DomainError>> {
  constructor(
    public readonly id: TopicId,
    public readonly title?: string,
    public readonly categoryId?: CategoryId,
  ) {
    super();
  }
}

@CommandHandler(UpdateTopicCommand)
export class UpdateTopicService implements ICommandHandler<UpdateTopicCommand> {
  constructor(private readonly em: EntityManager) {}
  async execute(
    command: UpdateTopicCommand,
  ): Promise<Result<TopicId, DomainError>> {
    const topic = await this.em.findOne(Topic, {
      id: command.id,
    });
    if (!topic) {
      return err(new TopicNotFound(command.id));
    }
    const category = await this.em.findOne(Category, {
      id: command.categoryId,
    });
    if (command.title) {
      topic.title = command.title;
    }
    if (command.categoryId) {
      if (!category) {
        return err(new CategoryNotFound(command.categoryId));
      }
      topic.categoryId = command.categoryId;
    }

    this.em.persist(topic);
    await this.em.flush();
    return ok(topic.id);
  }
}
