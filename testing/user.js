let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});

/**This script contains all the tests concerning to the creation of users and their deletion.**/

it ('29 - This test checks that a new user can be correctly registered in the system', function(done) {

  request(server)
    .post('/api/users/add-user')

    .send({_id:'111111111111111111111118', name: 'register_user', surname: 'register_user', username: 'register_user', phone_num: '3425581000', birthdate: '2021-07-25T00:00:00.000+00:00', email:'register_user@gmail.it'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error 29 ' + err.message);
      assert.strictEqual(res.body.success, true);

    });
  done();
});


it ('30 - This test checks that it is not possible to register a new user with an email address already present in the system.', function(done) {

  request(server)
    .post('/api/users/add-user')

    .send({ name: 'name', surname: 'surname', username: 'username', phone_num: '3425000000', birthdate: '2021-07-25T00:00:00.000+00:00', email:'admin@gmail.it' })
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error 30 ' + err.message);
      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.email, 1);

    });
  done();

});

it ('31 - This test checks that it is not possible to register a new user with a username already present in the system.', function(done) {

  request(server)
    .post('/api/users/add-user')

    .send({ name: 'name', surname: 'surname', username: 'admin', phone_num: '3425000000', birthdate: '2021-07-25T00:00:00.000+00:00', email:'email@gmail.com' })
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error 31 ' + err.message);
      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.username, 1);

    });
  done();

});

it ('32 - This test checks that a new user cannot be registered with a phone number already present in the system', function(done) {

  request(server)
    .post('/api/users/add-user')

    .send({ name: 'name', surname: 'surname', username: 'username', phone_num: '0000000000', birthdate: '2021-07-25T00:00:00.000+00:00', email:'email@gmail.com' })
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error 32 ' + err.message);
      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.phone, 1);

    });
  done();

});

it ('33 - This test checks that a user can be correctly deleted from the system', function(done) {

  request(server)
    .delete('/api/users/111111111111111111111115')
    .end(function(err, res) {

      if (err) console.log('error 33 ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

