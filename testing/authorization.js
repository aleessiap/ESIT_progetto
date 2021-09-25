let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});

it ('3 - add authorization', function(done) {

  request(server)
    .post('/api/auths/')
    .send({ door_id: '111111111111111111111111', user_id: '111111111111111111111111'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});


it ('4 - add authorization with user who has not completed the first access procedure', function(done) {

  request(server)
    .post('/api/auths/')
    .send({ door_id: '111111111111111111111111', user_id: '111111111111111111111112'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});
