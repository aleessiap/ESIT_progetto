let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index').server;
});
it ('11 -block a door', function(done) {

  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('222222222222222222222222'), name: 'nameDoor', description: 'desc', aws_thing_name: 'aws_thing_nameDoor', state: 1, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  request(server)
    .post('/api/lock')
    .send({ _id:'222222222222222222222222'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});
it ('11 - cant block a door with state 0', function(done) {

  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('222222222222222222222227'), name: 'nameDoor2', description: 'desc', aws_thing_name: 'aws_thing_nameDoor2', state: 0, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  request(server)
    .post('/api/lock')
    .send({ _id:'222222222222222222222227'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});
it ('11 -unlock a door', function(done) {

  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('222222222222222222222288'), name: 'nameDoor88', description: 'desc', aws_thing_name: 'aws_thing_nameDoor88', state: 1, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  request(server)
    .post('/api/lock')
    .send({ _id:'222222222222222222222288'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  request(server)
    .post('/api/unlock')
    .send({ _id:'222222222222222222222288'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});
it ('11 - cant unlock a door not blocked', function(done) {

  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('222222222222222222222289'), name: 'nameDoor89', description: 'desc', aws_thing_name: 'aws_thing_nameDoor89', state: 1, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });

  request(server)
    .post('/api/unlock')
    .send({ _id:'222222222222222222222289'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});
