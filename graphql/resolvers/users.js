const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')

const {validateRegisterInput , validateLoginInput} = require('../../utils/validation')
const {SECRET_KEY} = require('../../config')

module.exports =  {
    Query: {
        getUsers : async () => {
            try{
                const response = await User.find()
                return response
            }catch(err){
                throw new Error(err)
            }
        }
    },
    Mutation: {
        async register(parent , {registerInput: {username , email , password , confirmPassword}} , context , info) {

            const {valid , errors} = validateRegisterInput(username , email , password , confirmPassword)

            if(!valid){
                throw new UserInputError('Errors' , {
                    errors
                })
            }
            const user = await User.findOne({ username })
            if(user) {
                console.log('user already exists')
                throw new UserInputError('User name is taken' , {
                    errors: {
                        username: 'This username is taken'
                    }
                })
            }

            password  = await bcrypt.hash(password , 12)
            const newUser = new User({
                email , username , password, createdAt: new Date().toISOString()
            })
        
            const res = await newUser.save();
            const token = jwt.sign({
                id: res.id,
                email:res.email,
                username:res.username
            },SECRET_KEY)

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },
        async login(parent , {username , password} , context , info) {

            const {valid , errors} = validateLoginInput(username  , password )

            if(!valid){
                throw new UserInputError('Errors' , {
                    errors
                })
            }
            const user = await User.findOne({ username  })
            if(!user) {
                errors.general = 'User not found';
            
                throw new UserInputError('User does not exists' , {
                    errors
                })
            }

            const match  = await bcrypt.compare(password , user.password)

            if(!match){
                errors.general = 'Password is incorrect';
                throw new UserInputError('Incorrect Password' , {
                    errors
                })
            }

            const token = jwt.sign({
                id: user.id,
                email:user.email,
                username:user.username
            },SECRET_KEY)

            return {
                ...user._doc,
                id: user._id,
                token
            }
        }   
    }
}