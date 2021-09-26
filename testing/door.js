let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});

/**This script contains all the tests relating to the creation of doors and their deletion.**/


it ('11 - This test checks that a door can be registered correctly', function(done) {

  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('111111111111111111111115'), name: 'new_door', description: 'new_door', aws_thing_name: 'aws_thing_name_new_door', state: 1, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)

    });
  done();
});

it ('12 - This test checks that a door cannot be registered under a name already registered in the system', function(done) {

  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('111111111111111111111116'), name: 'door', description: 'description', aws_thing_name: 'aws_thing_name', state: 1, online: false, authorizations:{}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)

    });
  done();
});

it ('13 - This test checks that you cannot register a door with an aws_thing_name already registered in the system', function(done) {

  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('111111111111111111111116'), name: 'name', description: 'description', aws_thing_name: 'door', state: 1, online: false, authorizations:{}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)

    });
  done();
});

it ('14 - This test checks that a door can be deleted from the system', function(done) {

  request(server)
    .delete('/api/doors/111111111111111111111117')
    .send()
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)

    });
  done();
});
