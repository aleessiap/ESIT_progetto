let request = require('supertest');
const assert = require("assert");

let server;
beforeEach(function () {
  server = require('../server/index-testing').server;
});


it ('10 - delete a user', function(done) {
  request(server)
    .delete('/api/users/111111111111111111111115')
    .end(function(err, res) {

      if (err) console.log('error' + err.message);
      console.log(res.body)
      assert.strictEqual(res.body.success, true);

    });
  done();
});
