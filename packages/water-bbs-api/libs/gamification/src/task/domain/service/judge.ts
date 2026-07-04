import { differenceInMinutes } from 'date-fns';
import { Task, UserTask } from 'water-bbs-migration';
import { PeriodUnit } from 'water-bbs-migration';
import { DomainError, err, ok } from 'water-bbs-shared';

export const canComplete = (
  targetTask: Task,
  targetHistory: UserTask[],
  now: Date = new Date(),
  limit: number = 15,
) => {
  if (targetTask.period.unit === PeriodUnit.Once) {
    if (!targetHistory.length) {
      return ok(true);
    }
    return err(new DomainError('DUPLICATE_COMPLETED'));
  }
  const lastComplete = targetHistory.at(-1);
  if (!lastComplete) {
    return ok(true);
  }
  const diff = differenceInMinutes(lastComplete.completedAt, now);
  if (diff <= limit) {
    return ok(true);
  }
  return err(new DomainError('PREMATURE_COMPLETION'));
};
