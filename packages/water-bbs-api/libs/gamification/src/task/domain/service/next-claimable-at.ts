import { addDays, addMonths, addWeeks, addYears, compareAsc } from 'date-fns';
import { PeriodUnit, Task, TaskStatus, UserTask } from 'water-bbs-migration';
import { DomainError, err, ok } from 'water-bbs-shared';

export const nextClaimableAt = (
  task: Task,
  records: UserTask[],
  now: Date = new Date(),
) => {
  if (task.isOnce()) {
    return records.length === 0
      ? ok(new Date()) // 或根据业务返回当前时间
      : err(
          new DomainError('DUPLICATE_COMPLETE_TASK', null, { taskId: task.id }),
        );
  }
  const completedRecords = records
    .filter((r) => r.status === TaskStatus.Completed && r.completedAt != null)
    .sort((a, b) => compareAsc(a.createdAt, b.createdAt));
  if (completedRecords.length === 0) {
    return ok(now);
  }
  const hasUnfinishedClaim = records.some((r) => r.status === TaskStatus.Claim);
  if (hasUnfinishedClaim) {
    return err(
      new DomainError('DUPLICATE_CLAIM_TASK', null, { taskId: task.id }),
    );
  }
  const lastCompleted = completedRecords[completedRecords.length - 1];
  if (!lastCompleted.completedAt) {
    return ok(now);
  }
  let claimableAt: Date;
  switch (task.period.unit) {
    case PeriodUnit.Once:
      return err(
        new DomainError('DUPLICATE_COMPLETE_TASK', null, {
          taskId: task.id,
        }),
      );
    case PeriodUnit.Day:
      claimableAt = addDays(lastCompleted.completedAt, task.period.value);
      break;
    case PeriodUnit.Week:
      claimableAt = addWeeks(lastCompleted.completedAt, task.period.value);
      break;
    case PeriodUnit.Month:
      claimableAt = addMonths(lastCompleted.completedAt, task.period.value);
      break;
    case PeriodUnit.Year:
      claimableAt = addYears(lastCompleted.completedAt, task.period.value);
      break;
  }
  return ok(claimableAt);
};
