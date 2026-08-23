import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { MikroORM, EntityManager } from '@mikro-orm/core';
import {
  Transaction,
  TransactionStatus,
  SYSTEM_WALLET_ID,
} from '@app/gamification';
import { E2EAppModule } from 'src/e2e-test-app.modulel';

describe('WalletController (e2e)', () => {
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

  async function seedTransactions(em: EntityManager, count: number) {
    for (let i = 0; i < count; i++) {
      const tx = em.create(Transaction, {
        from: SYSTEM_WALLET_ID,
        to: testAccountId as any,
        amount: String((i + 1) * 100),
        status: TransactionStatus.Success,
        detail: `Seed transaction ${i + 1}`,
      });
      em.persist(tx);
    }
    await em.flush();
  }

  describe('GET /wallet/balance', () => {
    it('should get wallet balance for authenticated user', async () => {
      const response = await request(app.getHttpServer())
        .get('/wallet/balance')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('balance');
      expect(response.body.balance).toBe('0');
    });

    it('should reject requests without authentication', async () => {
      await request(app.getHttpServer()).get('/wallet/balance').expect(401);
    });
  });

  describe('GET /wallet/transactions', () => {
    it('should return empty list when no transactions exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/wallet/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 10 })
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('nextCursor');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should paginate transactions with cursor', async () => {
      const em = orm.em.fork();
      await seedTransactions(em, 8);

      const page1 = await request(app.getHttpServer())
        .get('/wallet/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 3 })
        .expect(200);

      expect(page1.body.items).toHaveLength(3);
      expect(page1.body).toHaveProperty('nextCursor');
      expect(page1.body.nextCursor).toBeTruthy();

      const page2 = await request(app.getHttpServer())
        .get('/wallet/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 3, lastId: page1.body.nextCursor })
        .expect(200);

      expect(page2.body.items).toHaveLength(3);

      const page3 = await request(app.getHttpServer())
        .get('/wallet/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ limit: 3, lastId: page2.body.nextCursor })
        .expect(200);

      expect(page3.body.items).toHaveLength(3);
    });

    it('should reject requests without authentication', async () => {
      await request(app.getHttpServer())
        .get('/wallet/transactions')
        .query({ limit: 10 })
        .expect(401);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
