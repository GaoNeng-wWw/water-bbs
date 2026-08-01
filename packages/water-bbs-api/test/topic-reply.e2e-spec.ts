import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { MikroORM } from '@mikro-orm/core';
import { Account, Credential, Identifier, Profile } from '../src/auth';
import { Category } from '../src/category';
import { Topic, Reply } from '../src/topic/entites';

describe('TopicController (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;

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
            Category,
            Topic,
            Reply,
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
    await app.init();
    const orm = moduleFixture.get(MikroORM);
    await orm.schema.createDatabase();
    await orm.schema.create();

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

  describe('POST /topic/:categoryId', () => {
    it('should create a topic', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const response = await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Topic',
          content: 'This is a test topic content',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Topic');
      expect(response.body.content).toBe('This is a test topic content');
    });

    it('should create a pinned topic', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Pinned Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const response = await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Pinned Topic',
          content: 'Pinned content',
          pinned: true,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.pinned).toBe(true);
    });

    it('should return error for non-existent category', async () => {
      await request(app.getHttpServer())
        .post('/topic/non-existent-category-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Topic',
          content: 'Content',
        })
        .expect(404);
    });
  });

  describe('GET /topic/:categoryId', () => {
    it('should list topics for a category', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'List Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Topic 1',
          content: 'Content 1',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, size: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return empty list for category with no topics', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Empty Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, size: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body.total).toBe(0);
    });
  });

  describe('PATCH /topic/:topicId', () => {
    it('should update a topic', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Update Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const createResponse = await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          content: 'Original Content',
        })
        .expect(201);

      const topicId = createResponse.body.id;

      const updateResponse = await request(app.getHttpServer())
        .patch(`/topic/${topicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          content: 'Updated Content',
        })
        .expect(200);

      expect(updateResponse.body).toHaveProperty('id');
    });

    it('should update topic pinned status', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Pin Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const createResponse = await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Topic to Pin',
          content: 'Content',
        })
        .expect(201);

      const topicId = createResponse.body.id;

      const updateResponse = await request(app.getHttpServer())
        .patch(`/topic/${topicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Topic to Pin',
          content: 'Content',
          pinned: true,
        })
        .expect(200);

      expect(updateResponse.body).toHaveProperty('id');
    });
  });

  describe('DELETE /topic/:topicId', () => {
    it('should remove a topic', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Remove Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const createResponse = await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Topic to Remove',
          content: 'Content',
        })
        .expect(201);

      const topicId = createResponse.body.id;

      const removeResponse = await request(app.getHttpServer())
        .delete(`/topic/${topicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(removeResponse.body).toHaveProperty('id');
    });
  });

  describe('POST /topic/replies/:topicId', () => {
    it('should create a reply', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Reply Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const topicResponse = await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Topic for Reply',
          content: 'Content',
        })
        .expect(201);

      const topicId = topicResponse.body.id;

      const response = await request(app.getHttpServer())
        .post(`/topic/replies/${topicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'This is a reply',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.content).toBe('This is a reply');
    });

    it('should return error for non-existent topic', async () => {
      await request(app.getHttpServer())
        .post('/topic/replies/non-existent-topic-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply to nothing',
        })
        .expect(404);
    });
  });

  describe('GET /topic/replies/:topicId', () => {
    it('should list replies for a topic', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'List Reply Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const topicResponse = await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Topic for Replies List',
          content: 'Content',
        })
        .expect(201);

      const topicId = topicResponse.body.id;

      await request(app.getHttpServer())
        .post(`/topic/replies/${topicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply 1',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/topic/replies/${topicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply 2',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get(`/topic/replies/${topicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, size: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body.total).toBe(2);
    });

    it('should return empty list for topic with no replies', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'No Reply Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const topicResponse = await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Topic No Replies',
          content: 'Content',
        })
        .expect(201);

      const topicId = topicResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/topic/replies/${topicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, size: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total');
      expect(response.body.total).toBe(0);
    });
  });

  describe('DELETE /topic/replies/:replyId', () => {
    it('should remove a reply', async () => {
      const categoryResponse = await request(app.getHttpServer())
        .post('/category')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Remove Reply Category' })
        .expect(201);

      const categoryId = categoryResponse.body.id;

      const topicResponse = await request(app.getHttpServer())
        .post(`/topic/${categoryId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Topic for Reply Removal',
          content: 'Content',
        })
        .expect(201);

      const topicId = topicResponse.body.id;

      const replyResponse = await request(app.getHttpServer())
        .post(`/topic/replies/${topicId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Reply to remove',
        })
        .expect(201);

      const replyId = replyResponse.body.id;

      const removeResponse = await request(app.getHttpServer())
        .delete(`/topic/replies/${replyId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(removeResponse.body).toHaveProperty('id');
    });
  });

  describe('Authentication', () => {
    it('should reject topic creation without authentication', async () => {
      await request(app.getHttpServer())
        .post('/topic/some-category-id')
        .send({
          title: 'Unauthorized Topic',
          content: 'Content',
        })
        .expect(401);
    });

    it('should reject topic listing without authentication', async () => {
      await request(app.getHttpServer())
        .get('/topic/some-category-id')
        .expect(401);
    });

    it('should reject reply creation without authentication', async () => {
      await request(app.getHttpServer())
        .post('/topic/replies/some-topic-id')
        .send({
          content: 'Unauthorized Reply',
        })
        .expect(401);
    });

    it('should reject reply listing without authentication', async () => {
      await request(app.getHttpServer())
        .get('/topic/replies/some-topic-id')
        .expect(401);
    });

    it('should reject topic deletion without authentication', async () => {
      await request(app.getHttpServer())
        .delete('/topic/some-topic-id')
        .expect(401);
    });

    it('should reject reply deletion without authentication', async () => {
      await request(app.getHttpServer())
        .delete('/topic/replies/some-reply-id')
        .expect(401);
    });

    it('should reject topic update without authentication', async () => {
      await request(app.getHttpServer())
        .patch('/topic/some-topic-id')
        .send({
          title: 'Unauthorized Update',
          content: 'Content',
        })
        .expect(401);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});