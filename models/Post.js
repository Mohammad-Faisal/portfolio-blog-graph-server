const {model , Schema} = require('mongoose');

const postSchema = new Schema({
    username:String,
    body:String,
    comments:[
        {
            body:String,
            username:String,
            createdAt:String
        }
    ],
    likes: [
        {
            username:String,
            createdAt:String
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    createdAt:String
})

module.exports = model('Post' , postSchema)