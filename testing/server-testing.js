var request = require('supertest');
const assert = require("assert");
const User = require ('../server/models/user');
//inside describe block
var server;
beforeEach(function () {
  server = require('../server/index').server;
});


it('should respond with JSON data when the root is called', function (done) {
  request(server)
    .get('/')
    .expect(200)
    .end(function (err, response) {
      assert.equal(response.header['content-type'], 'application/json; charset=utf-8');
      done();
    });
});

it('should send 404 when a request is made to any other path', function (done) {
  request(server)
    .get('/another/path/not/defined')
    .expect(404, done);
});

it ('register a user', function(done) {
  request(server)
    .post('/api/add-user')

    .send({ name: 'user', surname: 'user', phone_num: '3425581425', birthdate: '2021-07-25T00:00:00.000+00:00', email:'user' })

    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      assert.equal(res.type, User);
    });
    done();
});


it ('cannot register a user with an email already registered', function(done) {
  request(server)
    .post('/api/add-user')

    .send({ name: 'user', surname: 'user', phone_num: '3425581425', birthdate: '2021-07-25T00:00:00.000+00:00', email:'user' })
    .expect(400)
    done();

});


it ('login user not registered', function(done) {
  request(server)
    .post('/api/access')
    .send({ username: 'bruce@wayne.inc', password: 'batman' })
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

      done();
    });
});

it ('login user registered', function(done) {
  request(server)
    .post('/api/access')

    .send({ username: 'user', password: 'password' })

    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      assert.equal(res.type, User);
    });
  done();
});
