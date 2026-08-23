import { Context, Definition, Handler, Step } from '@app/engine';
import { err, ok, Result } from 'neverthrow';
import z from 'zod';
import { Topic, TopicId } from '../entites';
import { TopicNotFound } from '../errors';

export const removeTopicDef = {
  key: 'topic.remove',
  events: [],
  param: z.object({
    topicId: z.string(),
  }),
  ui: [{ type: 'input', label: 'topicID', textType: 'password' }],
} satisfies Definition;

@Step(removeTopicDef)
export class RemoveTopic implements Handler<typeof removeTopicDef> {
  async handle(
    param: { topicId: string },
    ctx: Context<[]>,
  ): Promise<Result<void, Error>> {
    const { em } = ctx;
    const topic = await em.findOne(Topic, { id: param.topicId as TopicId });
    if (!topic) {
      return err(new TopicNotFound(param.topicId as TopicId));
    }
    topic.remove();
    await em.upsert(Topic, topic);
    return ok();
  }
}
