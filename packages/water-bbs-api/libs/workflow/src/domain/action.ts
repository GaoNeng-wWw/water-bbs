export interface IAction<Schema extends Record<string, any> = any> {
  type: string;
  args: Schema;
  children: IAction<any>[];
}
