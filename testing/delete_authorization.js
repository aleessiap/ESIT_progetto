let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});

it ('9 - delete authorization', function(done) {


  request(server)
    .delete('/api/auths/111111111111111111111111/111111111111111111111111')
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});
