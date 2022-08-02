const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');

beforeEach(() => seed(testData));

afterAll(() => {
    if (db.end) db.end();
});

describe('GET /api', () => {
    test('The endpoint should respond with a json object containing a message key', () => {
        return request(app).get('/api').expect(200).then((body) => {
            body = {"message" : "up and running"}
        })
    });
});

describe('GET /api/categories', () => {
    test('This endpoint should respond with object containing key of categories', () => {
        return request(app).get('/api/categories').expect(200).then(({ body }) => {
            expect(body).toBeInstanceOf(Array);
            body.forEach((category) => {
                expect(category).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                );
            });
            console.log(body);
        });
    });
    test('This should respond with error 404 when user puts num instead of char', () => {
        return request(app).get('/api/1').expect(404).then(({body}) => {
          expect(body.msg).toBe('Route not found')
        })
      });
})