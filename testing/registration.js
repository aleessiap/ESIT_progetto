let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index').server;
});
it ('3 - register a user', function(done) {
  request(server)
    .post('/api/users/add-user')

    .send({ name: 'user', surname: 'user', username: 'username', phone_num: '3425581425', birthdate: '2021-07-25T00:00:00.000+00:00', email:'user@gmail.it'})

    .end(function(err, res) {

      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, true);

    });
  done();
});


it ('4 - cannot register a user with an email already registered', function(done) {
  request(server)
    .post('/api/users/add-user')

    .send({ name: 'email', surname: 'email', username: 'email', phone_num: '3425581426', birthdate: '2021-07-25T00:00:00.000+00:00', email:'user@gmail.it' })
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.email, 1);
    });
  done();

});

it ('5 - cannot register a user with an username already used', function(done) {
  request(server)
    .post('/api/users/add-user')

    .send({ name: 'username', surname: 'username', username: 'username', phone_num: '3489987147', birthdate: '2021-07-25T00:00:00.000+00:00', email:'username@gmail.it' })
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.username, 1);
    });
  done();

});

it ('6 - cannot register a user with a phone number already registered', function(done) {
  request(server)
    .post('/api/users/add-user')

    .send({ name: 'phone', surname: 'phone', username: 'phone', phone_num: '3425581425', birthdate: '2021-07-25T00:00:00.000+00:00', email:'phone@gmail.it' })
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.phone, 1);
    });
  done();

});
