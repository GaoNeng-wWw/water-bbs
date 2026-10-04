import { ASTNode, parse, evaluate } from '@marcbachmann/cel-js';
import { extract } from './visitor';
import { Injectable } from '@nestjs/common';
import { Field } from '../schema';
import { err, ok } from 'neverthrow';
import { UnknownField } from '../error';
import { FieldService } from '../fields';
import { AccountId } from 'src/auth';
import { Context } from './context';

@Injectable()
export class CelService {
  constructor(private fieldRegistry: FieldService) {}
  path(node: ASTNode) {
    return extract(node);
  }
  async eval(expr: string, accountID: AccountId) {
    const res = parse(expr);
    const path = Array.from(this.path(res.ast));
    const results = path
      .map((path) => Field.safeParse(path))
      .map((result) => {
        return result.success
          ? ok(result.data)
          : err(new UnknownField(result.error.name));
      });
    const error = results.filter((result) => result.isErr());
    if (error.length) {
      return error[0];
    }
    const tasks = results
      .map((res) => (res.isOk() ? res.value : null))
      .filter((value) => !!value)
      .map((field) => {
        return this.fieldRegistry.call(field, accountID).then((res) => {
          return { field, res };
        });
      });
    const tasksResults = await Promise.all(tasks);
    const ctx = new Context();
    for (const result of tasksResults) {
      if (result.res.isErr()) {
        return result.res;
      }
      ctx.put(result.field, result.res.value);
    }
    const accept = Boolean(evaluate(expr, ctx));
    return ok(accept);
  }
}
