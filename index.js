'use strict'

const { cookieName } = require('coins-deposit-box')
const good = require('good')
const hapi = require('hapi')
const pify = require('pify')

const api = require('./api.js')
const formatResponse = require('./format-response.js')

const server = new hapi.Server({
  debug: {
    request: '*'
  }
})

const register = pify(server.register.bind(server))

server.connection({
  host: 'localhost',
  port: 8800,
  routes: {
    cors: {
      credentials: true,
      origin: ['*']
    }
  }
})

server.state(cookieName, {
  domain: 'localhost',
  isHttpOnly: false,
  isSameSite: false,
  isSecure: false,
  path: '/'
})

register({
  register: good,
  options: {
    reporters: {
      myConsoleReporter: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ log: '*', response: '*' }]
      }, {
        module: 'good-console'
      }, 'stdout']
    }
  }
})
  .then(() => register({ register: formatResponse }))
  .then(() => register(
    { register: api },
    {
      routes: {
        prefix: '/api/v1.3.0'
      }
    }
  ))
  .then(() => pify(server.start.bind(server)()))
  .then(() => console.log(`Server running at: ${server.info.uri}`))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

module.exports = server
