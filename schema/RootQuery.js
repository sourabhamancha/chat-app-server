// graphql
const graphql = require("graphql");
const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
const { UserInputError } = require("apollo-server");
// Object Types
const { UserType, MessageType } = require("./ObjectType");

// models
const { User, Message } = require("../models");

// modules
const checkAuth = require("../util/checkAuth");

// sequelize
const { Op } = require("sequelize");

module.exports = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // get all users
    getUsers: {
      type: new GraphQLList(UserType),
      async resolve(_, __, context) {
        const user = checkAuth(context);
        try {
          const users = await User.findAll({
            where: { username: { [Op.ne]: user.username } },
          });
          return users;
        } catch (err) {
          console.log(err);
        }
      },
    },

    // get messages
    getMessages: {
      type: new GraphQLList(MessageType),
      args: {
        from: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { from }, context) {
        const user = checkAuth(context);
        try {
          const otherUser = await User.findOne({
            where: {
              username: from,
            },
          });
          if (!otherUser) {
            throw new UserInputError("User not found");
          }
          const usernames = [user.username, otherUser.username];
          const messages = await Message.findAll({
            where: {
              from: { [Op.in]: usernames },
              to: { [Op.in]: usernames },
            },
            order: [["createdAt", "DESC"]],
          });
          return messages;
        } catch (err) {
          throw err;
        }
      },
    },
  },
});
