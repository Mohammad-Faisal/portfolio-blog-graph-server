const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGO_ENDPOINT } = require("./config");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (req) => req,
});

mongoose.connect(MONGO_ENDPOINT, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("connected to mongodb");
    server.listen({ port: 5000 }).then((res) => {
        console.log(`server is running ${res.url}`);
    });
});
