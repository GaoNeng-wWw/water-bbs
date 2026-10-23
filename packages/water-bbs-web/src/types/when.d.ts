export type Operator =
  'lt' | 'lte' | 'eq' | 'neq' | 'gt' | 'gte' | 'in' | 'not_in';
export type WhenExpression = {
  id: string;
  field: string;
  operator: Operator;
  goal: ValueType;
  desc?: Record<string, string>;
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
