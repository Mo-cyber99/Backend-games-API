exports.checkReviewsExists = async (review_id) => {
    const dbOutput = await db.query(
        'SELECT * FROM reviews WHERE review_id = $1;',
        [review_id]
      );
    
      if (dbOutput.rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Reviews not found' });
      }
    };