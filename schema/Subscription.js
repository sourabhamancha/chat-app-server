// graphql
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
} = graphql;

// Object types
const { MessageType, ReactionType } = require("./ObjectType");

// Apollo
const { AuthenticationError, withFilter } = require("apollo-server");

// modules
const checkAuth = require("../util/checkAuth");

module.exports = new GraphQLObjectType({
  name: "SubscriptionType",
  fields: {
    // subscription for a new message
    newMessage: {
      type: MessageType,
      subscribe: withFilter(
        (_, __, context) => {
          const user = checkAuth(context);
          if (!user) throw new AuthenticationError("Authentication required");
          const { pubsub } = user;
          return pubsub.asyncIterator("NEW_MESSAGE");
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

    // subscription for a new reaction
    newReaction: {
      type: ReactionType,
      subscribe: withFilter(
        (_, __, context) => {
          const user = checkAuth(context);
          if (!user) throw new AuthenticationError("Authentication required");
          const { pubsub } = user;
          return pubsub.asyncIterator("NEW_REACTION");
        },
        async ({ newReaction }, __, context) => {
          const user = checkAuth(context);
          const message = await newReaction.getMessage();
          if (message.from === user.username || message.to === user.username) {
            return true;
          }
          return false;
        }
      ),
    },
  },
});
