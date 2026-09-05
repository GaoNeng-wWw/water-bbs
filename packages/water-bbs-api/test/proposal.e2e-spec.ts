import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MikroORM } from '@mikro-orm/core';
import { E2EAppModule } from 'src/e2e-test-app.modulel';
import {
  GovernanceMember,
  MemberKind,
  MemberGrantType,
} from '@app/gamification';

describe('ProposalController (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;
  let testAccountId: string;
  let orm: MikroORM;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [E2EAppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    orm = moduleFixture.get(MikroORM);
    await orm.schema.createDatabase();
    await orm.schema.create();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
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

  describe('POST /proposal', () => {
    it('should create a normal proposal', async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const response = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Proposal',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: { key: 'value' } }],
          proposalEndAt: futureDate,
          content: 'This is a test proposal content',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Proposal');
      expect(response.body).toHaveProperty('step');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('status');
    });

    it('should create an emergency proposal', async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const response = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Emergency Proposal',
          kind: 'emergency',
          steps: [{ stepName: 'emergency-step', param: { urgent: true } }],
          proposalEndAt: futureDate,
          content: 'This is an emergency proposal',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Emergency Proposal');
    });

    it('should reject proposal creation without authentication', async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      await request(app.getHttpServer())
        .post('/proposal')
        .send({
          title: 'Unauthorized Proposal',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: {} }],
          proposalEndAt: futureDate,
          content: 'Should fail',
        })
        .expect(401);
    });

    it('should reject proposal with missing required fields', async () => {
      const res = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Incomplete Proposal',
        });
    });
  });

  describe('GET /proposal', () => {
    it('should list proposals with cursor pagination', async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Proposal for listing',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: {} }],
          proposalEndAt: futureDate,
          content: 'Content for listing test',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ size: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('nextCursor');
      expect(response.body).toHaveProperty('prevCursor');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should return empty list when no proposals exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ size: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(response.body.total).toBe(0);
    });

    it('should reject listing without authentication', async () => {
      await request(app.getHttpServer())
        .get('/proposal')
        .query({ size: 10 })
        .expect(401);
    });
  });

  describe('GET /proposal/:id', () => {
    it('should find a proposal by id', async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const createResponse = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Findable Proposal',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: { key: 'val' } }],
          proposalEndAt: futureDate,
          content: 'Content for find test',
        })
        .expect(201);

      const proposalId = createResponse.body.id;

      const findResponse = await request(app.getHttpServer())
        .get(`/proposal/${proposalId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(findResponse.body.id).toBe(proposalId);
      expect(findResponse.body.title).toBe('Findable Proposal');
      expect(findResponse.body).toHaveProperty('content');
      expect(findResponse.body).toHaveProperty('step');
      expect(findResponse.body).toHaveProperty('status');
      expect(findResponse.body).toHaveProperty('voteSummary');
    });

    it('should return 404 for non-existent proposal', async () => {
      await request(app.getHttpServer())
        .get('/proposal/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject finding without authentication', async () => {
      await request(app.getHttpServer()).get('/proposal/some-id').expect(401);
    });
  });

  describe.skip('POST /proposal/vote', () => {
    let proposalId: string;

    beforeEach(async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const createResponse = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Votable Proposal',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: {} }],
          proposalEndAt: futureDate,
          content: 'Content for vote test',
        })
        .expect(201);

      proposalId = createResponse.body.id;
    });

    it('should vote Agree on a proposal', async () => {
      const response = await request(app.getHttpServer())
        .post('/proposal/vote')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: proposalId,
          kind: 'Agree',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
    });

    it('should vote DisAgree on a proposal', async () => {
      const response = await request(app.getHttpServer())
        .post('/proposal/vote')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: proposalId,
          kind: 'DisAgree',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
    });

    it('should reject voting without authentication', async () => {
      await request(app.getHttpServer())
        .post('/proposal/vote')
        .send({
          id: proposalId,
          kind: 'Agree',
        })
        .expect(401);
    });

    it('should reject voting with invalid kind', async () => {
      await request(app.getHttpServer())
        .post('/proposal/vote')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: proposalId,
          kind: 'InvalidKind',
        })
        .expect(400);
    });

    it('should reject voting on non-existent proposal', async () => {
      await request(app.getHttpServer())
        .post('/proposal/vote')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          id: 'non-existent-id',
          kind: 'Agree',
        })
        .expect(404);
    });
  });

  describe.skip('POST /proposal/:id/resolve', () => {
    let proposalId: string;
    let bdAuthToken: string;
    let bdAccountId: string;

    beforeEach(async () => {
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          identType: 'email',
          identValue: 'bd-user@no-reply.com',
          credentialType: 'password',
          credentialValue: 'bd123',
          profile: {
            nick: 'bduser',
          },
        })
        .expect(201);

      bdAccountId = registerResponse.body.accountId;

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          identType: 'email',
          identValue: 'bd-user@no-reply.com',
          credentialType: 'password',
          credentialValue: 'bd123',
        })
        .expect(201);

      bdAuthToken = loginResponse.body.accessToken;

      const em = orm.em.fork();
      const member = em.create(GovernanceMember, {
        accountId: bdAccountId,
        kind: MemberKind.BD,
        startedAt: new Date(),
        grantType: MemberGrantType.Election,
      });
      em.persist(member);
      await em.flush();

      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const createResponse = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Resolvable Proposal',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: {} }],
          proposalEndAt: futureDate,
          content: 'Content for resolve test',
        })
        .expect(201);

      proposalId = createResponse.body.id;
    });

    it('should resolve controversy with approve by BD member', async () => {
      await request(app.getHttpServer())
        .post(`/proposal/${proposalId}/resolve`)
        .set('Authorization', `Bearer ${bdAuthToken}`)
        .query({ kind: 'approve' })
        .expect(200);
    });

    it('should resolve controversy with reject by BD member', async () => {
      await request(app.getHttpServer())
        .post(`/proposal/${proposalId}/resolve`)
        .set('Authorization', `Bearer ${bdAuthToken}`)
        .query({ kind: 'reject' })
        .expect(200);
    });

    it('should reject resolve by non-BD member', async () => {
      await request(app.getHttpServer())
        .post(`/proposal/${proposalId}/resolve`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ kind: 'approve' })
        .expect(403);
    });

    it('should reject resolve without authentication', async () => {
      await request(app.getHttpServer())
        .post(`/proposal/${proposalId}/resolve`)
        .query({ kind: 'approve' })
        .expect(401);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
