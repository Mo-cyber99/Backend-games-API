const { selectCategories, selectReviewById } = require('../model/index')

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