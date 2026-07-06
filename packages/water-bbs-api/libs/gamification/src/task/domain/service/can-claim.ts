import { Task, UserTask } from 'water-bbs-migration';
import { DomainError, isErr, ok, Result } from 'water-bbs-shared';
import { nextClaimableAt } from './next-claimable-at';
import { isBefore } from 'date-fns';

export const canClaim = (
  task: Task,
  history: UserTask[],
  now: Date = new Date(),
): Result<boolean, DomainError> => {
  const nextResult = nextClaimableAt(task, history, now);
  if (isErr(nextResult)) {
    return nextResult;
  }
  const claimable = !isBefore(now, nextResult.value);
  return ok(claimable);
};
