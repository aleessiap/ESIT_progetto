let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index').server;
});


it ('11 - delete a user', function(done) {
  request(server)
    .delete('/api/users/0')
    .send({ name: 'user', surname: 'user', username: 'username', phone_num: '3425581425', birthdate: '2021-07-25T00:00:00.000+00:00', email:'user@gmail.it'})
    .end(function(err, res) {

      if (err) console.log('error' + err.message);
      console.log("register sux: ")
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});
