const Post = require("../../models/Post");
const { UserInputError } = require("apollo-server");
const checkAuthentication = require("../../utils/checkAuthentication");

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const user = checkAuthentication(context);
            if (body.trim() === "") {
                throw new UserInputError("Empty comment is not allowed", {
                    errors: {
                        body: "comment must not be empty",
                    },
                });
            }

            const post = await Post.findById(postId);

            if (post) {
                console.log(post);
                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString(),
                });

                await post.save();
                return post;
            } else {
                throw new UserInputError("Post not found", {
                    errors: {
                        body: "Invalid postId",
                    },
                });
            }
        },
        deleteComment: async (_, { postId, commentId }, context) => {
            const user = checkAuthentication(context);

            const post = await Post.findById(postId);

            console.log(commentId, postId);
            if (post) {
                const index = post.comments.find(
                    (comment) => comment.id === commentId
                );

                if (index) {
                    const comment = post.comments[index];
                    post.comments.splice(index, 1);
                } else {
                    throw new UserInputError("Action not allowed", {
                        errors: {
                            body: "This comment doesn't belong to this user",
                        },
                    });
                }
                await post.save();
                return post;
            } else {
                throw new UserInputError("Post not found", {
                    errors: {
                        body: "Invalid postId",
                    },
                });
            }
        },
    },
};
