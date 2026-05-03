import { Aggregate } from 'types-ddd';
import { PermissionId } from '../vo';

export type PermissionProp = {
  id: PermissionId;
  code: string;
  name: string;
};

export class Permission extends Aggregate<PermissionProp> {
  constructor(prop: PermissionProp) {
    super(prop);
  }
}
