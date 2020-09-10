const { ApolloServer } = require("apollo-server");
const schema = require("./schema/schema");
const { sequelize } = require("./models/index");
const server = new ApolloServer({
  schema: schema,
  context: (ctx) => ctx,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  sequelize
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));
});
