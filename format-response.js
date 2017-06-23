const url = require('url')

module.exports.register = (server, options, next) => {
  server.ext('onPreResponse', (request, reply) => {
    if (request.response.isBoom) {
      return reply({
        data: [],
        error: Object.assign({}, request.response.output.payload, {
          debugData: request.response.data
        }),
        stats: {}
      })
        /**
         * steelpenny's nginx reverse proxy still sends CORS headers with
         * responses on invalid requests. Match this behavior.
         */
        .header('Access-Control-Allow-Credentials', 'true')
        .header(
          'Access-Control-Allow-Origin',
          url.format(Object.assign(
            url.parse(request.info.referrer),
            {
              pathname: '',
              query: '',
              search: ''
            }
          ))
        )
        .code(request.response.output.statusCode)
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
