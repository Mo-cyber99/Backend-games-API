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

exports.patchReview = async (review_id, inc_votes) => {
    if(!inc_votes) {
        return Promise.reject({
            status: 400,
            msg: 'bad request',
        detail: 'Invalid data type'
        });
    }

    const updated = await db.query(`UPDATE reviews SET votes = votes + $1 
    WHERE review_id = $2 RETURNING *;`, [inc_votes, review_id])
    .then((result) => result.rows);

    if(!updated.length) return Promise.reject({ status: 404, msg: "Review not found"});

    return updated;
};

exports.selectUsers = () => {
    return db
    .query("SELECT * FROM users;")
    .then(({ rows: users }) => {
        return users
    });
};