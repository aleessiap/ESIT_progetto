const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accessSchema = new Schema(

  {

    user_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    door_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    access_time: { type: Date, required: true, default: Date.now}

  }

);

module.exports = mongoose.model('Access', accessSchema, 'Access');
