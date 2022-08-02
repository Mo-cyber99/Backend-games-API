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
    .query('SELECT * FROM reviews WHERE REVIEW_ID = $1;', [review_id])
    .then((result) => result.rows[0]);
};