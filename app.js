const express = require('express')
const morgan = require('morgan')
const userRoutes = require('./routes/userRoutes')
const app = express()

app.use(express.json())
app.use(morgan('combined'))
//below is where we tell the users to go - we want the users to go to /users
app.use('/users', userRoutes)

module.exports = app