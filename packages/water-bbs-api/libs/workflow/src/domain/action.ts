export interface IAction {
  type: string;
  args: Record<string, any>;
  children: IAction[];
}
