let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});


it ('11 - add door', function(done) {
  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('111111111111111111111115'), name: 'new_door', description: 'new_door', aws_thing_name: 'aws_thing_name_new_door', state: 1, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)
    });
  done();
});

it ('12 - add door with a name already used', function(done) {
  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('111111111111111111111116'), name: 'door', description: 'description', aws_thing_name: 'aws_thing_name', state: 1, online: false, authorizations:{}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});

it ('13 - add door with a aws_thing_name already used', function(done) {
  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('111111111111111111111116'), name: 'name', description: 'description', aws_thing_name: 'door', state: 1, online: false, authorizations:{}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});

