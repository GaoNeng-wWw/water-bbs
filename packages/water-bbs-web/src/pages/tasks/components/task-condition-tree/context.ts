import { createContext } from 'reka-ui';
import type { ComputedRef } from 'vue';

export type Variable = Record<string, any>;

export type ConditionTreeContext = {
  variable: ComputedRef<Variable>;
};

export const [useTaskConditionContext, provideTaskConditionContext] = createContext<ConditionTreeContext>('task-condition');
