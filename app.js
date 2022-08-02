const express = require('express');
const { getMessage, getCategories } = require('./controller/index');

const app = express();

app.use(express.json());

app.get('/api', getMessage);
app.get('/api/categories', getCategories);

module.exports = app;