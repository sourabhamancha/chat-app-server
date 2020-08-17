// graphql
const graphql = require("graphql");
const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
} = graphql;
const { AuthenticationError } = require("apollo-server");
// Object Types
const { UserType } = require("./ObjectType");

// models
const { User } = require("../models");

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
  },
});
