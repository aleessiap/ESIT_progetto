let request = require('supertest');
const assert = require("assert");
let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});

/**This script contains all the tests concerning the procedure to recover the password.**/


it ('18 - This test checks that the password cannot be recovered if the user has not completed the first login procedure', function(done) {

  request(server)
    .post('/api/users/recover-pin')
    .send({ email: 'not_authorized@gmail.it'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error 18 ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('19 - This test checks that the password can be recovered', function(done) {

  request(server)
    .post('/api/users/recover-pin')
    .send({ email: 'another_user@gmail.it'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error 19 ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();

});

it ('20 - This test checks that you cannot recover your password if you insert an email address that is not registered in the system', function(done) {
  request(server)
    .post('/api/users/recover-pin')
    .send({ email: 'bruce@wayne.inc'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error 20 ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('21 - This test checks that the password cannot be recovered if the PIN is entered first', function(done) {
  request(server)
    .post('/api/users/recover-password')
    .send({ pin: '232324'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error 21 ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('22 - This test checks that you cannot recover your password if you enter the wrong PIN', function(done) {
  request(server)

  request(server)
    .post('/api/users/recover-pin')
    .send({email: 'admin@gmail.it'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error 22-a  ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });

  request(server)
    .post('/api/users/recover-password')
    .send({ pin: '23232488'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error 22-b ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});


