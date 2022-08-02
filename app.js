const express = require('express');
const { getMessage, getCategories, getReviewById } = require('./controller/index');

const app = express();

app.use(express.json());

app.get('/api', getMessage);
app.get('/api/categories', getCategories);
app.get('/api/reviews/:review_id', getReviewById)

app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });

  app.use((err, req, res, next) => {
        res.status(400).send({msg : 'bad request'})
      })

module.exports = app;