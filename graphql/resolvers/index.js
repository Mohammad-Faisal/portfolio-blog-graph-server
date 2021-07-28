const postsResolver = require("./posts");
const userResolver = require("./users");
const commentResolver = require("./comments");

module.exports = {
    Post: {
        likesCount: (parent) => parent.likes.length,
    },
    Query: {
        ...postsResolver.Query,
        ...userResolver.Query,
    },
    Mutation: {
        ...userResolver.Mutation,
        ...postsResolver.Mutation,
        ...commentResolver.Mutation,
    },
};
