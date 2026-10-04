export class Context {
  private context: Record<string, any>;
  constructor() {
    this.context = {};
  }
  put(path: string, value: any) {
    let cur = this.context;
    const pathArray = path.split('.');
    for (let i = 0; i < pathArray.length - 2; i++) {
      const p = pathArray[i];
      if (cur[p]) {
        cur = cur[p];
        continue;
      }
      cur[p] = {};
      cur = cur[p];
    }
    cur[pathArray[pathArray.length - 1]] = value;
  }
  get(path: string) {
    const arr = path.split('.');
    let cur = this.context;
    for (const p of arr) {
      if (cur[p]) {
        cur = cur[p];
        continue;
      }
      return null;
    }
    return cur;
  }
}
