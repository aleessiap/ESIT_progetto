let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});
/**This script contains all the tests concerning the locking and unlocking of doors.**/


it ('7 - This test checks that a door can be correctly locked', function(done) {

  request(server)
    .post('/api/doors/lock')
    .send({ _id:'111111111111111111111111'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

it ('8 - This test checks that a port cannot be locked if it is already locked', function(done) {

  request(server)
    .post('/api/doors/lock')
    .send({ _id:'111111111111111111111113'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();
});

it ('9 - This test checks that an already locked door can be unlocked', function(done) {

  request(server)
    .post('/api/doors/unlock')
    .send({ _id:'111111111111111111111113'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

it ('10 - This test checks that a door cannot be unlocked if it is not locked.', function(done) {

  request(server)
    .post('/api/doors/unlock')
    .send({ _id:'111111111111111111111112'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();
});
