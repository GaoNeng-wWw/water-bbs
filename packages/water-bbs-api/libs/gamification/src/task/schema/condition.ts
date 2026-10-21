import z from 'zod';
import { ValueType, Value } from './data-type';
import { localMap } from '@app/shared';

export const field = z.enum([
  'user.id', // 用户 id
  'user.nick', // 昵称
  'user.avatar', // 头像
  'user.bio', // 个人介绍
  // 'user.banned', // 是否被封禁 (WIP)
  'user.created_at', // 创建时间
  'user.logged',
  // 'user.last_seen_at', // 最后活跃时间 (WIP)
  'user.governance.admin.is', // 是否是管理员 (现在)
  'user.governance.admin.was', // 是否是管理员 (过去)
  'user.governance.bd.is', // 是否是仁慈独裁者 (现在)
  'user.governance.bd.was', // 是否是仁慈独裁者 (过去)
  // 'user.reply_count', // 发帖数
  // 'user.comment_reply_count', // 回复数
  // 'user.days_active', // 活跃天数
  'event.type', // 'post.created' / 'user.liked' ...
  // 'event.target_id', // 目标对象 id
  // 'event.category_id', // 帖子所属版块 id
  'time.now.hour', // 0-23
  'time.now.weekday', // 0-6
  'time.now.day', // 用于每日签到
  'time.now.month', // 1-12
  'time.now.year', // 4位年份
  // 'user.timezone', // 时区
  // 'user.locale', // 语言
]);
export type Fields = z.infer<typeof field>;
export type Operator =
  'lt' | 'lte' | 'eq' | 'neq' | 'gt' | 'gte' | 'in' | 'not_in';
export type WhenExpression = {
  id: string;
  field: string;
  operator: Operator;
  goal: ValueType;
};

export type WhenNode =
  | {
      all: WhenNode[];
    }
  | {
      any: WhenNode[];
    }
  | {
      not: WhenNode[];
    }
  | WhenExpression;

export type TopWhen =
  | {
      all: WhenNode[];
    }
  | {
      any: WhenNode[];
    }
  | {
      not: WhenNode[];
    };
const operator = z.enum([
  'lt',
  'lte',
  'eq',
  'neq',
  'gt',
  'gte',
  'in',
  'not_in',
]);
const whereExpression = z.object({
  id: z.string(),
  field,
  operator,
  goal: Value,
  desc: localMap().optional(),
});
const whenNode: z.ZodType<WhenNode> = z.lazy(() =>
  z.union([
    z.object({ all: z.array(whenNode) }),
    z.object({ any: z.array(whenNode) }),
    z.object({ not: z.array(whenNode) }),
    whereExpression,
  ]),
);
export const topWhen: z.ZodType<TopWhen> = z.lazy(() => {
  return z.union([
    z.object({ all: z.array(whenNode) }),
    z.object({ any: z.array(whenNode) }),
    z.object({ not: z.array(whenNode) }),
  ]);
});
export const when = z.lazy(() => {
  return topWhen;
});
