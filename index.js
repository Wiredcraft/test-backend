'use strict'

const app = require('./app')

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log('App is running at http://localhost:%d', port)
})

module.exports = server
