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
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

it ('17 - add door with a name already used', function(done) {
  request(server)
    .post('/api/doors')
    .send({ _id: '2', name: 'name', description: 'description', aws_thing_name: 'another_aws_thing_name'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();
});

it ('18 - add door with a aws_thing_name already used', function(done) {
  request(server)
    .post('/api/doors')
    .send({ _id: '2', name: 'door_name', description: 'description', aws_thing_name: 'aws_thing_name'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();
});

it ('19 - delete door', function(done) {
  request(server)
    .delete('/api/doors/0')
    .send()
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

