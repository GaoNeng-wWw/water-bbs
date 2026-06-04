import { Expose } from 'class-transformer';
import { ActionInfo } from './action-info';

export class ActionList {
  @Expose()
  items: ActionInfo[];
  constructor(items: ActionInfo[]) {
    this.items = items;
  }
}
