const Post = require("../../models/Post");
const checkAuth = require("../../utils/checkAuthentication");

module.exports = {
    Query: {
        getPosts: async () => {
            try {
                const response = await Post.find();
                return response;
            } catch (err) {
                throw new Error(err);
            }
        },
        getPost: async (_, { postId }) => {
            try {
                const post = await Post.findById(postId);
                if (post) return post;
                throw new Error("Post not found");
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async createPost(_, { body }, context) {
            const user = checkAuth(context);

            const newPost = new Post({
                body,
                user: user.indexOf,
                username: user.username,
                createdAt: new Date().toISOString(),
            });
            const post = await newPost.save();
            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);

            const post = await Post.findById(postId);
            if (!post) {
                throw new Error("Post does not exist");
            }
            if (user.username !== post.username) {
                throw new Error("You don't have permission to delete this post");
            }

            const response = await post.delete();

            return "Post deleted";
        },
        async likePost(_, { postId }, context) {
            const user = checkAuth(context);

            const post = await Post.findById(postId);

            if (post) {
                if (post.likes.find((like) => like.username === user.username)) {
                    post.likes = post.likes.filter((like) => like.username !== user.username);
                } else {
                    post.likes.push({
                        username: user.username,
                        createdAt: new Date().toISOString(),
                    });
                }
                await post.save();
                return post;
            }
        },
    },
};
