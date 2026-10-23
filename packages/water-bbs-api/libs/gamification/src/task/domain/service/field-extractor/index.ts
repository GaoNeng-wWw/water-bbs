import { WhenNode } from '@app/gamification/task/schema';

export const fieldExtractor = (when: WhenNode): string[] => {
  if ('all' in when) {
    return when.all.flatMap((cond) => fieldExtractor(cond));
  }
  if ('any' in when) {
    return when.any.flatMap((cond) => fieldExtractor(cond));
  }
  if ('not' in when) {
    return when.not.flatMap((cond) => fieldExtractor(cond));
  }
  return [when.field];
};
