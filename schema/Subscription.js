// graphql
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} = graphql;

// Object types
const { MessageType } = require("./ObjectType");

// Apollo
const { AuthenticationError, withFilter } = require("apollo-server");

// modules
const checkAuth = require("../util/checkAuth");

module.exports = new GraphQLObjectType({
  name: "SubscriptionType",
  fields: {
    // subscribe for a new message
    newMessage: {
      type: MessageType,
      subscribe: withFilter(
        (_, __, context) => {
          const user = checkAuth(context);
          if (!user) throw new AuthenticationError("Authentication required");
          const { pubsub } = user;
          return pubsub.asyncIterator(["NEW_MESSAGE"]);
        },
        ({ newMessage }, __, context) => {
          const user = checkAuth(context);
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
  },
});
