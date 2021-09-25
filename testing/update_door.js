let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});


it ('29- update door', function(done) {
  request(server)
    .put('/api/doors/')
    .send({currentDoor: { _id: mongoose.Types.ObjectId('111111111111111111111113'), name: 'office', description: 'office', aws_thing_name: 'office', state: 0, online: false, authorizations:{}}, data:{name: 'new_name', description: 'desc', aws_thing_name: 'aws_thing_name'}})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});


it ('30- update door with a name already used', function(done) {
  request(server)

    .put('/api/doors/')
    .send({currentDoor: { _id: mongoose.Types.ObjectId('111111111111111111111113'), name: 'new_name', description: 'desc', aws_thing_name: 'aws_thing_name', state: 0, online: false, authorizations:{}}, data:{name: 'door', description: 'another_desc', aws_thing_name: 'another_aws_thing_name'}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});

it ('31 - update door with a aws_thing_name already used', function(done) {
  request(server)
    .put('/api/doors/')
    .send({currentDoor: { _id: mongoose.Types.ObjectId('111111111111111111111113'), name: 'new_name', description: 'desc', aws_thing_name: 'aws_thing_name', state: 0, online: false, authorizations:{}}, data:{name: 'another_name', description: 'another_desc', aws_thing_name: 'door'}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});

it ('32 - delete door', function(done) {

  request(server)
    .delete('/api/doors/111111111111111111111117')
    .send()
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});
