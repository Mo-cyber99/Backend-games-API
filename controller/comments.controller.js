const { selectComments, insertComments, removeComments } = require('../model/comments.model')
const { selectReviewById } = require ('../model/reviews.model')

exports.getComments = (req, res, next) => {
    const {review_id} = req.params;
    Promise.all([selectReviewById(review_id), selectComments(review_id)])
    .then(([, result]) => {
      res.status(200).send({ comments: result });
    })
    .catch(next)
};

exports.postComments = (req, res, next) => {
    const {body} = req;
    const {review_id} = req.params;
    insertComments(body, review_id)
    .then((returnComment) => {
        res.status(201).send({ returnComment });
    })
    .catch(next)
};

exports.deleteComments = (req, res, next) => {
    const { comment_id } = req.params;
    removeComments(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch(next)
}