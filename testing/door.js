let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index').server;
});


it ('16 - add door', function(done) {
  request(server)
    .post('/api/doors')
    .send({ _id: '0', name: 'name', description: 'desc', aws_thing_name: 'aws_thing_name'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log("register sux: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

it ('17 - delete door', function(done) {
  request(server)
    .delete('/api/doors/0')
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

