import { Definition, Handler, Step } from '@app/engine';
import { EntityRepository } from '@mikro-orm/sqlite';
import { err, ok, Result } from 'neverthrow';
import z from 'zod';
import { Topic, TopicId } from '../entites';
import { InjectRepository } from '@mikro-orm/nestjs';
import { TopicNotFound } from '../errors';
import { HiddenPeriod } from '@app/shared';

export const hideTopicDef = {
  events: [],
  key: 'topic.hide',
  ui: [
    {
      type: 'input',
      textType: 'text',
      label: 'Topic ID',
    },
  ],
  param: z.object({
    topicId: z.uuid(),
    reason: z.string(),
  }),
} satisfies Definition;

@Step(hideTopicDef)
export class HideTopic implements Handler<typeof hideTopicDef> {
  constructor(
    @InjectRepository(Topic)
    private readonly repo: EntityRepository<Topic>,
  ) {}
  async handle(param: {
    topicId: string;
    reason: string;
  }): Promise<Result<void, Error>> {
    const topic = await this.repo.findOne({ id: param.topicId as TopicId });
    if (!topic) {
      return err(new TopicNotFound(param.topicId as TopicId));
    }
    const hidePeriod = HiddenPeriod.create(param.reason);
    if (hidePeriod.isErr()) {
      return hidePeriod;
    }
    topic.hiddenPeriod = hidePeriod.value;
    await this.repo.upsert(topic);
    return ok();
  }
}
