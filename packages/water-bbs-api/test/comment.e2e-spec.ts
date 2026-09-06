import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MikroORM } from '@mikro-orm/core';
import { E2EAppModule } from 'src/e2e-test-app.modulel';
import { Comment } from '../src/comment';

describe('CommentController (e2e)', () => {
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

  describe('POST /comment/:commentId/reply', () => {
    it('should create a comment reply', async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const proposalResponse = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Proposal for Comment',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: {} }],
          proposalEndAt: futureDate,
          content: 'Content for comment test',
        })
        .expect(201);

      const proposalId = proposalResponse.body.id;

      const em = orm.em.fork();
      const comment = await em.findOne(Comment, {
        resourceId: proposalId,
      });
      const commentId = comment!.id;

      const response = await request(app.getHttpServer())
        .post(`/comment/${commentId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a comment reply',
        })
        .expect(201);

      expect(response.body).toHaveProperty('replyId');
      expect(response.body.content).toBe('This is a comment reply');
      expect(response.body).toHaveProperty('creator');
      expect(response.body).toHaveProperty('hasChildren');
    });

    it('should return 404 for non-existent comment', async () => {
      await request(app.getHttpServer())
        .post('/comment/non-existent-comment-id/reply')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply to nothing',
        })
        .expect(404);
    });

    it('should reject reply creation without authentication', async () => {
      await request(app.getHttpServer())
        .post('/comment/some-comment-id/reply')
        .send({
          content: 'Unauthorized reply',
        })
        .expect(401);
    });
  });

  describe('GET /comment/replies', () => {
    it('should list comment replies', async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const proposalResponse = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Proposal for Reply List',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: {} }],
          proposalEndAt: futureDate,
          content: 'Content for reply list test',
        })
        .expect(201);

      const proposalId = proposalResponse.body.id;

      const em = orm.em.fork();
      const comment = await em.findOne(Comment, {
        resourceId: proposalId,
      });
      const commentId = comment!.id;

      await request(app.getHttpServer())
        .post(`/comment/${commentId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply 1',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/comment/${commentId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply 2',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/comment/replies')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ commentId, size: 10, cursor: '' })
        .expect(200);

      expect(response.body).toHaveProperty('nodes');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.nodes)).toBe(true);
      expect(response.body.meta).toHaveProperty('total');
    });

    it('should return empty list for comment with no replies', async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const proposalResponse = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Proposal for Empty Replies',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: {} }],
          proposalEndAt: futureDate,
          content: 'Content for empty replies test',
        })
        .expect(201);

      const proposalId = proposalResponse.body.id;

      const em = orm.em.fork();
      const comment = await em.findOne(Comment, {
        resourceId: proposalId,
      });
      const commentId = comment!.id;

      const response = await request(app.getHttpServer())
        .get('/comment/replies')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ commentId, size: 10, cursor: '' })
        .expect(200);

      expect(response.body).toHaveProperty('nodes');
      expect(response.body).toHaveProperty('meta');
      expect(response.body.nodes.length).toBe(0);
      expect(response.body.meta.total).toBe(0);
    });

    it('should list replies with parentId filter', async () => {
      const futureDate = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const proposalResponse = await request(app.getHttpServer())
        .post('/proposal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Proposal for ParentId Filter',
          kind: 'normal',
          steps: [{ stepName: 'step1', param: {} }],
          proposalEndAt: futureDate,
          content: 'Content for parentId filter test',
        })
        .expect(201);

      const proposalId = proposalResponse.body.id;

      const em = orm.em.fork();
      const comment = await em.findOne(Comment, {
        resourceId: proposalId,
      });
      const commentId = comment!.id;

      const parentReplyResponse = await request(app.getHttpServer())
        .post(`/comment/${commentId}/reply`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Parent reply',
        })
        .expect(201);

      const parentId = parentReplyResponse.body.replyId;

      const response = await request(app.getHttpServer())
        .get('/comment/replies')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ commentId, parentId, size: 10, cursor: '' })
        .expect(200);

      expect(response.body).toHaveProperty('nodes');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.nodes)).toBe(true);
    });

    it('should reject listing without authentication', async () => {
      await request(app.getHttpServer())
        .get('/comment/replies')
        .query({ commentId: 'some-id', size: 10, cursor: '' })
        .expect(401);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
