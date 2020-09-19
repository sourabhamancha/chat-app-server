const { ApolloServer } = require("apollo-server");
require("dotenv").config();
const schema = require("./schema/schema");
const { sequelize } = require("./models/index");
const server = new ApolloServer({
  schema: schema,
  context: (ctx) => ctx,
  subscriptions: { path: "/" },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Server ready at ${subscriptionsUrl}`);
  sequelize
    .authenticate()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));
});
