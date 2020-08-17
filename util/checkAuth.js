const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/jwt_key");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
  let errors = {};
  user = null;
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
      if (err) {
        errors.verification = "cannot verify user";
        throw new AuthenticationError("Unauthorized to take this action", {
          errors,
        });
      }
      user = decodedToken;
    });
  }
  return user;
};
