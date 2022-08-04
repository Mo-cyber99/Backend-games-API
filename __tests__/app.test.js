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
        expect(body.review).toMatchObject({
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
      test('This should respond with error 404 when user inputs id of too great a value', () => {
        const REVIEW_ID = 999;
        return request(app).get(`/api/reviews/${REVIEW_ID}`).expect(404).then((res) => {
          expect(res.body.msg).toBe(
            `review with id: ${REVIEW_ID} does not exist`
          );
        })
      });
      test('This endpoint of PATCH 201 responds with the review object after its vote count has been updated', () => {
        const REVIEW_ID = 1;
        return request
        .agent(app)
        .patch(`/api/reviews/${REVIEW_ID}`)
        .send({ inc_votes: -1 })
        .expect(201)
        .then(({ body }) => {
          expect(body.review).toEqual({
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
      test('Should respond with err 400 when given inalid data type', () => {
        const REVIEW_ID = 1;
        return request(app).patch(`/api/reviews/${REVIEW_ID}`).send({ inc_votes: 'ABCCC'}).expect(400).then((res) => {
          expect(res.body.msg).toBe('bad request')
          expect(res.body.detail).toBe('Invalid data type')
        });
      });
      test('This should respond with error 404 when user inputs invalid path', () => {
        return request(app).get('/api/category').expect(404).then(({body}) => {
          expect(body.msg).toBe('Route not found')
        })
      });
      test('This should respond with error 404 when user inputs incorrect endpoint', () => {
        const REVIEW_ID = 999;
        return request(app).patch(`/api/reviews/${REVIEW_ID}`).send({ inc_votes: -10 }).expect(404).then((res) => {
          expect(res.body.msg).toBe(
            `Review not found`
          );
        })
      });
});

describe('/api/users', () => {
  test('This endpoint of GET 200 responds with an array of objects containing key of users', () => {
    return request(app).get('/api/users').expect(200).then(({ body }) => {
      const { users } = body;
      expect(users.length).toBe(4);
      users.forEach((user) => {
          expect(user).toMatchObject({
                  username: expect.any(String),
                  name: expect.any(String),
                  avatar_url: expect.any(String)
              })
      });
    });
  });
  test('This should respond with error 404 when user puts num instead of char', () => {
    return request(app).get('/api/1').expect(404).then(({body}) => {
      expect(body.msg).toBe('Route not found')
    })
  }); 
});

describe('GET /api/reviews/:review_id (comment count)', () => {
  test('This endpoint of GET 200 responds with a comment_count object', () => {
    const REVIEW_ID = 2;
    return request(app)
    .get(`/api/reviews/${REVIEW_ID}`).expect(200).then(({ body }) => {
      expect(body.review[0]).hasOwnProperty('comment_count');
    });
  });
});

describe('GET /api/reviews', () => {
  test('This endpoint of GET 200 responds with an array of review objects', () => {
    return request(app)
      .get('/api/reviews')
      .expect(200)
      .then(({ body }) => {
       expect(body).toBeInstanceOf(Array);
        body.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number)
            }));              
        });
      });
  });
  test('This endpoint tests reviews to ensure they are sorted in order of descending date by default', () => {
    return request(app)
    .get('/api/reviews')
    .expect(200)
    .then(({body}) => {
      expect(body).toBeSortedBy("created_at", {
        descending: true
      });
    });
  });
});

describe('GET /api/reviews/:review_id/comments', () => {
  test('This endpoint of GET 200 responds with comments containing the properties below', () => {
    const REVIEW_ID = 2;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(200)
      .then((result) => {
        result.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              review_id: 2,
              created_at: expect.any(String),
            })
          );
        });
      });
  });
test('This endpoint of GET 200 responds with an array of comments for the given review_id', () => {
  const REVIEW_ID = 2;
  return request(app)
    .get(`/api/reviews/${REVIEW_ID}/comments`)
    .expect(200)
    .then((result) => {
      expect(result.body.comments).toEqual([
        {
          comment_id: 1,
          body: "I loved this game too!",
          votes: 16,
          author: "bainesface",
          review_id: 2,
          created_at: "2017-11-22T12:43:33.389Z",
        },
        {
          comment_id: 4,
          body: "EPIC board game!",
          votes: 16,
          author: "bainesface",
          review_id: 2,
          created_at: "2017-11-22T12:36:03.389Z",
        },
        {
          comment_id: 5,
          body: "Now this is a story all about how, board games turned my life upside down",
          votes: 13,
          author: "mallionaire",
          review_id: 2,
          created_at: "2021-01-18T10:24:05.410Z",
        }
      ]);
    });
  });
  test('This should respond with error 400 when NaN passes as the id in the path', () => {
    return request(app)
      .get('/api/reviews/NotANumber/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('bad request');
      });
  });
  test('This should responds with error 404 when a user inputs incorrect ID', () => {
    const REVIEW_ID = 999;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(`review with id: ${REVIEW_ID} does not exist`);
      });
  });
  test('This endpoint of GET 200 responds with an  empty array if review_id has no comment', () => {
    const REVIEW_ID = 1;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(200)
      .then((result) => {
        expect(result.body.comments).toBeInstanceOf(Array);
        expect(result.body.comments).toHaveLength(0);
      });
  });
})