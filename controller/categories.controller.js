const { selectCategories, insertCategories } = require('../model/categories.model')

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send(categories);
    })
    .catch(next);
}

exports.postCategories = (req, res, next) => {
    newCategory = req.body;
    insertCategories(newCategory).then((category) => {
        res.status(201).send({category});
    })
    .catch(next);
}