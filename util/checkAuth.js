const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/jwt_key");

module.exports = (context) => {
  let errors = {};
  let user = null;
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split("Bearer ")[1];
    jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
      if (err) {
        errors.verification = "cannot verify user";
      }
      user = decodedToken;
    });
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
    user,
  };
};
