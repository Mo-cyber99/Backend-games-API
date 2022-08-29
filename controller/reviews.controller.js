const { selectReviewById, patchReview, selectReviews, insertReview, removeReviews } = require('../model/reviews.model')

const { checkIfCategoryExists  } = require('../model/utils.model')

exports.getReviewById = (req, res, next) => {
    const {review_id} = req.params;
    selectReviewById(review_id).then((review) => res.status(200).send({review})).catch(next);
  };

exports.updateReview = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    patchReview(review_id, inc_votes).then((newReview) => {
        res.status(201).send({ review: newReview });
    })
    .catch(next)
};

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category } = req.query;
    const promises = [selectReviews(sort_by, order, category)];

  if (category) {
    promises.push(checkIfCategoryExists(category));
  }
  Promise.all(promises)
  .then(([result]) => {
    res.status(200).send(result);
  })
    // selectReviews()
    // .then((reviews) => {
    //     res.status(200).send(reviews)
    // })
    .catch(next)
};

exports.postReviews = (req, res, next) => {
  const newReviews = req.body;
  insertReview(newReviews).then((reviews) => {
    res.status(201).send({reviews});
  })
  .catch(next)
};

exports.deleteReviews = (req, res, next) => {
  const {review_id} = req.params;
  removeReviews(review_id).then(() => {
    res.status(204).send();
  });
}