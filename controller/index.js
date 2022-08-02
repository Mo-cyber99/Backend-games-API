const { selectCategories } = require('../model/index')

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