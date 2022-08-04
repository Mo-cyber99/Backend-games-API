const db = require('../db/connection');

exports.selectCategories = () => {
    return db
    .query("SELECT * FROM categories;")
    .then(({ rows: categories }) => {
        return categories
    });
};

exports.selectReviewById = (review_id) => {
    return db
    .query('SELECT reviews.*, COUNT(comments.review_id):: int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;', [review_id])
    .then((result) => {
        if(!result.rows.length) {
            return Promise.reject({
                status:404,
                msg: `review with id: ${review_id} does not exist`
            });
        }
        return result.rows[0];
    });
};

exports.patchReview = (review_id, inc_votes) => {
    return db
    .query(`UPDATE reviews SET votes = votes + $1 
    WHERE review_id = $2 RETURNING *;`, [inc_votes, review_id])
    .then((result) => {
        if(!result.rows.length) {
            return Promise.reject({ status: 404, msg: "Review not found"});
        } else if(!inc_votes) {
                return Promise.reject({
                    status: 400,
                    msg: 'bad request',
                detail: 'Invalid data type'
                });
            }
            return result.rows[0];
    });
};

exports.selectUsers = () => {
    return db
    .query("SELECT * FROM users;")
    .then(({ rows: users }) => {
        return users
    });
};


exports.selectReviews = (sort_by = "created_at", order = "desc") => {
    return db
    .query(`SELECT reviews.*, COUNT(comments.review_id):: int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`)   
    .then(({rows: reviews}) => {
        return reviews;
    })
};