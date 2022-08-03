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
        });
    });
    test('This should respond with error 404 when user puts num instead of char', () => {
        return request(app).get('/api/1').expect(404).then(({body}) => {
          expect(body.msg).toBe('Route not found')
        })
      });
});

describe('/api/reviews/:review_id', () => {
    test('This endpoint should respond with a single matching review', () => {
        const REVIEW_ID = 2;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 2,
          title: 'Jenga',
          category: 'dexterity',
          designer: 'Leslie Scott',
          owner: 'philippaclaire9',
          review_body: 'Fiddly fun for all the family',
          review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5
        });
      });
    });
    test('This should respond with error 400 when user puts char instead of num', () => {
        return request(app)
          .get('/api/reviews/notAnID')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('bad request');
          });
      });
      test('This should respond with error 404 when user inputs invalid path', () => {
        return request(app).get('/api/category').expect(404).then(({body}) => {
          expect(body.msg).toBe('Route not found')
        })
      });
      test('This endpoint of PATCH 201 responds with the review object after its vote count has been updated', () => {
        const REVIEW_ID = 1;
        return request
        .agent(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send({ inc_votes: -1 })
        .expect(201)
        .then(({ body: { review }}) => {
          expect(review[0]).toEqual({
            review_id: 1,
          title: 'Agricola',
          category: 'euro game',
          designer: 'Uwe Rosenberg',
          owner: 'mallionaire',
          review_body: 'Farmyard fun!',
          review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 0
          })
        })
      });
      test('This should respond with error 400 when user puts char instead of num', () => {
        return request(app)
          .get('/api/reviews/notAnID')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('bad request');
          });
      });
      test('This should respond with error 404 when user inputs invalid path', () => {
        return request(app).get('/api/category').expect(404).then(({body}) => {
          expect(body.msg).toBe('Route not found')
        })
      });
});