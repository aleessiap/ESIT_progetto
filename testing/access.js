let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index').server;
});


it ('20 - add access', function(done) {
  request(server)
    .post('/api/access')
    .send({ _id: '0', user_id: '0', door_id: '0'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log("register sux: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

it ('21 - delete access', function(done) {
  request(server)
    .delete('/api/access/0')
    .send()
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log("register sux: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

