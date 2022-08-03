const { selectCategories, selectReviewById, patchReview } = require('../model/index')

exports.getMessage = (req, res) => {
    res.status(200).send({message : "up and running"});
};

exports.getCategories = (req, res) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send(categories);
    })
    .catch((err) => {
        next(err);
    });
};

exports.getReviewById = (req, res, next) => {
    const {review_id} = req.params;
    selectReviewById(review_id).then((review) => res.status(200).send({review})).catch(next);
  };

exports.updateReview = async (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    patchReview(review_id, inc_votes).then((review) => {
        res.status(201).send({ review });
    })
    .catch(next)
} 