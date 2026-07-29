import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { MikroORM } from '@mikro-orm/core';
import { Account, Credential, Identifier, Profile } from '../src/auth';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(MikroOrmModule)
      .useModule(
        MikroOrmModule.forRoot({
          driver: SqliteDriver,
          dbName: ':memory:',
          entities: [Account, Identifier, Credential, Profile],
          pool: {
            min: 0,
            max: 1,
          },
          debug: true,
        }),
      )
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    const orm = moduleFixture.get(MikroORM);
    await orm.schema.createDatabase();
    await orm.schema.create();
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
