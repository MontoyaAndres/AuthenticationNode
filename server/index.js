const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const routes = require('./routes/router')

mongoose.Promise = global.Promise
if (process.env.NODE_ENV === 'development') {
  mongoose.connect('mongodb://admin:fcbarcelona123@localhost:27017/ApiAuthenticationTEST?authSource=admin')
} else {
  mongoose.connect('mongodb://admin:fcbarcelona123@localhost:27017/ApiAuthentication?authSource=admin')
}

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.use(routes)

app.listen(3000, () => console.log('let\'s get stared'))
