const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

// models
const { User, Message, Reaction } = require("../models");

module.exports.UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    imageUrl: { type: GraphQLString },
    latestMessage: {
      type: this.MessageType,
    },
  }),
});

module.exports.AuthDataType = new GraphQLObjectType({
  name: "AuthDataType",
  fields: () => ({
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    token: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports.MessageType = new GraphQLObjectType({
  name: "MessageType",
  fields: () => ({
    uuid: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    from: { type: new GraphQLNonNull(GraphQLString) },
    to: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent, _) {
        return parent.createdAt.toISOString();
      },
    },
    reactions: {
      type: new GraphQLList(this.ReactionType),
    },
  }),
});

module.exports.ReactionType = new GraphQLObjectType({
  name: "ReactionType",
  fields: () => ({
    uuid: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve(parent, _) {
        return parent.createdAt.toISOString();
      },
    },
    message: {
      type: this.MessageType,
      async resolve(parent) {
        return await Message.findByPk(parent.messageId);
      },
    },
    user: {
      type: this.UserType,
      async resolve(parent) {
        return await User.findByPk(parent.userId);
      },
    },
  }),
});
