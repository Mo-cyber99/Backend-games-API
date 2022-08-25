const db = require('../db/connection');

exports.checkIfCategoryExists = (category) => {
  return db
  .query(`SELECT * FROM categories WHERE slug = $1;`, [category])
  .then((result) => {
      if (!result.rows.length) {
          return Promise.reject({
            status: 404,
            msg: `category: ${category} does not exist`
          });
        }
  })
}