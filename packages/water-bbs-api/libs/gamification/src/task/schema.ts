import { z } from 'zod';

const PrimitiveValue = z.discriminatedUnion('type', [
  z.object({ type: z.literal('number'), value: z.number() }),
  z.object({ type: z.literal('string'), value: z.string() }),
  z.object({ type: z.literal('boolean'), value: z.boolean() }),
]);

export const ArrayValue = z.object({
  type: z.literal('array'),
  value: z.array(PrimitiveValue),
});

export const taggedValue = z.discriminatedUnion('type', [
  ...PrimitiveValue.options,
  ArrayValue,
]);

export const UserAccountField = [
  'user.account.banned',
  'user.account.online',
] as const;
export const UserProfileField = [
  'user.profile.nick', // 用户昵称
  'user.profile.avatar', // 用户头像
  'user.profile.bio', // 用户个人简介
  'user.governance.member.list', // 用户往届担任治理成员列表
  'user.governance.member.active', // 用户当前是否是治理成员
  'user.governance.admin.is', // 用户当前是否是 admin
  'user.governance.admin.was', // 用用曾经是否是admin
  'user.governance.bd.is', // 用户当前是否是仁慈独裁者
  'user.governance.bd.was', // 用户曾经是否是仁慈独裁者
  'user.governance.bd.list', // 用户担任仁慈独裁者记录
] as const;
export const UserPostField = ['user.post.total'] as const;

export const Field = z.enum([
  ...UserAccountField,
  ...UserProfileField,
  ...UserPostField,
]);

export const conditionSchema = z.strictObject({
  key: z.string(),
  field: Field,
  operator: z.string(),
  goal: taggedValue,
});

type WhenExpression =
  | { all: WhenExpression[] }
  | { any: WhenExpression[] }
  | z.infer<typeof conditionSchema>;

export const whenSchema: z.ZodType<WhenExpression> = z.lazy(() =>
  z.union([
    z.strictObject({ all: z.array(whenSchema).min(1) }),
    z.strictObject({ any: z.array(whenSchema).min(1) }),
    conditionSchema,
  ]),
);

export const actionItemSchema = z.object({
  name: z.string(),
  param: z.record(z.string(), z.unknown()),
});

export const AvaliableEvents: string[] = [
  'topic.removed',
  'comment.removed',
  'topic.created',
  'comment.recovered',
  'topic.reply-removed',
  'topic.reply-created',
  'auth.mail-registered',
  'gamification.governance.proposal.reject',
  'governance.proposal.created',
  'gamification.governance.proposal.controversy.resolved',
  'gamification.governance.proposal.approve',
  'governance.proposal.emergency.created',
  'gamification.governance.proposal.controversy',
  'gamification.governance.member.revoked',
  'gamification.governance.member.resign',
  'gamification.governance.member.admin-transfered',
] as const;

export const trigger = z.union([
  z.object({
    type: z.literal('event'),
    events: z.array(z.enum(AvaliableEvents)),
  }),
]);

export const rewardSchema = z.object({
  version: z.string(),
  trigger,
  name: z.string(),
  desc: z.string(),
  icon: z.string().optional(),
  when: whenSchema,
  action: z.array(actionItemSchema).min(1),
});

export type IReward = z.infer<typeof rewardSchema>;
export type RewardAction = z.infer<typeof actionItemSchema>;
export type RewardWhenExpression = z.infer<typeof whenSchema>;
export type RewardWhenCondition = z.infer<typeof conditionSchema>;
export type RewardTaggedValue = z.infer<typeof taggedValue>;
export type RewardTaggedArrayValue = z.infer<typeof ArrayValue>;
export type RewardPrimitiveValue = z.infer<typeof PrimitiveValue>;
export type RewardField = z.infer<typeof Field>;