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

it ('3 - register a user', function(done) {
  request(server)
    .post('/api/users/add-user')

    .send({ name: 'user', surname: 'user', phone_num: '3425581425', birthdate: '2021-07-25T00:00:00.000+00:00', email:'user' })

    .end(function(err, res) {
      console.log(res)
      if (err) console.log('error' + err.message);
      assert.strictEqual(res.userFound.type, User);
    });
    done();
});


it ('4 - cannot register a user with an email already registered', function(done) {
  request(server)
    .post('/api/users/add-user')

    .send({ name: 'user', surname: 'user', phone_num: '3425581425', birthdate: '2021-07-25T00:00:00.000+00:00', email:'user' })
    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      assert.strictEqual(res.found, true);
      console.log(res.email);
      assert.strictEqual(res.email, 1);
    });
    done();

});


it ('5 - login user not registered', function(done) {
  request(server)
    .post('/api/users//login')
    .send({ username: 'bruce@wayne.inc', password: 'batman' })
    .expect(403)
    .expect(500)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

    });
  done();

});

it ('6 - login user registered', function(done) {
  request(server)
    .post('/api/users/login')

    .send({ username: 'user', password: 'password' })
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

      assert.strictEqual(res.userFound.type, User);
    });
  done();
});
