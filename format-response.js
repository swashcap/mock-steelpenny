
module.exports.register = (server, options, next) => {
  server.ext('onPreResponse', (request, reply) => {
    if (request.response.isBoom) {
      return reply({
        data: null,
        error: Object.assign({}, request.response.output.payload, {
          debugData: request.response.data
        }),
        stats: {}
      }).code(request.response.output.statusCode)
    }

    return reply({
      data: Array.isArray(request.response.source)
        ? request.response.source
        : [request.response.source],
      error: null,
      stats: {}
    }).code(request.response.statusCode)
  })

  next()
}

module.exports.register.attributes = {
  name: 'format-response'
}
