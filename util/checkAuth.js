const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/jwt_key");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
  let user = null;
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
  }
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
      if (err) {
        throw new AuthenticationError("Unauthorized to take this action");
      }
      user = decodedToken;
    });
  }
  return user;
};
