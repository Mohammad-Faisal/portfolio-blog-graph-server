const gql = require("graphql-tag");

const typeDefs = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likesCount: Int!
    }
    type Comment {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
    }
    type Like {
        id: ID!
        username: String
        createdAt: String!
    }
    type User {
        id: ID!
        username: String!
        createdAt: String!
        email: String!
        token: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        getPosts: [Post]
        getUsers: [User]
        getPost(postId: ID!): Post
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String, password: String): User!
        createPost(body: String!): Post!
        deletePost(postId: ID!): String!
        createComment(postId: ID!, body: String!): Comment
        deleteComment(postId: ID!, commentId: ID!): Post
        likePost(postId: ID!): Post
    }
    type Subscription{
        newPost: Post!
    }
`;

module.exports = typeDefs;
