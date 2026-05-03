export abstract class AppError extends Error {
  abstract readonly code: number;
  abstract readonly message: string;
  abstract readonly chain: Error | null;
  abstract readonly args: Record<string, any>;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class DomainError extends AppError {
  public readonly code: number = 400;
  constructor(
    public readonly message: string,
    public readonly chain: Error | null = null,
    public readonly args: Record<string, any> = {},
  ) {
    super(message);
  }
}

export class ApiError extends AppError {
  constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly chain: Error | null = null,
    public readonly args: Record<string, any> = {},
  ) {
    super(message);
  }
}

export class PersistenceError extends AppError {
  public readonly code: number = 500;
  public readonly message: string = 'PERSISTENCE_ERROR';
  constructor(
    public readonly chain: Error | null = null,
    public readonly args: Record<string, any> = {},
  ) {
    super('PERSISTENCE_ERROR');
  }
}
