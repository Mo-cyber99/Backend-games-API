const db = require('../db/connection');

exports.selectUsers = () => {
    return db
    .query("SELECT * FROM users;")
    .then(({ rows: users }) => {
        return users
    });
};

exports.selectUsersByUsername = (username) => {
    return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
        if(!result.rows.length) {
            Promise.reject({
                status: 400,
                msg: 'bad request'
              });
        }
        return result.rows[0];
    });
}

exports.insertUsers = ({username, name, avatar_url}) => {
    return db
    .query(`INSERT INTO users (username, name, avatar_url) 
    VALUES ($1, $2, $3)
    RETURNING username, name, avatar_url`, [username, name, avatar_url])
    .then((result) => {
        if(!username) {
            Promise.reject({
                status: 400,
                msg: 'bad request'
              });
        }
        return result.rows[0];
    });
};

exports.removeUsers = (username) => {
    return db
    .query(`DELETE FROM users WHERE username = $1 RETURNING *;`, [username])
    .then((result) => {
        if(!result.rows.length) {
            Promise.reject({
                status: 400,
                msg: 'bad request'
              });
        }
    });
}