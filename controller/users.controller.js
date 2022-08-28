const { selectUsers, selectUsersByUsername,insertUsers, removeUsers } = require('../model/users.model')

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUsersByUsername = (req, res, next) => {
    const username = req.params.username;
    selectUsersByUsername(username).then((user) => {
        res.status(200).send({ user })
    })
    .catch(next)
}

exports.postUsers = (req, res, next) => {
    const {body} = req;
    insertUsers(body)
    .then((returnUser) => {
        res.status(201).send({ returnUser })
    })
    .catch(next)
};

exports.deleteUsers = (req, res, next) => {
    const username = req.params.username;
    removeUsers(username).then(() => {
        res.status(204).send()
    })
    .catch(next);
};