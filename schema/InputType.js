// graphql
const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLInputObjectType,
} = graphql;

module.exports.RegisterUserInputType = new GraphQLInputObjectType({
  name: "RegisterUserInputType",
  description: "Input payload for creating a new user",
  fields: () => ({
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    confirmPassword: { type: new GraphQLNonNull(GraphQLString) },
    imageUrl: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports.LoginUserInputType = new GraphQLInputObjectType({
  name: "LoginUserInputType",
  description: "Input payload for logging in an existing user",
  fields: () => ({
    username: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports.SendMessageInputType = new GraphQLInputObjectType({
  name: "SendMessageInputType",
  description: "Input payload for sending a new message",
  fields: () => ({
    to: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});
