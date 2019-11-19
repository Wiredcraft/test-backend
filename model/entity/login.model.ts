import mongoose = require('mongoose')
import { mongoClient } from '../db'

const loginSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    accessPosToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    }
},
    { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const Login = mongoClient.model(`Login`, loginSchema, 'login')

export { Login, loginSchema }
