let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index').server;
});

it (' add another door', function(done) {
  request(server)
    .post('/api/doors/')
    .send({ _id: mongoose.Types.ObjectId('612c897c2e469a20f4558888'), name: 'already_used', description: 'already_used', aws_thing_name: 'already_used', state: false, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});


it ('19- update door', function(done) {
  request(server)
    .put('/api/doors/')
    .send({currentDoor: { _id: mongoose.Types.ObjectId('612c897c2e469a20f45588f5'), name: 'name', description: 'desc', aws_thing_name: 'aws_thing_name', state: false, online: false, authorizations:{}}, data:{name: 'new_name', description: 'desc', aws_thing_name: 'aws_thing_name'}})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});


it ('20- update door with a name already used', function(done) {
  request(server)

    .put('/api/doors/')
    .send({currentDoor: { _id: mongoose.Types.ObjectId('612c897c2e469a20f45588f5'), name: 'new_name', description: 'desc', aws_thing_name: 'aws_thing_name', state: false, online: false, authorizations:{}}, data:{name: 'already_used', description: 'desc', aws_thing_name: 'aws_thing_name'}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();
});

it ('21 - update door with a aws_thing_name already used', function(done) {
  request(server)
    .put('/api/doors/')
    .send({currentDoor: { _id: mongoose.Types.ObjectId('612c897c2e469a20f45588f5'), name: 'new_name', description: 'desc', aws_thing_name: 'aws_thing_name', state: false, online: false, authorizations:{}}, data:{name: 'new_name', description: 'desc', aws_thing_name: 'already_used'}})
    .expect(403)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();
});

it ('23 - delete door', function(done) {
  request(server)
    .delete('/api/doors/612c897c2e469a20f4558888')
    .send()
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error ' + err.message);
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});
