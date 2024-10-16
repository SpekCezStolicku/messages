import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MessagesModule } from './../src/messages/messages.module';

describe('MessagesController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MessagesModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/messages (GET)', () => {
    return request(app.getHttpServer())
      .get('/messages')
      .expect(200)
      .expect([
        { id: '1', content: 'Hello World' },
        { id: '2', content: 'Hello Nest' },
      ]);
  });

  it('/messages/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/messages/1')
      .expect(200)
      .expect({ id: '1', content: 'Hello World' });
  });

  it('/messages/:id (GET) - 404 Not Found', () => {
    return request(app.getHttpServer()).get('/messages/3').expect(404);
  });

  it('/messages (POST)', () => {
    return request(app.getHttpServer())
      .post('/messages')
      .send({ content: 'New Message' })
      .expect(201)
      .expect({ id: '3', content: 'New Message' });
  });

  it('/messages/:id (PUT)', () => {
    return request(app.getHttpServer())
      .put('/messages/1')
      .send({ content: 'Updated Message' })
      .expect(200)
      .expect({ id: '1', content: 'Updated Message' });
  });

  it('/messages/:id (PUT) - 404 Not Found', () => {
    return request(app.getHttpServer())
      .put('/messages/3')
      .send({ content: 'Updated Message' })
      .expect(404);
  });
});
