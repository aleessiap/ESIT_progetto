let request = require('supertest');
const assert = require("assert");

let server;

beforeEach(function () {
  server = require('../server/index').server;
});

it ('12 - recover password wrong email', function(done) {
  request(server)
    .post('/api/users/recover-pin')
    .send({ email: 'bruce@wayne.inc'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("User not found: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('13 - send pin without sending email first', function(done) {
  request(server)
    .post('/api/users/recover-password')
    .send({ pin: '232324'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("No pin requested: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('14 - send email and wrong pin', function(done) {

  request(server)
    .post('/api/users/recover-pin')
    .send({email: 'fr.contu@outlook.com'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      console.log("User found:")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });

  request(server)
    .post('/api/users/recover-password')
    .send({ pin: '232324'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("Wrong pin: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('15 - send email and pin after 60 seconds', function(done) {

  request(server)
    .post('/api/users/recover-pin')
    .send({ email: 'fr.contu@outlook.com'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("User found:")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });

  setTimeout(()=>{  request(server)
    .post('/api/users/recover-password')
    .send({ pin: '232324'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("Requested pin expired: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });

    done();

    }, 1*1000)



});

