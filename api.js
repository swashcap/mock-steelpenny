'use strict'

const { cookieName } = require('coins-deposit-box')
const atob = require('atob')
const coinstacConfig = require('/coins/config/dbmap.json').coinstac
const moment = require('moment')

const getUserResponse = (username, coinstac = false) => {
  const response = {
    algorithm: 'sha256',
    expireTime: Date.now() + 24 * 60 * 60,
    id: '94af21e3-a581-4b1a-a8b0-180d81e3ad85',
    issueTime: Date.now(),
    key: 'b09945f7-b768-47ee-b003-59e0a1b5c76a',
    studyRoles: {},
    user: {
      acctExpDate: moment().add(1, 'year').format(),
      activeFlag: 'Y',
      dateAdded: moment().format(),
      email: 'nidev@mrn.org',
      emailUnsubscribed: false,
      isSiteAdmin: 'Y',
      label: username,
      passwordExpDate: moment().add(1, 'year').format(),
      passwordResetExpiration: null, // TODO: populate
      passwordResetKey: null,
      passwordResetSessionId: null, // TODO: populate
      siteId: '7',
      username
    },
    username
  }

  if (coinstac) {
    response.coinstac = coinstacConfig
  }

  return response
}

const formatResponse = response => ({
  data: Array.isArray(response) ? response : [response],
  error: null,
  stats: {}
})

module.exports.register = (server, options, next) => {
  server.route({
    handler (request, reply) {
      return reply('Not implemented').code(501)
    },
    method: 'GET',
    path: '/'
  })

  server.route({
    handler (request, reply) {
      return reply('Not implemented').code(501)
    },
    method: 'GET',
    path: '/auth/cookies/{id}'
  })

  server.route({
    handler (request, reply) {
      return reply(formatResponse('Clear for takeoff'))
    },
    method: 'OPTIONS',
    path: '/auth/keys/{id}'
  })

  server.route({
    handler (request, reply) {
      const { payload: { coinstac, username } } = request

      return reply(
        formatResponse(getUserResponse(atob(username), coinstac))
      )
        .state(cookieName, 'test-cookie-value')
        .code(201)
    },
    method: 'POST',
    path: '/auth/keys'
  })

  server.route({
    handler (request, reply) {
      return reply(formatResponse(''))
    },
    method: 'DELETE',
    path: '/auth/keys/{id}'
  })

  server.route({
    handler (request, reply) {
      return reply(formatResponse('email sent')).code(202)
    },
    method: 'POST',
    path: '/auth/reset-request'
  })

  server.route({
    handler (request, reply) {
      return reply(formatResponse('password reset')).code(201)
    },
    method: 'POST',
    path: '/auth/reset'
  })

  server.route({
    handler (request, reply) {
      reply(formatResponse({
        description: 'Test site',
        label: 'testsite',
        siteConfig: {
          administratorContact: 'test@test.world',
          expirationEmailMessage: 'Sample expiration message'
        },
        siteId: 100
      }))
    },
    method: 'GET',
    path: '/sites'
  })

  server.route({
    handler (request, reply) {
      reply(formatResponse({
        assessments: 648927,
        dxAsmts: 103669,
        dxParentStudies: 9,
        dxScans: 4679,
        dxStudies: 15,
        dxSubjects: 4801,
        instruments: 3135,
        participants: 45923,
        scans: 47892,
        studies: 661,
        uniqueParticipantEnrollments: 66858
      }))
    },
    method: 'GET',
    path: '/statistics'
  })

  server.route({
    handler (request, reply) {
      return reply('Not implemented').code(501)
    },
    method: 'GET',
    path: '/users/check'
  })

  server.route({
    handler (request, reply) {
      const { payload: { username } } = request

      return reply(
        formatResponse(getUserResponse(atob(username)).user)
      )
        .code(201)
    },
    method: 'POST',
    path: '/users'
  })

  next()
}

module.exports.register.attributes = {
  name: 'api'
}
