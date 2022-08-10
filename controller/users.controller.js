const { selectUsers } = require('../model/users.model')

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch(next);
};