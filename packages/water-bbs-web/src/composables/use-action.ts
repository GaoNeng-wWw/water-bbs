import type { Action } from '@/api';

export type ActionLabelTree = {
  label: string;
  level: number;
};

export const getLabelFromAction = (
  actions: Action[],
  level: number = 0,
): ActionLabelTree[] => {
  let result: ActionLabelTree[] = [];

  for (const action of actions) {
    result.push({
      label: action.type,
      level: level,
    });
    if (!action.children || !action.children.length) {
      continue;
    }
    result = result.concat(getLabelFromAction(action.children, level + 1));
  }

  return result;
};

export const useAction = () => {
  const avaliableActions = [];
  // TODO:从服务端获取action和对应的schema
}