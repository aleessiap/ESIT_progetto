let request = require('supertest');
const assert = require("assert");
let server;

beforeEach(function () {
  server = require('../server/index-testing').server;
});

it ('14 - login user not registered', function(done) {
  request(server)
    .post('/api/users/login')
    .send({ username: 'user_not_registered@gmail.it', password: 'password' })
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      console.log("Login user not found: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);
    });
  done();

});

it ('15 - login user registered', function(done) {

  request(server)
    .post('/api/users/login')
    .send({ username: 'admin@gmail.it', password: 'password' })
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      console.log("Login successful: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);
    });
  done();
});

it ('16 - logout', function(done) {

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

      console.log("Logout  : ")
      console.log(res.body)
      assert.strictEqual(res.body.msg, "Logout effettuato");
    });
  done();
});

it ('17 - login user not registered', function(done) {
  request(server)
    .post('/api/users/login')
    .send({ username: 'bruce@wayne.inc', password: 'batman' })
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      console.log("Login user not found: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);
    });
  done();

});
