let request = require('supertest');
const assert = require("assert");
let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});

it ('18 - recover password not first access', function(done) {

  request(server)
    .post('/api/users/recover-pin')
    .send({ email: 'not_authorized@gmail.it'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("18: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('19 - recover password ', function(done) {

  request(server)
    .post('/api/users/recover-pin')
    .send({ email: 'another_user@gmail.it'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("19: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();

});

it ('20 - recover password wrong email', function(done) {
  request(server)
    .post('/api/users/recover-pin')
    .send({ email: 'bruce@wayne.inc'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("20: User not found")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('21 - send pin without sending email first', function(done) {
  request(server)
    .post('/api/users/recover-password')
    .send({ pin: '232324'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("21: No pin requested")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});

it ('22 - send email and wrong pin', function(done) {
  request(server)

  request(server)
    .post('/api/users/recover-pin')
    .send({email: 'admin@gmail.it'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error' + err.message);
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });

  request(server)
    .post('/api/users/recover-password')
    .send({ pin: '23232488'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("22: Wrong pin")
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();

});
/***
it ('23 - send email and pin after 60 seconds', function(done) {
  request(server)

  request(server)
    .post('/api/users/recover-pin')
    .send({ email: 'admin@gmail.it'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("User found:")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });


    setTimeout(()=>{
      request(server)
        .post('/api/users/recover-password')
        .send({ pin: '232324'})
        .expect(403)
        .end(function(err, res) {
          if (err) console.log('error ' + err.message);
          console.log("23 Requested pin expired: ")
          console.log(res.body)
          assert.strictEqual(res.body, false);
          done();
        });
      }, 60*1000)
  done();
});***/


