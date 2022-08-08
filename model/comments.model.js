const db = require('../db/connection');

exports.selectComments = (review_id) => {
    return db
    .query(`SELECT * FROM comments WHERE review_id = $1;`, [review_id])
    .then((result) => {
    return result.rows;
    })
    
};

exports.insertComments = ({ author, body }, review_id) => {
    return db
    .query(`INSERT INTO comments (author, body, review_id)
    VALUES ($1, $2, $3)
    RETURNING author, body;`, [author, body, review_id])
    .then((result) => {
        if(!author && body) {
            Promise.reject({
                status: 400,
                msg: 'bad request'
              });
        }
        return result.rows[0];
    });
};

exports.removeComments = (comment_id) => {
    return db
    .query(`DELETE from comments
    WHERE comment_id = $1 RETURNING *;`, [comment_id])
    .then((result) => {
        if(!result.rows.length) {
            Promise.reject({
                status: 400,
                msg: 'bad request'
              });
        }
    });
}