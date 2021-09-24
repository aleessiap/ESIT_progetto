let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index').server;
});

it ('28 - delete authorization', function(done) {
  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('222c222c2c222c22c2222c33'), name: 'name_door33', description: 'desc_door', aws_thing_name: 'aws_thing_name_door33', state: false, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  request(server)
    .post('/api/users/add-user')

    .send({_id:mongoose.Types.ObjectId('111c111c1c111c11c1111c22'), name: 'name_user', surname: 'surname_user', username: 'username_user22', phone_num: '3425500422', chat_id: '322m', birthdate: '2021-07-25T00:00:00.000+00:00', email:'user_email@gmail.it'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, true);

    });
  request(server)
    .post('/api/auths/')
    .send({ door_id: '222c222c2c222c22c2222c33', user_id: '111c111c1c111c11c1111c22'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });

  request(server)
    .delete('/api/auths/222c222c2c222c22c2222c33/111c111c1c111c11c1111c22')
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});
