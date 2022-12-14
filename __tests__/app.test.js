const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api", () => {
  test("This endpoint should respond with a json object containing available endpoints on API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((result) => {
        console.log(result.body);
        expect(result.body).toBeInstanceOf(Object);
      });
  });
});

describe("GET /api/categories", () => {
  test("This endpoint should respond with object containing key of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        body.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("This should respond with error 404 when user puts num instead of char", () => {
    return request(app)
      .get("/api/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("This endpoint should respond with a single matching review", () => {
    const REVIEW_ID = 2;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toMatchObject({
          review_id: 2,
          title: "Jenga",
          category: "dexterity",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_body: "Fiddly fun for all the family",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
        });
      });
  });
  test("This should respond with error 400 when user puts char instead of num", () => {
    return request(app)
      .get("/api/reviews/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("This should respond with error 404 when user inputs invalid path", () => {
    return request(app)
      .get("/api/category")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
  test("This should respond with error 404 when user inputs id of too great a value", () => {
    const REVIEW_ID = 999;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          `review with id: ${REVIEW_ID} does not exist`
        );
      });
  });
  test("This endpoint of PATCH 201 responds with the review object after its vote count has been updated", () => {
    const REVIEW_ID = 1;
    return request
      .agent(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send({ inc_votes: -1 })
      .expect(201)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          category: "euro game",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 0,
        });
      });
  });
  test("This should respond with error 400 when user puts char instead of num", () => {
    return request(app)
      .get("/api/reviews/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("Should respond with err 400 when given inalid data type", () => {
    const REVIEW_ID = 1;
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send({ inc_votes: "ABCCC" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
        expect(res.body.detail).toBe("Invalid data type");
      });
  });
  test("This should respond with error 404 when user inputs invalid path", () => {
    return request(app)
      .get("/api/category")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
  test("This should respond with error 404 when user inputs incorrect endpoint", () => {
    const REVIEW_ID = 999;
    return request(app)
      .patch(`/api/reviews/${REVIEW_ID}`)
      .send({ inc_votes: -10 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(`Review not found`);
      });
  });
});

describe("/api/users", () => {
  test("This endpoint of GET 200 responds with an array of objects containing key of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("This should respond with error 404 when user puts num instead of char", () => {
    return request(app)
      .get("/api/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
  test("This endpoint of POST 201 should respond with the posted user", () => {
    const input = {
      username: "Phenomenal Mo",
      name: "Muhammed",
      avatar_url:
        "https://scontent.fman4-1.fna.fbcdn.net/v/t39.30808-1/240653661_1307534729705397_4073721090934236336_n.jpg?stp=cp0_dst-jpg_p80x80&_nc_cat=100&ccb=1-7&_nc_sid=7206a8&_nc_ohc=3YqdnitHZ4YAX9BRki5&_nc_ht=scontent.fman4-1.fna&oh=00_AT-dTZIzrC45Wd4l-3KX_0-Ojz3Z8oMOtVBSS-WYQYA_pQ&oe=630FE48D",
    };
    return request(app)
      .post("/api/users")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.returnUser).toEqual(
          expect.objectContaining({
            username: "Phenomenal Mo",
            name: "Muhammed",
            avatar_url:
              "https://scontent.fman4-1.fna.fbcdn.net/v/t39.30808-1/240653661_1307534729705397_4073721090934236336_n.jpg?stp=cp0_dst-jpg_p80x80&_nc_cat=100&ccb=1-7&_nc_sid=7206a8&_nc_ohc=3YqdnitHZ4YAX9BRki5&_nc_ht=scontent.fman4-1.fna&oh=00_AT-dTZIzrC45Wd4l-3KX_0-Ojz3Z8oMOtVBSS-WYQYA_pQ&oe=630FE48D",
          })
        );
      });
  });
  test("This endpoint of DELETE 204 should delete the comments associated to user", () => {
    return request(app)
      .delete(`/api/users/mallionaire`)
      .expect(204)
      .then(({ body }) => {
        console.log(body);
        expect(body).toEqual({});
      });
  });
});

describe("GET /api/users/:username", () => {
  test("this endpoint of GET 200 responds with objects of username", () => {
    return request(app)
      .get(`/api/users/bainesface`)
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: "bainesface",
          name: "sarah",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        });
      });
  });
});

describe("GET /api/reviews/:review_id (comment count)", () => {
  test("This endpoint of GET 200 responds with a comment_count object", () => {
    const REVIEW_ID = 2;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.review[0]).hasOwnProperty("comment_count");
      });
  });
});

describe("GET /api/reviews", () => {
  test("This endpoint of GET 200 responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
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
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("This endpoint tests reviews to ensure they are sorted in order of descending date by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("This endpoint should accept the following queries - sort_by, which sorts the reviews by votes", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("This endpoint should sort by title", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("This endpoint should sort by owner", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("owner", { descending: true });
      });
  });
  test("This endpoint should be descending as default", () => {
    return request(app)
      .get("/api/reviews?order=desc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("This endpoint should return reviews in asc order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("This endpoint should sort by owner in asc order", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("owner", { ascending: true });
      });
  });
  test("This endpoint should sort by votes in asc order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("votes", {
          ascending: true,
        });
      });
  });
  test("This endpoint should sort reviews by category", () => {
    return request(app)
      .get(`/api/reviews?category=social deduction`)
      .expect(200)
      .then((result) => {
        console.log(result.body);
        expect(result.body).toHaveLength(11);
        result.body.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("This endpoint of GET 200 responds with comments containing the properties below", () => {
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
  test("This endpoint of GET 200 responds with an array of comments for the given review_id", () => {
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
          },
        ]);
      });
  });
  test("This should respond with error 400 when NaN passes as the id in the path", () => {
    return request(app)
      .get("/api/reviews/NotANumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("This should responds with error 404 when a user inputs incorrect ID", () => {
    const REVIEW_ID = 999;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          `review with id: ${REVIEW_ID} does not exist`
        );
      });
  });
  test("This endpoint of GET 200 responds with an  empty array if review_id has no comment", () => {
    const REVIEW_ID = 1;
    return request(app)
      .get(`/api/reviews/${REVIEW_ID}/comments`)
      .expect(200)
      .then((result) => {
        expect(result.body.comments).toBeInstanceOf(Array);
        expect(result.body.comments).toHaveLength(0);
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("This endpoint of POST 201 should respond with the posted comment", () => {
    const REVIEW_ID = 3;
    const newComments = {
      author: "bainesface",
      body: "This is awesome! clap clap clap",
    };
    return request(app)
      .post(`/api/reviews/${REVIEW_ID}/comments`)
      .send(newComments)
      .expect(201)
      .then(({ body }) => {
        expect(body.returnComment).toEqual(
          expect.objectContaining({
            author: "bainesface",
            body: "This is awesome! clap clap clap",
          })
        );
      });
  });
  test("This should respond with error 400 when NaN passes as the id in the path", () => {
    const newComments = {
      author: "bainesface",
      body: "This is awesome! clap clap clap",
    };
    return request(app)
      .post("/api/reviews/NotANumber/comments")
      .send(newComments)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("This should respond with error 400 when  body does not contain both mandatory keys", () => {
    const newComments = {};
    return request(app)
      .post("/api/reviews/NotANumber/comments")
      .send(newComments)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("This should respond with error 404 when a user not in the database tries to post", () => {
    const REVIEW_ID = 3;
    const newComments = {
      author: "NotAnAuthor",
      body: "This is rad bruh",
    };
    return request(app)
      .post(`/api/reviews/${REVIEW_ID}/comments`)
      .send(newComments)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("This endpoint of DELETE 204 should delete the given comment by comment_id", () => {
    const COMMENT_ID = 2;
    return request(app).delete(`/api/comments/${COMMENT_ID}`).expect(204);
  });
  test("This should respond with error 400 when NaN passes as the id in the path", () => {
    return request(app)
      .delete(`/api/comments/NotANumber`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("This endpoint of PATCH 201 responds with the comment object after its vote count has been updated", () => {
    const COMMENT_ID = 1;
    return request
      .agent(app)
      .patch(`/api/comments/${COMMENT_ID}`)
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          body: "I loved this game too!",
          votes: 15,
          author: "bainesface",
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });
});

describe("POST /api/categories", () => {
  test("This endpoint of POST 201 should respond with the posted category", () => {
    const input = {
      slug: "wrestling",
      description: "Simulations of real life wrestling action!",
    };
    return request(app)
      .post("/api/categories")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.category).toEqual(
          expect.objectContaining({
            slug: "wrestling",
            description: "Simulations of real life wrestling action!",
          })
        );
      });
  });
  test("new endpoint added to GET /api", () => {
    request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.apis["POST /api/categories"]).toEqual(expect.any(Object));
      });
  });
});

describe("POST /api/reviews", () => {
  test("This endpoint of POST 201 should respond with the posted review", () => {
    const input = {
      owner: "bainesface",
      review_img_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqPmfWg9IZaZw1ZFOxAKnVSlP5V3-PsnMasw&usqp=CAU",
      title: "Civilization VI",
      review_body: "An epic game of exploartion into new ages!",
      designer: "Sid Meier",
      category: "strategy",
    };
    request(app)
      .post("/api/reviews")
      .send(input)
      .expect(201)
      .then(({ body }) => {
        expect(body.reviews).toEqual(
          expect.objectContaining({
            review_id: 14,
            owner: "bainesface",
            review_img_url:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqPmfWg9IZaZw1ZFOxAKnVSlP5V3-PsnMasw&usqp=CAU",
            title: "Civilization VI",
            review_body: "An epic game of exploartion into new ages!",
            designer: "Sid Meier",
            category: "strategy",
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
});

describe("DELETE /api/reviews/:review_id", () => {
  test("responds with DELETE 204 and no body", () => {
    return request(app).delete("/api/reviews/1").expect(204);
  });
});
