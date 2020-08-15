const graphql = require("graphql");
const { GraphQLSchema } = graphql;

const RootQuery = require("./RootQuery");
const Mutation = require("./Mutation");

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
