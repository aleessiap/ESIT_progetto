let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});


it ('1 - add access', function(done) {
  request(server)
    .post('/api/access')
    .send({ _id: '111111111111111111111111', user_id: '111111111111111111111111', door_id: '111111111111111111111111'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});

it ('2 - delete access', function(done) {
  request(server)
    .delete('/api/access/111111111111111111111112')
    .send()
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)


    });
  done();
});

