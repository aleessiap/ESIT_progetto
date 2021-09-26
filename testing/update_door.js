let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});

/**This script contains all the tests concerning the procedures of updating the doors.**/

it ('26 - This test checks that a door can be updated correctly', function(done) {

  request(server)
    .put('/api/doors/')
    .send({currentDoor: { _id: mongoose.Types.ObjectId('111111111111111111111113'), name: 'office', description: 'office', aws_thing_name: 'office', state: 0, online: false, authorizations:{}}, data:{name: 'new_name', description: 'desc', aws_thing_name: 'aws_thing_name'}})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)

    });
  done();
});


it ('27 - This test checks that it is not possible to update a door with a name already registered in the system', function(done) {

  request(server)
    .put('/api/doors/')
    .send({currentDoor: { _id: mongoose.Types.ObjectId('111111111111111111111113'), name: 'new_name', description: 'desc', aws_thing_name: 'aws_thing_name', state: 0, online: false, authorizations:{}}, data:{name: 'door', description: 'another_desc', aws_thing_name: 'another_aws_thing_name'}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)

    });
  done();
});

it ('28 - This test checks that it is not possible to update a door with a aws_thing_name already registered in the system', function(done) {

  request(server)
    .put('/api/doors/')
    .send({currentDoor: { _id: mongoose.Types.ObjectId('111111111111111111111113'), name: 'new_name', description: 'desc', aws_thing_name: 'aws_thing_name', state: 0, online: false, authorizations:{}}, data:{name: 'another_name', description: 'another_desc', aws_thing_name: 'door'}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)

    });
  done();
});


