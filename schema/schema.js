const graphql = require("graphql");
const { GraphQLSchema } = graphql;

const RootQuery = require("./RootQuery");
const Mutation = require("./Mutation");
const Subscription = require("./Subscription");

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
  subscription: Subscription,
});
