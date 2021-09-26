let request = require('supertest');
const assert = require("assert");
let server;

beforeEach(function () {
  server = require('../server/index-testing').server;
});

/**This script contains all the tests concerning the login and logout procedures.**/

it ('15 - This test checks that a user who is not registered in the system cannot log in', function(done) {
  request(server)
    .post('/api/users/login')
    .send({ username: 'user_not_registered@gmail.it', password: 'password' })
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error' + err.message);

      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('16 - This test checks that a user registered in the system can log in', function(done) {

  request(server)
    .post('/api/users/login')
    .send({ username: 'admin@gmail.it', password: 'password' })
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

it ('17 - This test checks that a user can logout', function(done) {

  request(server)
    .post('/api/users/login')
    .send({ username: 'admin@gmail.it', password: 'password' })
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error' + err.message);

    });

  request(server)
    .get('/api/users/logout')
    .end(function(err, res) {

      if (err) console.log('error' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.msg, "Logout effettuato");

    });
  done();
});


