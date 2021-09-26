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
    .send({ _id: '111111111111111111111122', user_id: '111111111111111111111111', door_id: '111111111111111111111111'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log('1')
      console.log(res.body)
      assert.strictEqual(res.body.success, true)

    });
  done();
});


it ('1 - cant add access if not authorized', function(done) {
  request(server)
    .post('/api/access')
    .send({ _id: '111111111111111111111141', user_id: '111111111111111111111111', door_id: '111111111111111111111112'})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log('2')
      console.log(res.body)
      assert.strictEqual(res.body.success, false)
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
      console.log('3')
      //console.log(res.body)


    });
  done();
});


