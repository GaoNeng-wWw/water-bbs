/// <reference types='@suites/doubles.vitest/unit' />
/// <reference types='@suites/di.nestjs/types' />

interface RequestUser {
  token: { jti: string };
  account: { id: string };
}

// 再扩展到 Request
declare namespace Express {
  interface Request {
    user: RequestUser;
  }
}
