const { NODE_ENV } = process.env;

const { JWT_SECRET = "secret_password" } = process.env;

module.exports = { JWT_SECRET, NODE_ENV };
