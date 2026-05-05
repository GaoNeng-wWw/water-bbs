export abstract class AppError extends Error {
  constructor(
    message: string,
    code: number = 500,
    public readonly child: Error | null = null,
    public readonly args: Record<string, any> = {},
  ) {
    super(message, { cause: child ?? undefined });
    this.name = this.constructor.name;
  }

  get cause(): Error | undefined {
    return this.child ?? undefined;
  }
}

export class DomainError extends AppError {
  constructor(message: string, child?: Error | null, args?: Record<string, any>) {
    super(message, 400, child, args);
  }
}

export type InfrastructureErrorProp = {
  message: string;
  child?: Error | null;
  args?: Record<string, any>;
};

export class InfrastructureError extends DomainError {
  public readonly code = 500;
  constructor(
    message: string | null,
    child?: Error | null,
    args?: Record<string, any>,
  ) {
    super(message || 'INFRASTRUCTURE_ERROR', child ?? null, args ?? {});
  }
}

export class PersistenceError extends InfrastructureError {
  constructor(originalError: Error | null = null, args: Record<string, any> = {}) {
    const infra = new InfrastructureError('PERSISTENCE_FAILURE', originalError, args);
    super('PERSISTENCE_ERROR', infra, args);
  }
}

export class ApplicationService extends AppError {
  constructor(message: string, code: number = 500, child?: Error | null, args?: Record<string, any>) {
    super(message, code, child, args);
  }
}

export class ApiError extends AppError {
  constructor(message: string, child?: Error | null, args?: Record<string, any>) {
    super(message, 400, child, args);
  }
}
