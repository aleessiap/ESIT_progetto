let request = require('supertest');
const assert = require("assert");

let server;

beforeEach(function () {
  server = require('../server/index-testing').server;
});


it('27 - should respond with JSON data when the root is called', function (done) {
  request(server)
    .get('/')
    .expect(200)
    .end(function (err, response) {
      assert.strictEqual(response.header['content-type'], 'text/html; charset=utf-8');

    });
  done();
});

it('28 - should send 404 when a request is made to any other path', function (done) {
  request(server)
    .get('/another/path/not/defined')
    .expect(404);
    done();
});



