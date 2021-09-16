var request = require('supertest');
const assert = require("assert");
const User = require ('../server/models/user');
//inside describe block
var server;
beforeEach(function () {
  server = require('../server/index').server;
});


it('1 - should respond with JSON data when the root is called', function (done) {
  request(server)
    .get('/')
    .expect(200)
    .end(function (err, response) {
      assert.equal(response.header['content-type'], 'application/json; charset=utf-8');

    });
  done();
});

it('2 - should send 404 when a request is made to any other path', function (done) {
  request(server)
    .get('/another/path/not/defined')
    .expect(404, done);
});



