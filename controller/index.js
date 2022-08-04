const comments = require('../db/data/test-data/comments');
const { selectCategories, selectReviewById, patchReview, selectUsers, selectReviews, selectComments, checkCommentsExists } = require('../model/index')

const {checkReviewExists} = require('../model/utils.model')

exports.getMessage = (req, res) => {
    res.status(200).send({message : "up and running"});
};

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send(categories);
    })
    .catch(next);
};

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

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {
        res.status(200).send(reviews)
    })
    .catch(next)
};

exports.getComments = (req, res, next) => {
    const {review_id} = req.params;
    Promise.all([selectReviewById(review_id), selectComments(review_id)])
    .then(([, result]) => {
      res.status(200).send({ comments: result });
    })
    .catch(next)

}