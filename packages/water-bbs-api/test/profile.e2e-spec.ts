/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { MikroORM } from '@mikro-orm/core';
import { Account, Credential, Identifier, Profile } from '../src/auth';
import { TriggerEntity, WorkflowEntity } from '@app/engine';

describe('ProfileController (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;
  let testAccountId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(MikroOrmModule)
      .useModule(
        MikroOrmModule.forRoot({
          driver: SqliteDriver,
          dbName: ':memory:',
          entities: [
            Account,
            Identifier,
            Credential,
            Profile,
            TriggerEntity,
            WorkflowEntity,
          ],
          pool: {
            min: 0,
            max: 1,
          },
          debug: true,
        }),
      )
      .compile();
    app = moduleFixture.createNestApplication();
    const orm = moduleFixture.get(MikroORM);
    await orm.schema.createDatabase();
    await orm.schema.create();
    await app.init();

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        identType: 'email',
        identValue: 'test@no-reply.com',
        credentialType: 'password',
        credentialValue: 'test123',
        profile: {
          nick: 'testuser',
        },
      })
      .expect(201);

    testAccountId = registerResponse.body.accountId;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        identType: 'email',
        identValue: 'test@no-reply.com',
        credentialType: 'password',
        credentialValue: 'test123',
      })
      .expect(201);

    authToken = loginResponse.body.accessToken;
  });

  describe('GET /profile/:account-id', () => {
    it('should get profile by account id (public endpoint)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/profile/${testAccountId}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', testAccountId);
      expect(response.body).toHaveProperty('nick', 'testuser');
    });

    it('should return 404 for non-existent account', async () => {
      await request(app.getHttpServer())
        .get('/profile/non-existent-id')
        .expect(404);
    });
  });

  describe('GET /profile/:account-id/published-topic', () => {
    it('should get published topics for account', async () => {
      const response = await request(app.getHttpServer())
        .get(`/profile/${testAccountId}/published-topic`)
        .query({ page: 1, size: 10 })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
    });

    it('should reject requests without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/profile/${testAccountId}/published-topic`)
        .query({ page: 1, size: 10 })
        .expect(401);
    });
  });

  describe('PATCH /profile', () => {
    it('should update profile successfully', async () => {
      const response = await request(app.getHttpServer())
        .patch('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nick: 'updatednick',
          bio: 'This is my bio',
        })
        .expect(200);

      const getProfileResponse = await request(app.getHttpServer())
        .get(`/profile/${testAccountId}`)
        .expect(200);

      expect(getProfileResponse.body.nick).toBe('updatednick');
      expect(getProfileResponse.body.bio).toBe('This is my bio');
    });

    it('should update only nick', async () => {
      await request(app.getHttpServer())
        .patch('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          nick: 'newnick',
        })
        .expect(200);

      const getProfileResponse = await request(app.getHttpServer())
        .get(`/profile/${testAccountId}`)
        .expect(200);

      expect(getProfileResponse.body.nick).toBe('newnick');
    });

    it('should update only bio', async () => {
      await request(app.getHttpServer())
        .patch('/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          bio: 'New bio text',
        })
        .expect(200);

      const getProfileResponse = await request(app.getHttpServer())
        .get(`/profile/${testAccountId}`)
        .expect(200);

      expect(getProfileResponse.body.bio).toBe('New bio text');
    });

    it('should reject requests without authentication', async () => {
      await request(app.getHttpServer())
        .patch('/profile')
        .send({
          nick: 'unauthorized',
        })
        .expect(401);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
