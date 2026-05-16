import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { vi } from 'vitest';
import { MikroORM } from '@mikro-orm/core';
import { resetDatabase } from './utils/reset-database';

vi.mock('@app/configure', async () => {
  const actual = await vi.importActual('@app/configure');
  return {
    ...actual,
    yaml: vi.fn(() => ({
      database: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        dbName: 'water-bbs-test',
      },
      redis: {
        type: 'single',
        host: 'localhost',
        port: 6379,
      },
    })),
  };
});

describe('Account E2E', () => {
  let app: INestApplication<App>;
  let orm: MikroORM;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    orm = moduleFixture.get(MikroORM);
    await resetDatabase(orm);
    await app.init();
  });
  beforeEach(async () => {
    await resetDatabase(orm);
  });
  afterAll(async () => {
    await orm.close();
    await app.close();
  });

  it('/register (POST)', async () => {
    await request(app.getHttpServer())
      .post('/account/register')
      .send({
        username: 'test',
        password: 'test',
        ident_type: 'Email',
        ident_value: 'test@example.com',
      })
      .expect(201);
  });
  it('/profile (GET)', async () => {
    const resp = await request(app.getHttpServer())
      .post('/account/register')
      .send({
        username: 'test',
        password: 'test',
        ident_type: 'Email',
        ident_value: 'test@example.com',
      })
      .expect(201);
    const loginResp = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        ident_type: 'Email',
        ident_value: 'test@example.com',
        cert_value: 'test',
      })
      .expect(201);
    const accessToken = loginResp.body.accessToken;
    const accountId = resp.body.account_id;
    await request(app.getHttpServer())
      .get(`/account/profile/${accountId}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(200);
  });
  it('/profile (PATCH)', async () => {
    const res = await request(app.getHttpServer())
      .post('/account/register')
      .send({
        username: 'test',
        password: 'test',
        ident_type: 'Email',
        ident_value: 'test@example.com',
      })
      .expect(201);
    const loginResp = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        ident_type: 'Email',
        ident_value: 'test@example.com',
        cert_value: 'test',
      })
      .expect(201);
    const accessToken = loginResp.body.accessToken;
    const accountId = res.body.account_id;
    await request(app.getHttpServer())
      .patch(`/account/profile`)
      .send({ username: 'test2' })
      .auth(accessToken, { type: 'bearer' })
      .expect(200);
    const getProfileResp = await request(app.getHttpServer())
      .get(`/account/profile/${accountId}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(200);
    expect(getProfileResp.body.username).toBe('test2');
  });
  it.skip('DELTE /', async () => {
    // TODO: 发布领域事件通知删除session
    const res = await request(app.getHttpServer())
      .post('/account/register')
      .send({
        username: 'test',
        password: 'test',
        ident_type: 'Email',
        ident_value: 'test@example.com',
      })
      .expect(201);
    const loginResp = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        ident_type: 'Email',
        ident_value: 'test@example.com',
        cert_value: 'test',
      })
      .expect(201);
    const accessToken = loginResp.body.accessToken;
    await request(app.getHttpServer())
      .delete(`/account`)
      .auth(accessToken, { type: 'bearer' })
      .expect(200);
    const accountId = res.body.account_id;
    await request(app.getHttpServer())
      .get(`/account/profile/${accountId}`)
      .auth(accessToken, { type: 'bearer' })
      .expect(401);
  });
});
