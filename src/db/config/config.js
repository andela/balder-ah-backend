require('babel-register');
const dotenv = require('dotenv');

dotenv.config();

const {
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  LOGGING,
} = process.env;

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT
  },
  test: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    logging: LOGGING === 'true' && true
  },
  production: {
    use_env_variable: 'DATABASE_URL'
  }
};
