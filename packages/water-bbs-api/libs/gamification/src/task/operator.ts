import {
  RewardPrimitiveValue,
  RewardTaggedArrayValue,
  RewardTaggedValue,
} from './schema';

export const lt = (lhs: RewardTaggedValue) => {
  return (rhs: RewardTaggedValue) => {
    return { type: 'boolean', value: lhs.value < rhs.value };
  };
};
export const lte = (lhs: RewardTaggedValue) => {
  return (rhs: RewardTaggedValue) => {
    return { type: 'boolean', value: lhs.value <= rhs.value };
  };
};
export const gt = (lhs: RewardTaggedValue) => {
  return (rhs: RewardTaggedValue) => {
    return { type: 'boolean', value: lhs.value > rhs.value };
  };
};
export const gte = (lhs: RewardTaggedValue) => {
  return (rhs: RewardTaggedValue) => {
    return { type: 'boolean', value: lhs.value >= rhs.value };
  };
};
export const eq = (lhs: RewardTaggedValue) => {
  return (rhs: RewardTaggedValue) => {
    return { type: 'boolean', value: lhs.value === rhs.value };
  };
};
export const neq = (lhs: RewardTaggedValue) => {
  return (rhs: RewardTaggedValue) => {
    return { type: 'boolean', value: lhs.value !== rhs.value };
  };
};
export const has = (lhs: RewardTaggedArrayValue) => {
  return (rhs: RewardPrimitiveValue) => {
    return {
      type: 'boolean',
      value: lhs.value.some((taggedValue) => taggedValue.value === rhs.value),
    };
  };
};
