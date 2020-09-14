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
const { User, Message, Reaction } = require("../models");

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
          // get users, except logged user, from users table with required fields
          let users = await User.findAll({
            attributes: ["username", "email", "imageUrl"],
            where: { username: { [Op.ne]: user.username } },
          });

          // get all messages either sent or recieved by logged user
          const allUserMessages = await Message.findAll({
            where: {
              [Op.or]: [{ from: user.username }, { to: user.username }],
            },
            order: [["createdAt", "DESC"]],
          });

          // map every other user with the latest message either sent ot recieved
          users = users.map((otherUser) => {
            const latestMessage = allUserMessages.find(
              (m) =>
                m.from === otherUser.username || m.to === otherUser.username
            );
            otherUser.latestMessage = latestMessage;
            return otherUser;
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
            include: [{ model: Reaction, as: "reactions" }],
          });
          return messages;
        } catch (err) {
          throw err;
        }
      },
    },
  },
});
