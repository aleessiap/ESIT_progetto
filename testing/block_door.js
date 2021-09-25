let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});
it ('5 -lock a door', function(done) {

  request(server)
    .post('/api/doors/lock')
    .send({ _id:'111111111111111111111111'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("5:")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);
    });
  done();
});

it ('6 - cant block a door with state 0 (already locked)', function(done) {

  request(server)
    .post('/api/doors/lock')
    .send({ _id:'111111111111111111111113'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("6:")

      console.log(res.body)
      assert.strictEqual(res.body.success, false);
    });
  done();
});

it ('7 -unlock a door', function(done) {

  request(server)
    .post('/api/doors/unlock')
    .send({ _id:'111111111111111111111113'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("7:")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);
    });
  done();
});

it ('8 - cant unlock a door not blocked', function(done) {
;

  request(server)
    .post('/api/doors/unlock')
    .send({ _id:'111111111111111111111112'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log("8:")

      console.log(res.body)
      assert.strictEqual(res.body.success, false);
    });
  done();
});
