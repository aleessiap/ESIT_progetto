let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});

/**This script contains all the tests concerning accesses and their management.**/

it ('1 - This test checks that an access can be correctly added to the database', function(done) {

  request(server)
    .post('/api/access')
    .send({ _id: '111111111111111111111122', user_id: '111111111111111111111111', door_id: '111111111111111111111111'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, true)

    });
  done();
});

it ('2 - This test checks that an access cannot be registered if the user is not authorised to access the port', function(done) {

  request(server)
    .post('/api/access')
    .send({ _id: '111111111111111111111141', user_id: '111111111111111111111111', door_id: '111111111111111111111112'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false)

    });
  done();
});

it ('3 - This test checks that you can correctly delete an access from the database', function(done) {

  request(server)
    .delete('/api/access/111111111111111111111112')
    .send()
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      //console.log(res.body)

    });
  done();
});


