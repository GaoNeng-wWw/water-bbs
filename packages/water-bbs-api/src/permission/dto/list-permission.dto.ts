import { Expose } from 'class-transformer';

export class PermissionSummary {
  @Expose()
  id: string;
  @Expose()
  code: string;
  @Expose()
  name: string;
}
