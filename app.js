const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const { getReviewById, updateReview, getReviews} = require('./controller/reviews.controller');
const { getAPI, healthCheck } = require('./controller/api.controller');
const { getCategories } = require('./controller/categories.controller')
const { getComments, postComments, deleteComments } = require('./controller/comments.controller')
const { getUsers, getUsersByUsername, postUsers, deleteUsers } = require('./controller/users.controller')
const {
	handleCustomErrors,
	handlePsqlErrors,
	handleServerErrrors,
} = require('./errorHandlers');


const app = express();

const corsOptions = {
	origin: 'https://backend-games-api.herokuapp.com',
	optionsSuccessStatus: 200 
  }

app.use(cors());

app.use(express.json());

app.use(bodyParser.json())

app.get("/", healthCheck, cors(corsOptions));

app.get('/api', getAPI)

app.get('/api/categories', getCategories);

app.get('/api/reviews/:review_id', getReviewById);
app.patch('/api/reviews/:review_id', updateReview);

app.get('/api/users', getUsers);
app.post('/api/users', postUsers);


app.get('/api/users/:username', getUsersByUsername);
app.delete('/api/users/:username', deleteUsers);

app.get('/api/reviews', getReviews);

app.get('/api/reviews/:review_id/comments', getComments);
app.post('/api/reviews/:review_id/comments', postComments);

app.delete('/api/comments/:comment_id', deleteComments);


app.all('/*', (req, res) => {
    res.status(404).send({ msg: 'Route not found' });
  });

app.use(handleCustomErrors);

app.use(handlePsqlErrors);

app.use(handleServerErrrors);


module.exports = app;