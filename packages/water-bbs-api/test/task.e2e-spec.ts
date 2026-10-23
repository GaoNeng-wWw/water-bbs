import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MikroORM } from '@mikro-orm/core';
import { E2EAppModule } from 'src/e2e-test-app.modulel';
import {
  GovernanceMember,
  MemberKind,
  MemberGrantType,
} from '@app/gamification';
import { AccountId } from 'src/auth';

const validTaskSchema = {
  version: 1,
  name: 'Test Task',
  condition: [
    {
      id: 'cond-1',
      field: 'user.id',
      operator: 'eq',
      goal: 'any-user',
    },
  ],
  reward: [{ use: 'test-reward', args: {} }],
  schedule: {
    kind: 'once',
    timezone: 'Asia/Shanghai',
    startAt: '2025-01-01T00:00:00+08:00',
  },
};

async function seedBDMember(
  em: ReturnType<MikroORM['em']['fork']>,
  accountId: AccountId,
) {
  const member = em.create(GovernanceMember, {
    accountId,
    kind: MemberKind.BD,
    startedAt: new Date(),
    endedAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    grantType: MemberGrantType.Succession,
  });
  em.persist(member);
  await em.flush();
}

async function createTaskAsBD(
  app: INestApplication<App>,
  orm: MikroORM,
  email: string,
  nick: string,
) {
  const em = orm.em.fork();
  const registerResponse = await request(app.getHttpServer())
    .post('/auth/register')
    .send({
      identType: 'email',
      identValue: email,
      credentialType: 'password',
      credentialValue: 'test123',
      profile: { nick },
    })
    .expect(201);

  await seedBDMember(em, registerResponse.body.accountId);

  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send({
      identType: 'email',
      identValue: email,
      credentialType: 'password',
      credentialValue: 'test123',
    })
    .expect(201);

  const bdAuthToken = loginResponse.body.accessToken;

  const createResponse = await request(app.getHttpServer())
    .post('/task')
    .set('Authorization', `Bearer ${bdAuthToken}`)
    .send({ schema: validTaskSchema })
    .expect(201);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return createResponse.body.id;
}

describe('TaskController (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;
  let orm: MikroORM;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [E2EAppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    orm = moduleFixture.get(MikroORM);
    await orm.schema.createDatabase();
    await orm.schema.create();
    await app.init();

    await request(app.getHttpServer())
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

  describe('POST /task', () => {
    it('should create a task when user is BD', async () => {
      const em = orm.em.fork();
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          identType: 'email',
          identValue: 'bd@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
          profile: { nick: 'bduser' },
        })
        .expect(201);

      const bdAccountId = registerResponse.body.accountId;
      await seedBDMember(em, bdAccountId);

      const bdLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identType: 'email',
          identValue: 'bd@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
        })
        .expect(201);

      const bdAuthToken = bdLoginResponse.body.accessToken;

      const response = await request(app.getHttpServer())
        .post('/task')
        .set('Authorization', `Bearer ${bdAuthToken}`)
        .send({ schema: validTaskSchema })
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });

    it('should reject create task without BD role', async () => {
      await request(app.getHttpServer())
        .post('/task')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ schema: validTaskSchema })
        .expect(403);
    });

    it('should reject create task with invalid schema', async () => {
      const em = orm.em.fork();
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          identType: 'email',
          identValue: 'bd2@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
          profile: { nick: 'bduser2' },
        })
        .expect(201);

      const bdAccountId = registerResponse.body.accountId;
      await seedBDMember(em, bdAccountId);

      const bdLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identType: 'email',
          identValue: 'bd2@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
        })
        .expect(201);

      const bdAuthToken = bdLoginResponse.body.accessToken;

      await request(app.getHttpServer())
        .post('/task')
        .set('Authorization', `Bearer ${bdAuthToken}`)
        .send({ schema: { version: 99, name: '' } })
        .expect(500);
    });

    it('should reject create task without authentication', async () => {
      await request(app.getHttpServer())
        .post('/task')
        .send({ schema: validTaskSchema })
        .expect(401);
    });
  });

  describe('DELETE /task/:id', () => {
    it('should remove a task when user is BD', async () => {
      const em = orm.em.fork();
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          identType: 'email',
          identValue: 'bd3@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
          profile: { nick: 'bduser3' },
        })
        .expect(201);

      const bdAccountId = registerResponse.body.accountId;
      await seedBDMember(em, bdAccountId);

      const bdLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identType: 'email',
          identValue: 'bd3@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
        })
        .expect(201);

      const bdAuthToken = bdLoginResponse.body.accessToken;

      const createResponse = await request(app.getHttpServer())
        .post('/task')
        .set('Authorization', `Bearer ${bdAuthToken}`)
        .send({ schema: validTaskSchema })
        .expect(201);

      const taskId = createResponse.body.id;

      const removeResponse = await request(app.getHttpServer())
        .delete(`/task/${taskId}`)
        .set('Authorization', `Bearer ${bdAuthToken}`)
        .expect(200);

      expect(removeResponse.body).toHaveProperty('id', taskId);
    });

    it('should reject remove task without BD role', async () => {
      await request(app.getHttpServer())
        .delete('/task/some-task-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });

    it('should reject remove task without authentication', async () => {
      await request(app.getHttpServer())
        .delete('/task/some-task-id')
        .expect(401);
    });
  });

  describe('GET /task', () => {
    it('should list tasks for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/task')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should reject list tasks without authentication', async () => {
      await request(app.getHttpServer()).get('/task').expect(401);
    });
  });

  describe('GET /task/:id', () => {
    it('should get task detail for authenticated user', async () => {
      const em = orm.em.fork();
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          identType: 'email',
          identValue: 'bd4@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
          profile: { nick: 'bduser4' },
        })
        .expect(201);

      const bdAccountId = registerResponse.body.accountId;
      await seedBDMember(em, bdAccountId);

      const bdLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identType: 'email',
          identValue: 'bd4@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
        })
        .expect(201);

      const bdAuthToken = bdLoginResponse.body.accessToken;

      const createResponse = await request(app.getHttpServer())
        .post('/task')
        .set('Authorization', `Bearer ${bdAuthToken}`)
        .send({ schema: validTaskSchema })
        .expect(201);

      const taskId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/task/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', taskId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('canClaim');
      expect(response.body).toHaveProperty('condition');
    });

    it('should reject get task detail without authentication', async () => {
      await request(app.getHttpServer()).get('/task/some-task-id').expect(401);
    });
  });

  describe('GET /task/:id/progress', () => {
    it('should return 404 when task not claimed', async () => {
      const taskId = await createTaskAsBD(
        app,
        orm,
        'bd5@no-reply.com',
        'bduser5',
      );

      await request(app.getHttpServer())
        .get(`/task/${taskId}/progress`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should get task progress after claiming', async () => {
      const taskId = await createTaskAsBD(
        app,
        orm,
        'bd5b@no-reply.com',
        'bduser5b',
      );

      await request(app.getHttpServer())
        .post(`/task/${taskId}/claim`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/task/${taskId}/progress`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject get task progress without authentication', async () => {
      await request(app.getHttpServer())
        .get('/task/some-task-id/progress')
        .expect(401);
    });
  });

  describe('POST /task/:id/claim', () => {
    it('should claim a task', async () => {
      const em = orm.em.fork();
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          identType: 'email',
          identValue: 'bd6@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
          profile: { nick: 'bduser6' },
        })
        .expect(201);

      const bdAccountId = registerResponse.body.accountId;
      await seedBDMember(em, bdAccountId);

      const bdLoginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identType: 'email',
          identValue: 'bd6@no-reply.com',
          credentialType: 'password',
          credentialValue: 'test123',
        })
        .expect(201);

      const bdAuthToken = bdLoginResponse.body.accessToken;

      const createResponse = await request(app.getHttpServer())
        .post('/task')
        .set('Authorization', `Bearer ${bdAuthToken}`)
        .send({ schema: validTaskSchema })
        .expect(201);

      const taskId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .post(`/task/${taskId}/claim`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('id', taskId);
    });

    it('should reject claim task without authentication', async () => {
      await request(app.getHttpServer())
        .post('/task/some-task-id/claim')
        .expect(401);
    });
  });

  describe('POST /task/:id/cancel', () => {
    it('should return 404 when task not claimed', async () => {
      await request(app.getHttpServer())
        .post('/task/non-existent-task-id/cancel')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should cancel a claimed task', async () => {
      const taskId = await createTaskAsBD(
        app,
        orm,
        'bd7@no-reply.com',
        'bduser7',
      );

      await request(app.getHttpServer())
        .post(`/task/${taskId}/claim`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post(`/task/${taskId}/cancel`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('id', taskId);
    });

    it('should reject cancel task without authentication', async () => {
      await request(app.getHttpServer())
        .post('/task/some-task-id/cancel')
        .expect(401);
    });
  });

  describe('POST /task/:id/deliver', () => {
    it('should return 404 when task not claimed', async () => {
      await request(app.getHttpServer())
        .post('/task/non-existent-task-id/deliver')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject deliver task without authentication', async () => {
      await request(app.getHttpServer())
        .post('/task/some-task-id/deliver')
        .expect(401);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
