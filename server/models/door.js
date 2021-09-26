const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const authorizationSchema = require('./authorization');


// Door Schema
const doorSchema = new Schema(

  {

    name: { type: String, required: true },
    aws_thing_name: { type: String, required: true },
    description: {type: String, required: true},
    state: { type: Number, required: true },
    online: { type: Boolean, required: true },
    authorizations: { type: authorizationSchema, required: true }

  }

);

module.exports = mongoose.model('Door', doorSchema, 'Door');
