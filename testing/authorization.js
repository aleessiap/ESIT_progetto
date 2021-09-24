let mongoose = require('mongoose');
let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index').server;
});

it ('28 - add authorization', function(done) {
  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('222c222c2c222c22c2222c22'), name: 'name_door', description: 'desc_door', aws_thing_name: 'aws_thing_name_door', state: false, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  request(server)
    .post('/api/users/add-user')

    .send({_id:mongoose.Types.ObjectId('111c111c1c111c11c1111c11'), name: 'name_user', surname: 'surname_user', username: 'username_user', phone_num: '3425500425', chat_id: '342m', birthdate: '2021-07-25T00:00:00.000+00:00', email:'user_email@gmail.it'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, true);

    });
  request(server)
    .post('/api/auths/')
    .send({ door_id: '222c222c2c222c22c2222c22', user_id: '111c111c1c111c11c1111c11'})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});


it ('29 - add authorization with user who has not completed the first access procedure', function(done) {
  request(server)
    .post('/api/doors')
    .send({ _id: mongoose.Types.ObjectId('222c222c2c222c22c2222c23'), name: 'name_door2', description: 'desc_door', aws_thing_name: 'aws_thing_name_door2', state: false, online: false, authorizations:{}})
    .expect(200)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  request(server)
    .post('/api/users/add-user')

    .send({_id:mongoose.Types.ObjectId('111c111c1c111c11c1111c12'), name: 'name_user', surname: 'surname_user', username: 'username_user2', phone_num: '3425500435',  birthdate: '2021-07-25T00:00:00.000+00:00', email:'user_email2@gmail.it'})
    .expect(200)
    .end(function(err, res) {

      if (err) console.log('error' + err.message);

      assert.strictEqual(res.body.success, true);

    });
  request(server)
    .post('/api/auths/')
    .send({ door_id: '222c222c2c222c22c2222c23', user_id: '111c111c1c111c11c1111c12'})
    .expect(403)
    .end(function(err, res) {
      if (err) console.log('error ' + err.message);
      console.log(res.body)

    });
  done();
});
