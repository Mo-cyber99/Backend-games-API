const db = require('../db/connection');

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

exports.selectReviews = (sort_by = "created_at", order = "desc", category) => {
    const validSortBy = ["created_at", "votes", "owner", "title"];
	const validOrderBy = ["asc", "desc"];
	const validCategory = [];

    let queryStr = 'SELECT reviews.*, COUNT(comments.review_id):: int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id ';

    if (!isNaN(category)) {
		return Promise.reject({ status: 400, msg: 'bad request' });
	}

    if (category) {
        console.log(category);
        validCategory.push(category);
        queryStr += ` WHERE reviews.category = $1 `
    }

    if(validSortBy.includes(sort_by) && validOrderBy.includes(order)) {
        queryStr += `GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`
    }

        return db
        .query(queryStr, validCategory)
        .then((result) => {
            return result.rows;
        })
    // return db
    // .query(`SELECT reviews.*, COUNT(comments.review_id):: int AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`)   
    // .then(({rows: reviews}) => {
    //     return reviews;
    // })
};

exports.insertReview = (newReviews) => {
    const {owner, review_img_url, title, review_body, designer, category} = newReviews;
    return db
    .query(`INSERT INTO reviews (owner, review_img_url, title, review_body, designer, category, votes, created_at) 
    VALUES ($1, $2, $3, $4, $5, $6, 0, $7) RETURNING *;`, [owner, review_img_url, title, review_body,designer, category, new Date])
    .then((result) => {
        if(!result.rows.length) {
            return Promise.reject({ status: 404, msg: "Review not found"});
        }
        return result.rows[0];
    })
};

exports.removeReviews = (review_id) => {
    return db
    .query(`DELETE FROM reviews WHERE review_id = $1 RETURNING *;`, [review_id])
    .then((result) => {
        if(!result.rows.length) {
            Promise.reject({
                status: 400,
                msg: 'bad request'
              });
        }
    }); 
};