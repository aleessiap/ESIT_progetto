let request = require('supertest');
const assert = require("assert");


let server;

beforeEach(function () {
  server = require('../server/index').server;
});

it ('7 - login user not registered', function(done) {
  request(server)
    .post('/api/users//login')
    .send({ username: 'bruce@wayne.inc', password: 'batman' })
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      console.log("Login user nnot : ")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);
    });
  done();

});

it ('8 - login user registered', function(done) {

  request(server)
    .post('/api/users/login')

    .send({ username: 'username', password: 'password' })
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      console.log("Cannot login sux  : ")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);
    });
  done();
});

it ('9 - logout', function(done) {

  request(server)
    .get('/api/users/logout')
    .end(function(err, res) {
      if (err) console.log('error' + err.message);

      console.log("Cannot logout  : ")
      console.log(res.body)
      assert.strictEqual(res.body.msg, "Logout done");
    });
  done();
});
