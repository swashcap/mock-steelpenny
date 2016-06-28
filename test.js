'use strict';

const assert = require('assert');
const http = require('http');
const server = require('./index');

/**
 * As with atob, just add it here.
 *
 * {@link https://github.com/node-browser-compat/btoa}
 */
function btoa(str) {
  return new Buffer(str, 'binary').toString('base64');
}

function doTest() {
  const password = 'whatever';
  const username = 'my_test_user';

  const req = http.request({
    headers: {
      'Content-Type': 'appication/json',
    },
    method: 'POST',
    path: '/api/v1.3.0/auth/keys',
    port: 8800,
  }, res => {
    let body = '';

    assert(
      res.statusCode >= 200 && res.statusCode < 300,
      'sends 2xx status code'
    );

    res.on('data', chunk => {
      body += chunk.toString();
    });

    res.on('end', () => {
      try {
        const parsed = JSON.parse(body);
        assert.equal(parsed.data[0].username, username, 'returns username');

        // Kill the server to stop the test
        server.close(() => {
          console.log('👍  All tests passed');
        });
      } catch (error) {
        assert.ifError(error);
      }
    });
  });

  req.on('error', error => {
    assert.ifError(error);
  });

  req.write(JSON.stringify({
    password: btoa(password),
    username: btoa(username),
  }));
  req.end();
}

/**
 * {@link https://nodejs.org/api/net.html#net_event_listening}
 */
if (server.listening) {
  doTest();
} else {
  server.on('listening', doTest);
}
