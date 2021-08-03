const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doorSchema = new Schema(

  {

    name: { type: String, required: true },
    aws_thing_name: { type: String, required: true },
    description: {type: String, required: true},
    state: { type: Boolean, required: true },
    online: { type: Boolean, required: true },
    authorizations: { type: Object, required: true }

  }

);

module.exports = mongoose.model('Door', doorSchema, 'Door');
