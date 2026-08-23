import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MikroORM } from '@mikro-orm/core';
import { E2EAppModule } from 'src/e2e-test-app.modulel';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [E2EAppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    const orm = moduleFixture.get(MikroORM);
    await orm.schema.createDatabase();
    await orm.schema.create();
    await app.init();
  });

  it('user-not-found', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        identType: 'email',
        identValue: 'test@no-reply.com',
        credentialType: 'password',
        credentialValue: 'not-found',
      })
      .expect(404);
  });
  it('Register Success', async () => {
    const { status } = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        identType: 'email',
        identValue: 'test1@no-reply.com',
        credentialType: 'password',
        credentialValue: 'test',
        profile: {
          nick: 'test',
        },
      });
    expect(status).toBe(201);
  });
  afterEach(async () => {
    await app.close();
  });
});
