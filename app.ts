import cookieParser = require('cookie-parser')
import express = require('express')
import createError = require('http-errors')
import logger = require('morgan')
import path = require('path')
import jwtAuth from './jwt'


import indexRouter from './routers/index.controller'
import usersRouter from './routers/users.controller'
import loginRouter from './routers/login.controller'


const app = express()

// view engine setup
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

app.use(jwtAuth)
// 设置允许跨域访问该服务
app.all('/api/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
})


app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.listen(3000, '127.0.0.1')
