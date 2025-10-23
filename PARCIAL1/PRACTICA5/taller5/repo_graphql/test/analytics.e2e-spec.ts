import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Analytics E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should calculate KPI for a given time range', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            calculateKPI(input: { metric: "sales", timeRange: { start: "2023-01-01", end: "2023-01-31" } }) {
              value
              trend {
                date
                value
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.calculateKPI).toHaveProperty('value');
        expect(res.body.data.calculateKPI.trend).toBeInstanceOf(Array);
      });
  });

  it('should generate an analytical report', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            generateReport(input: { filters: { medicoId: 1, pacienteId: 2 } }) {
              title
              data {
                date
                total
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.generateReport).toHaveProperty('title');
        expect(res.body.data.generateReport.data).toBeInstanceOf(Array);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});