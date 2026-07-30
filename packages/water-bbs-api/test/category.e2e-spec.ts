import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import { MikroORM } from '@mikro-orm/core';
import { Category } from '../src/category';

describe('CategoryController (e2e)', () => {
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
          entities: [Category],
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

  it('should list categories', async () => {
    await request(app.getHttpServer()).get('/category').expect(200);
  });

  it('should create a category', async () => {
    const response = await request(app.getHttpServer())
      .post('/category')
      .send({
        name: 'Test Category',
        color: '#FF0000',
        icon: 'test-icon',
        pin: true,
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Category');
    expect(response.body.color).toBe('#FF0000');
    expect(response.body.icon).toBe('test-icon');
    expect(response.body.pined).toBe(true);
  });

  it('should create a category with minimal data', async () => {
    const response = await request(app.getHttpServer())
      .post('/category')
      .send({
        name: 'Minimal Category',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Minimal Category');
  });

  it('should find a category by id', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/category')
      .send({
        name: 'Findable Category',
      })
      .expect(201);

    const categoryId = createResponse.body.id;

    const findResponse = await request(app.getHttpServer())
      .get(`/category/${categoryId}`)
      .expect(200);

    expect(findResponse.body.id).toBe(categoryId);
    expect(findResponse.body.name).toBe('Findable Category');
  });

  it('should update a category', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/category')
      .send({
        name: 'Original Name',
        color: '#00FF00',
      })
      .expect(201);

    const categoryId = createResponse.body.id;

    const updateResponse = await request(app.getHttpServer())
      .patch(`/category/${categoryId}`)
      .send({
        name: 'Updated Name',
        color: '#0000FF',
      })
      .expect(200);

    expect(updateResponse.body.id).toBe(categoryId);
    expect(updateResponse.body.name).toBe('Updated Name');
    expect(updateResponse.body.color).toBe('#0000FF');
  });

  it('should remove a category', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/category')
      .send({
        name: 'Removable Category',
      })
      .expect(201);

    const categoryId = createResponse.body.id;

    const removeResponse = await request(app.getHttpServer())
      .delete(`/category/${categoryId}`)
      .expect(200);
    expect(removeResponse.body).toHaveProperty('id', categoryId);
  });

  it('should recover a removed category', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/category')
      .send({
        name: 'Recoverable Category',
      })
      .expect(201);

    const categoryId = createResponse.body.id;

    await request(app.getHttpServer())
      .delete(`/category/${categoryId}`)
      .expect(200);

    const recoverResponse = await request(app.getHttpServer())
      .patch(`/category/recover/${categoryId}`)
      .expect(200);

    expect(recoverResponse.body.id).toBe(categoryId);
    expect(recoverResponse.body.removedAt).toBeNull();
  });

  afterEach(async () => {
    await app.close();
  });
});
