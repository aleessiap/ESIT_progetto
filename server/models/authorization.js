const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorizationSchema = new Schema(

  {

    user_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    door_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    time_limit: { type: Number, required: true, default: 10 },
    pin: { type: String, required: true }

  }

);

module.exports = mongoose.model('Authorization', authorizationSchema, 'Authorization');
