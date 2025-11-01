import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Podcast API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/podcasts/search (GET)', () => {
    it('should return podcasts when searching with valid term', () => {
      return request(app.getHttpServer())
        .get('/api/v1/podcasts/search?term=fnjan')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toBeDefined();
          expect(res.body.data.podcasts).toBeDefined();
          expect(Array.isArray(res.body.data.podcasts)).toBe(true);
        });
    });

    it('should return 400 when search term is missing', () => {
      return request(app.getHttpServer())
        .get('/api/v1/podcasts/search')
        .expect(400);
    });

    it('should respect limit parameter', () => {
      return request(app.getHttpServer())
        .get('/api/v1/podcasts/search?term=tech&limit=5')
        .expect(200)
        .expect((res) => {
          expect(res.body.data.limit).toBe(5);
        });
    });
  });

  describe('/api/v1/health (GET)', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBeDefined();
        });
    });
  });
});

