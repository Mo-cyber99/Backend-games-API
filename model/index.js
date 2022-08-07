const db = require('../db/connection');
const comments = require('../db/data/test-data/comments');

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


exports.selectReviews = (sort_by = "created_at", order = "desc", category) => {
    // const validSortBy = ["created_at", "votes", "owner", "title"];
	// const validOrderBy = ["asc", "desc"];
	// const validCategory = [];

    // let queryStr = 'SELECT reviews.*, COUNT(comments.review_id):: int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id;'

    // // if (!isNaN(category)) {
	// // 	return Promise.reject({ status: 400, msg: 'bad request' });
	// // }

    // if (category) {
    //     validCategory.push(category);
    //     queryStr += `WHERE reviews.category = $1;`
    // }

    // console.log(sort_by, order);
    // if(validSortBy.includes(sort_by) && validOrderBy.includes(order)) {
    //     queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`
    // }

    //     return db
    //     .query(queryStr, validCategory)
    //     .then(({rows}) => {
    //         return rows;
    //     })
    return db
    .query(`SELECT reviews.*, COUNT(comments.review_id):: int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`)   
    .then(({rows: reviews}) => {
        return reviews;
    })
};

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

