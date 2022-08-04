const express = require('express');
const { getMessage, getCategories, getReviewById, updateReview, getUsers, getComments } = require('./controller/index');

const app = express();

app.use(express.json());

app.get('/api', getMessage);
app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReviewById);
app.patch('/api/reviews/:review_id', updateReview);

app.get('/api/users', getUsers);

// app.get('/api/reviews/:review_id', getComments);

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
      res.status(404).send({msg : 'not found'})
    }
    else next(err);
  })

  // custom errors
  app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({msg: err.msg})
    }
    else next(err);
  });

  app.use((err, req, res, next) => {
    console.log(err, 'ABCCCCC');
    res.status(500).send({msg: 'internal server error'})
  });


module.exports = app;