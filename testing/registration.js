let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});
it ('23 - register a user', function(done) {

  request(server)
    .post('/api/users/add-user')

    .send({_id:'111111111111111111111118', name: 'register_user', surname: 'register_user', username: 'register_user', phone_num: '3425581000', birthdate: '2021-07-25T00:00:00.000+00:00', email:'register_user@gmail.it'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, true);

    });
  done();
});


it ('24 - cannot register a user with an email already registered', function(done) {
  request(server)
    .post('/api/users/add-user')

    .send({ name: 'name', surname: 'surname', username: 'username', phone_num: '3425000000', birthdate: '2021-07-25T00:00:00.000+00:00', email:'admin@gmail.it' })
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.email, 1);
    });
  done();

});

it ('25 - cannot register a user with an username already used', function(done) {
  request(server)
    .post('/api/users/add-user')

    .send({ name: 'name', surname: 'surname', username: 'admin', phone_num: '3425000000', birthdate: '2021-07-25T00:00:00.000+00:00', email:'email@gmail.com' })
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.username, 1);
    });
  done();

});

it ('26 - cannot register a user with a phone number already registered', function(done) {
  request(server)
    .post('/api/users/add-user')

    .send({ name: 'name', surname: 'surname', username: 'username', phone_num: '0000000000', birthdate: '2021-07-25T00:00:00.000+00:00', email:'email@gmail.com' })
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.phone, 1);
    });
  done();

});
