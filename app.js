const express = require('express');
const { getMessage, getCategories, getReviewById, updateReview, getUsers, getReviews, getComments, postComments, deleteComments } = require('./controller/index');

const app = express();

app.use(express.json());

app.get('/api', getMessage);
app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReviewById);
app.patch('/api/reviews/:review_id', updateReview);

app.get('/api/users', getUsers);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id/comments', getComments);
app.post('/api/reviews/:review_id/comments', postComments);

app.delete('/api/comments/:comment_id', deleteComments);


app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });

  //psql errors

  app.use((err, req, res, next) => {
    if (err.code === '22P02')  {
    res.status(400).send({msg : 'bad request', detail : 'Invalid data type'})
    }
    else next(err);
  });

  app.use((err, req, res, next) => {
    if (err.code === '23503') {
      res.status(404).send({msg : 'Route not found'})
    }
    else next(err);
  })

  // custom errors
  app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg, detail: err.detail })
    }
    else next(err);
  });

  app.use((err, req, res, next) => {
    console.log(err, 'ABCCCCC');
    res.status(500).send({msg: 'internal server error'})
  });


module.exports = app;