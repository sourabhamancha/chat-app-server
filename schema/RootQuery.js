// graphql
const graphql = require("graphql");
const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// Object Types
const { UserType } = require("./ObjectType");

// models
const { User } = require("../models");

module.exports = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // get all users
    getUsers: {
      type: new GraphQLList(UserType),
      async resolve() {
        try {
          const users = await User.findAll();
          return users;
        } catch (err) {
          console.log(err);
        }
      },
    },
  },
});
