const { selectCategories, selectReviewById, patchReview, selectUsers } = require('../model/index')

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

exports.updateReview = 
(req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    patchReview(review_id, inc_votes).then((newReview) => {
        res.status(201).send({ review: newReview });
    })
    .catch(next)
};

exports.getUsers = (req, res) => {
    selectUsers()
    .then((users) => {
        res.status(200).send(users);
    })
    .catch((err) => {
        next(err);
    });
};