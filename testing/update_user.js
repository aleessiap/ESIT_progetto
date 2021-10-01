let request = require('supertest');
const assert = require("assert");
let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});

/**This script contains all the tests concerning the procedure to update user data.**/


it ('34 - This test checks that a user can update correctly his data', function(done) {

  request(server)
    .put('/api/users/')
    .send({id: "111111111111111111111112", profile: {name:"Mario", surname:"Rossi", email:"mrossi@gmail.com", phone_num: "0202020222", birthdate: "2020-10-20T00:00:00.000+00:00", username:"another_new_username"}, email:true, phone:true, username: true })
    .end(function(err, res) {

      if (err) console.log('error 34 ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});

it ('35 - This test checks that a user cannot update his data with a username already used', function(done) {

  request(server)
    .put('/api/users/')
    .send({id: "111111111111111111111113", profile: {name:"Luca", surname:"Bianchi", email:"another_user@gmail.it", phone_num: "0000000012", birthdate: "2020-10-20T00:00:00.000+00:00", username: "admin"}, email:false, phone:false, username:true })
    .end(function(err, res) {

      if (err) console.log('error 35 ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();
});

it ('36 - This test checks that a user cannot update his data with a phone number already used', function(done) {

  request(server)
    .put('/api/users/')
    .send({id: "111111111111111111111112", profile: {name:"Mario", surname:"Rossi", email:"mrossi@gmail.com", phone_num: "0000000000", birthdate: "2020-10-20T00:00:00.000+00:00", username:"another_new_username"}, email:false, phone:true, username:false })
    .end(function(err, res) {

      if (err) console.log('error 36 ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();
});

it ('37 - This test checks that a user cannot update his data with a email already used', function(done) {

  request(server)
    .put('/api/users/')
    .send({id: "111111111111111111111112", profile: {name:"Mario", surname:"Rossi", email:"another_user@gmail.it", phone_num: "0202020222", birthdate: "2020-10-20T00:00:00.000+00:00", username:"another_new_username"}, email:false, phone:false, username: true })
    .end(function(err, res) {

      if (err) console.log('error 37 ' + err.message);
      //console.log(res.body)
      assert.strictEqual(res.body.success, false);

    });
  done();
});
