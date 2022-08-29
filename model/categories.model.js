const db = require('../db/connection');

exports.selectCategories = () => {
    return db
    .query("SELECT * FROM categories;")
    .then(({ rows: categories }) => {
        return categories
    });
};

exports.insertCategories = (newCategory) => {
    const {slug, description} = newCategory;
    return db
    .query(`INSERT INTO categories (slug, description)
    VALUES ($1, $2) RETURNING *;`, [slug, description])
    .then((result) => {
        return result.rows[0];
    });
};