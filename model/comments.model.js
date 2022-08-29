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
    .query(`INSERT INTO comments (author, body, review_id, votes, created_at)
    VALUES ($1, $2, $3, 0, $4)
    RETURNING *;`, [author, body, review_id, new Date])
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

exports.updateCommentVote = (comment_id, updateComment) => {
    const {inc_votes} = updateComment;
    return db
    .query(`UPDATE comments SET votes = votes + $1
    WHERE comment_id = $2 RETURNING *;`, [inc_votes, comment_id])
    .then((result) => {
        if(!result.rows.length) {
            return Promise.reject({ status: 404, msg: "not found"});
        } else if(!inc_votes) {
                return Promise.reject({
                    status: 400,
                    msg: 'bad request',
                detail: 'Invalid data type'
                });
            }
            return result.rows[0];
    });
}