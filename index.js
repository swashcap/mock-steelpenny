'use strict';

const http = require('http');

const PORT = 8800;

function errorHandler(error) {
  console.error(error);
  process.exit(1);
}

function getApiResponse(body) {
  try {
    const parsed = JSON.parse(body);

    /**
     * Manual atob so there's no deps.
     *
     * {@link https://github.com/node-browser-compat/atob}
     */
    const username = new Buffer(parsed.username, 'base64').toString('binary');

    if (!username) {
      throw new Error('username required');
    }

    return {
      body: {
        data: [{
          username,
          user: {
            username,
            label: 'Test User',
            activeFlag: 'Y',
            acctExpDate: '2017-06-09T06:00:00.000Z',
            passwordExpDate: '2016-12-07T07:00:00.000Z',
            siteId: '7',
            isSiteAdmin: 'Y',
            email: 'nidev@mrn.org',
            emailUnsubscribed: false,
          },
          id: '94af21e3-a581-4b1a-a8b0-180d81e3ad85',
          key: 'b09945f7-b768-47ee-b003-59e0a1b5c76a',
          algorithm: 'sha256',
          issueTime: Date.now(),
          expireTime: Date.now() + 24 * 60 * 60,
          studyRoles: {}
        }],
        error: null,
        stats: {}
      },
      statusCode: 201,
    };
  } catch (error) {
    return {
      body: {
        data: [],
        error: `Couldn't parse request: ${error.toString()}`,
        stats: {},
      },
      statusCode: 400,
    };
  }

}

function onRequest(request, response) {
  console.log('Request:', request.method, request.url);

  let body = '';

  request.on('readable', () => {
    const chunk = request.read();

    if (chunk === null) {
      const apiResponse = getApiResponse(body);

      response.writeHead(apiResponse.statusCode, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(apiResponse.body));
    } else {
      body += chunk.toString();
    }
  });

  request.on('error', error => {
    errorHandler(error);
  });
}

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', (reason, p) => {
  console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

const server = http
  .createServer(onRequest)
  .listen(PORT, error => {
    if (error) {
      errorHandler(error);
    } else {
      console.log(`Server listening on ${PORT}`);
    }
  });

module.exports = server;
