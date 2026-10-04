import { serialize } from '@marcbachmann/cel-js';
import type { ASTNode } from '@marcbachmann/cel-js';

type LiteralValue = Extract<ASTNode, { op: 'value' }>['args'];

export interface Visitor {
  enter?: (node: ASTNode | LiteralValue) => boolean | void;
  leave?: (node: ASTNode | LiteralValue) => boolean | void;
}

export const walk = (visitor: Visitor, node: ASTNode): void => {
  const enter = visitor.enter ?? (() => {});
  const leave = visitor.leave ?? (() => {});

  const stack: (ASTNode | LiteralValue)[] = [node];

  const onBinary = (node: ASTNode): void => {
    if (
      node.op === '!=' ||
      node.op === '==' ||
      node.op === 'in' ||
      node.op === '+' ||
      node.op === '-' ||
      node.op === '*' ||
      node.op === '/' ||
      node.op === '%' ||
      node.op === '<' ||
      node.op === '<=' ||
      node.op === '>' ||
      node.op === '>=' ||
      node.op === '&&' ||
      node.op === '||'
    ) {
      stack.unshift(...node.args);
    }
  };

  const onUnary = (node: ASTNode): void => {
    if (node.op !== '!_' && node.op !== '-_') {
      return;
    }
    stack.unshift(node.args);
  };

  const onAccessOperator = (node: ASTNode): void => {
    if (node.op === '.' || node.op === '.?') {
      const [chain, name] = node.args;
      stack.unshift(chain, name);
    }
    if (node.op === '[]' || node.op === '[?]') {
      const [lhs, rhs] = node.args;
      stack.unshift(lhs, rhs);
    }
  };

  const onValue = (node: ASTNode): void => {
    if (node.op === 'value') {
      stack.unshift(node.args);
    }
  };

  const onID = (node: ASTNode): void => {
    if (node.op === 'id') {
      stack.unshift(node.args);
    }
  };

  const onCall = (node: ASTNode): void => {
    if (node.op !== 'call') {
      return;
    }
    const [, args] = node.args;
    args.forEach((arg) => stack.unshift(arg));
  };

  const onRCall = (node: ASTNode): void => {
    if (node.op !== 'rcall') {
      return;
    }
    const [, ...args] = node.args;
    args.flat().forEach((arg) => {
      stack.unshift(arg);
    });
  };

  const onList = (list: ASTNode): void => {
    if (list.op !== 'list') {
      return;
    }
    list.args.forEach((arg) => {
      stack.unshift(arg);
    });
  };

  const onMap = (node: ASTNode): void => {
    if (node.op !== 'map') {
      return;
    }
    node.args.forEach((entry) => {
      const [key, value] = entry;
      stack.unshift(key, value);
    });
  };

  const onTernary = (node: ASTNode): void => {
    if (node.op !== '?:') {
      return;
    }
    stack.unshift(...node.args);
  };

  while (stack.length) {
    const root = stack.shift();
    if (root === undefined) {
      return;
    }

    const abort = enter(root);
    if (!root || typeof root !== 'object' || !('op' in root) || abort) {
      leave(root);
      continue;
    }

    switch (root.op) {
      case '!=':
      case '==':
      case 'in':
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
      case '<':
      case '<=':
      case '>':
      case '>=':
      case '&&':
      case '||':
        onBinary(root);
        break;
      case 'value':
        onValue(root);
        break;
      case 'id':
        onID(root);
        break;
      case '.':
      case '.?':
      case '[]':
      case '[?]':
        onAccessOperator(root);
        break;
      case '!_':
      case '-_':
        onUnary(root);
        break;
      case 'call':
        onCall(root);
        break;
      case 'rcall':
        onRCall(root);
        break;
      case 'list':
        onList(root);
        break;
      case 'map':
        onMap(root);
        break;
      case '?:':
        onTernary(root);
        break;
    }
    leave(root);
  }
};

export const extract = (node: ASTNode) => {
  const paths = new Set<string>([]);

  walk(
    {
      enter: (node) => {
        if (!node || typeof node !== 'object' || !('op' in node)) {
          return;
        }
        if (node.op === 'id') {
          paths.add(serialize(node));
          return true;
        }
        if (
          node.op === '.' ||
          node.op === '.?' ||
          node.op === '[]' ||
          node.op === '[?]'
        ) {
          paths.add(serialize(node));
          return true;
        }
      },
    },
    node,
  );
  return paths;
};
