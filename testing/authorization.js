let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});
/**This script contains all the tests concerning authorizations and their management.**/

it ('4 - This test checks that an authorization can be correctly added', function(done) {

  request(server)
    .post('/api/auths/')
    .send({ door_id: '111111111111111111111111', user_id: '111111111111111111111111'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error 4 ' + err.message);
      //console.log(res.body)

    });
  done();
});


it ('5 - This test checks that an authorization cannot be added if the user has not yet completed the first access procedure', function(done) {

  request(server)
    .post('/api/auths/')
    .send({ door_id: '111111111111111111111111', user_id: '111111111111111111111112'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error 5 ' + err.message);
      //console.log(res.body)

    });
  done();
});

it ('6 - This test checks that you can delete an authorization ', function(done) {

  request(server)
    .delete('/api/auths/111111111111111111111111/111111111111111111111111')
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error 6 ' + err.message);
      //console.log(res.body)

    });
  done();
});
