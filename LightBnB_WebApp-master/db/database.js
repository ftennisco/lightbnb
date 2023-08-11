const { Pool } = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 123,
  host: 'localhost',
  database: 'lightbnb'
});


const properties = require("./json/properties.json");
const users = require("./json/users.json");

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool.query('SELECT * FROM users WHERE email = $1', [email])
    .then(data => {
      return data.rows[0]
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      throw error;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool.query('SELECT * FROM users WHERE id = $1', [id])
    .then(data => {
      return data.rows[0];
    })
    .catch(error => {
      console.error('Error fetching user:', error);
      throw error;
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  const { name, email, password } = user;
  const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';

  return pool.query(query, [name, email, password])
    .then(data => {
      return data.rows[0];
    })
    .catch(error => {
      console.error('Error adding user:', error);
      throw error;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  const query = `
  SELECT
    reservations.id,
    properties.title,
    reservations.start_date,
    properties.cost_per_night,
    AVG(property_reviews.rating) AS average_rating
  FROM
    reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE
    reservations.guest_id = $1
  GROUP BY
    reservations.id,
    properties.title,
    reservations.start_date,
    properties.cost_per_night
  ORDER BY
    reservations.start_date
  LIMIT $2;`;

  return pool.query(query, [guest_id, limit])
    .then(data => {
      return data.rows;
    })
    .catch(error => {
      console.error('Error fetching reservations:', error);
      throw error;
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = (options, limit = 10) => {
  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1 = 1
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length}\n`;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length}\n`;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `AND cost_per_night >= $${queryParams.length}\n`;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `AND cost_per_night <= $${queryParams.length}\n`;
  }

  queryString += `GROUP BY properties.id \n`

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `HAVING avg(rating) >= $${queryParams.length}\n`;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch(error => {
      console.error('Error fetching properties:', error);
      throw error;
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const {
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  } = property;

  const query = `
    INSERT INTO properties (
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  const values = [
    owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms
  ];

  return pool.query(query, values)
    .then(data => {
      return data.rows[0];
    })
    .catch(error => {
      console.error('Error adding property:', error);
      throw error;
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
