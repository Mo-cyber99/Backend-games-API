const request = require('supertest');
const app = require('../app');
const db = require('../db');

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
            expect(body).toHaveLength(7);
            body.forEach((category) => {
                expect(category).toEqual(
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                );
            });
        });
    });
})