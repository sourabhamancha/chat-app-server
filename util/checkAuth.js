const jwt = require("jsonwebtoken");
const { AuthenticationError, PubSub } = require("apollo-server");

const pubsub = new PubSub();

module.exports = (context) => {
  let user = null;
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
  }
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        throw new AuthenticationError("Unauthorized to take this action");
      }
      user = decodedToken;
      user.pubsub = pubsub;
    });
  }
  return user;
};
